// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    autoImport: true,
  },
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
  supabase: {
    redirect: false,
  },
  devtools: { enabled: true },
  sourcemap: {
    server: true,
    client: true
  },
})
