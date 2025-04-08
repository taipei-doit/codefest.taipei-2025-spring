import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt([
  {
    ignores: [
      '**/.output/**',
      '**/.nuxt/**',
      'node_modules/**',
      'dist/**',
      'public/prod/**',
      '_archived/**',
    ],
    files: ['**/*.ts', '**/*.js', '**/*.vue'],
    rules: {
      'eol-last': 'error',
      'linebreak-style': 'error',
      semi: ['error', 'always'],
    },
    ...eslintPluginPrettierRecommended,
  },
]);
