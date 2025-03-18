// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    rules: {
      // 讓 ESLint 兼容 Prettier，不報錯 HTML 自閉合標籤
      "vue/html-self-closing": "off"
    }
  }
]);
