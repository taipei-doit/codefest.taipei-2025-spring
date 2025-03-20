// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt([
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'],
    rules: {
      "eol-last": "error",
      "linebreak-style": "error",
      "semi": ["error", "always"],
    },
    ...eslintPluginPrettierRecommended
  }
]);
