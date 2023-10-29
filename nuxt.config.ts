// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
    // 'nuxt-security',
    '@pinia/nuxt',
    '@formkit/nuxt',
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
/*  security: {
    nonce: true,
    headers: {
      crossOriginEmbedderPolicy: {
        value: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
        route: '/!**',
      },
    },
  },
  routeRules: {
    '/client/initiative': {
      security: {
        requestSizeLimiter: {
          maxRequestSizeInBytes: 9437184,
          maxUploadFileRequestInBytes: 2097152,
        },
        xssValidator: {

        }
      }
    }
  },*/
  experimental: {
    headNext: true
  },
  devtools: {
    enabled: false,
    timeline: {
      enabled: true,
    },
  },
  image: {
  },
  vite: {
    clearScreen: true,
  },
  formkit: {
    autoImport: true
  }
})