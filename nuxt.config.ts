// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/2025-spring/',
    head: {
      title: '2025雙北程式設計節',
      script: [
        {
          id: 'gtm-script',
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NUXT_PUBLIC_GTM_ID}');`,
          type: 'text/javascript',
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'gtm-script': ['innerHTML'],
      },
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
    cssPath: '~/assets/main.scss', // 修正為字符串
    configPath: 'tailwind.config.js', // 確保這裡的文件名正確
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  i18n: {
    vueI18n: '~/i18n.config.ts',
  },
});
