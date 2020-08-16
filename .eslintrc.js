module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'xo-space',
    'xo-vue/spaces'
  ],
  // Add your custom rules here
  rules: {
    'import/no-unresolved': 'off',
    'vue/valid-v-slot': 'off',
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-multi-spaces': 'off',
    complexity: 'off',
    'max-nested-callbacks': 'off'
  }
};
