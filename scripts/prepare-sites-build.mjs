import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'

await mkdir('dist/server', { recursive: true })
await mkdir('dist/.openai', { recursive: true })
await cp('.openai/hosting.json', 'dist/.openai/hosting.json')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
}
const files = ['index.html', '_redirects', 'favicon.svg']
const assetFiles = await readdir('dist/assets')
files.push(...assetFiles.filter(file => !file.endsWith('.map')).map(file => `assets/${file}`))

const embedded = {}
for (const file of files) {
  embedded[`/${file}`] = {
    body: await readFile(`dist/${file}`, 'utf8'),
    type: contentTypes[extname(file)] || 'application/octet-stream',
  }
}

const worker = await readFile('worker/index.js', 'utf8')
await writeFile('dist/server/index.js', `${worker}\nconst EMBEDDED_ASSETS = ${JSON.stringify(embedded)};\n`)
