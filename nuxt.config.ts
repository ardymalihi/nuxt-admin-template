// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      version: process.env.VERSION,
    },
  },
  modules: [
    '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],
  devtools: { enabled: true },
  sourcemap: {
    server: true,
    client: true
  },
})
