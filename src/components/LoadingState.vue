<template>
  <div class="loading-state" aria-live="polite" aria-label="Loading weather">
    <div class="spinner"><span></span><span></span><span></span></div>
    <p>Reading the sky...</p>
    <div class="skeleton hero-skeleton"></div>
    <div class="skeleton-row"><div v-for="i in 5" :key="i" class="skeleton"></div></div>
  </div>
</template>
