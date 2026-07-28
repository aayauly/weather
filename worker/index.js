const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
})
const bytesToHex = bytes => [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('')
const randomHex = size => bytesToHex(crypto.getRandomValues(new Uint8Array(size)))
const sha256 = async value => bytesToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
const passwordHash = async (password, salt) => {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120000 }, material, 256)
  return bytesToHex(bits)
}
const safeEqual = (a, b) => {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}
const cookieValue = request => {
  const match = request.headers.get('cookie')?.match(/(?:^|;\s*)atmos_session=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}
const sessionCookie = (token, maxAge = 2592000) => `atmos_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
const userJson = user => ({
  id: user.id, name: user.name, email: user.email,
  avatarUrl: user.avatar_key ? `/api/avatar/${user.id}` : null,
  createdAt: user.created_at,
})
const currentUser = async (request, env) => {
  const token = cookieValue(request)
  if (!token) return null
  const hash = await sha256(token)
  return env.DB.prepare(`SELECT users.id, users.name, users.email, users.avatar_key, users.created_at
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`).bind(hash, new Date().toISOString()).first()
}
const createSession = async (userId, env) => {
  const token = randomHex(32)
  await env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), userId, await sha256(token), new Date(Date.now() + 2592000000).toISOString(), new Date().toISOString()).run()
  return token
}
const parseJson = async request => {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new Error('INVALID_CONTENT')
  return request.json()
}
const sameOrigin = request => {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}

async function api(request, env, url) {
  if (!sameOrigin(request)) return json({ error: 'Request origin is not allowed.' }, 403)

  if (request.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await parseJson(request)
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (name.length < 2 || name.length > 60) return json({ error: 'Enter a name between 2 and 60 characters.' }, 400)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400)
    if (password.length < 8 || password.length > 128) return json({ error: 'Password must be between 8 and 128 characters.' }, 400)
    if (await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()) return json({ error: 'An account with this email already exists.' }, 409)
    const id = crypto.randomUUID()
    const salt = randomHex(16)
    const createdAt = new Date().toISOString()
    await env.DB.prepare('INSERT INTO users (id, name, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, name, email, await passwordHash(password, salt), salt, createdAt).run()
    const token = await createSession(id, env)
    return json({ user: { id, name, email, avatarUrl: null, createdAt } }, 201, { 'set-cookie': sessionCookie(token) })
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await parseJson(request)
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    if (!user || !safeEqual(await passwordHash(password, user.password_salt), user.password_hash)) return json({ error: 'Email or password is incorrect.' }, 401)
    const token = await createSession(user.id, env)
    return json({ user: userJson(user) }, 200, { 'set-cookie': sessionCookie(token) })
  }

  if (request.method === 'GET' && url.pathname === '/api/auth/me') {
    const user = await currentUser(request, env)
    return user ? json({ user: userJson(user) }) : json({ error: 'Not signed in.' }, 401)
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = cookieValue(request)
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run()
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) })
  }

  if (request.method === 'POST' && url.pathname === '/api/profile/avatar') {
    const user = await currentUser(request, env)
    if (!user) return json({ error: 'Sign in to upload a profile image.' }, 401)
    const form = await request.formData()
    const file = form.get('avatar')
    if (!(file instanceof File)) return json({ error: 'Choose an image to upload.' }, 400)
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) return json({ error: 'Use a JPEG, PNG, WebP, or GIF image.' }, 415)
    if (file.size > 3 * 1024 * 1024) return json({ error: 'Image must be smaller than 3 MB.' }, 413)
    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const key = `avatars/${user.id}/${crypto.randomUUID()}.${extension}`
    await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { owner: user.id } })
    if (user.avatar_key) await env.MEDIA.delete(user.avatar_key)
    await env.DB.prepare('UPDATE users SET avatar_key = ? WHERE id = ?').bind(key, user.id).run()
    user.avatar_key = key
    return json({ user: userJson(user) })
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/avatar/')) {
    const userId = url.pathname.slice('/api/avatar/'.length)
    const row = await env.DB.prepare('SELECT avatar_key FROM users WHERE id = ?').bind(userId).first()
    if (!row?.avatar_key) return new Response('Not found', { status: 404 })
    const object = await env.MEDIA.get(row.avatar_key)
    if (!object) return new Response('Not found', { status: 404 })
    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', 'public, max-age=3600')
    return new Response(object.body, { headers })
  }

  return json({ error: 'Not found.' }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    try {
      if (url.pathname.startsWith('/api/')) return await api(request, env, url)
      const response = await env.ASSETS.fetch(request)
      if (response.status !== 404) return response
      url.pathname = '/index.html'
      return env.ASSETS.fetch(new Request(url, request))
    } catch (error) {
      console.error(error)
      return json({ error: 'The service is temporarily unavailable.' }, 500)
    }
  },
}
