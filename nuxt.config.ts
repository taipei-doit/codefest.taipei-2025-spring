// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/2025-spring/',
    head: {
      title: '2025雙北程式設計節',
      meta: [
        { name: 'robots', content: 'index,follow' },
        { 'http-equiv': 'cache-control', content: 'no-cache' },
        { 'http-equiv': 'expires', content: '0' },
        { 'http-equiv': 'pragma', content: 'no-cache' },
        { 'http-equiv': 'X-Frame-Options', content: 'SAMEORIGIN' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.surveycake.com;
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            connect-src 'self' https://www.google-analytics.com https://*.surveycake.com;
            frame-src 'self' https://*.surveycake.com;
            object-src 'none';
            base-uri 'self';
            form-action 'self' https://*.surveycake.com;
            frame-ancestors 'self';
            upgrade-insecure-requests;
          `
            .replace(/\s+/g, ' ')
            .trim(),
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/2025-spring/favicon.ico' }],
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
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID}`,
          async: true,
          crossorigin: 'anonymous',
        },
        {
          type: 'text/javascript',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NUXT_PUBLIC_GA_ID}');
          `,
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
