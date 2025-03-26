// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/2025spring/',
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
