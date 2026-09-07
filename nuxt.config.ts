// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/2025-spring/',
    head: {
      htmlAttrs: { lang: 'zh-TW' },
      title: '2025雙北程式設計節',
      meta: [
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:site_name', content: '2025雙北程式設計節' },
        {
          name: 'description',
          content:
            '在智慧城市與數據驅動時代，創新技術成為推動城市發展與提升市政服務的關鍵。2025這一屆獨特的雙北黑客松將帶領我們探索如何運用開源技術與數據可視化，挑戰傳統思維，實現跨縣市合作，共同創造出更具競爭力的智慧解決方案。透過結合創新設計與先進技術，我們期望進一步優化市政服務，推動雙北邁向智慧城市的未來。',
        },
        {
          property: 'og:description',
          content:
            '在智慧城市與數據驅動時代，創新技術成為推動城市發展與提升市政服務的關鍵。2025這一屆獨特的雙北黑客松將帶領我們探索如何運用開源技術與數據可視化，挑戰傳統思維，實現跨縣市合作，共同創造出更具競爭力的智慧解決方案。透過結合創新設計與先進技術，我們期望進一步優化市政服務，推動雙北邁向智慧城市的未來。',
        },
        { name: 'robots', content: 'index,follow' },
        { 'http-equiv': 'cache-control', content: 'no-cache' },
        { 'http-equiv': 'expires', content: '0' },
        { 'http-equiv': 'pragma', content: 'no-cache' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/2025-spring/favicon.ico' }],
      script: [
        {
          src: '/2025-spring/js/gtm.js',
          type: 'text/javascript',
        },
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID}`,
          async: true,
          crossorigin: 'anonymous',
        },
        {
          src: '/2025-spring/js/ga.js',
          type: 'text/javascript',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      gtmId: process.env.NUXT_PUBLIC_GTM_ID,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/stylelint-module',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  tailwindcss: {
    cssPath: '~/assets/main.scss',
    configPath: 'tailwind.config.js',
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  i18n: {
    vueI18n: '~/i18n.config.ts',
    defaultLocale: 'zh',
    locales: [{ code: 'zh', language: 'zh-TW' }],
  },
});