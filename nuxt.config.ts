// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
    'nuxt-security',
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  svgo: {
    autoImportPath: './assets/svg/',
    defaultImport: 'component',
  },
  googleFonts: {
    display: 'swap',
    preconnect: true,
    families: {
      'Fira+Sans': {
        wght: [400, 600, 700],
        ital: [400, 700],
      },
    },
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: {
        value: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
        route: '/**',
      }
    },
  },
  experimental: {
    headNext: true
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
})