import {version} from './package.json';

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',

  generate: {
    fallback: true
  },

  env: {
    VERSION: version
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Scrutinized Report Nexus',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {name: 'theme-color', content: '#212121'},
      {
        hid: 'description',
        name: 'description',
        content: 'A database with all the reports from Scrutinized'
      }
    ],
    link: [{rel: 'icon', type: 'image/png', href: '/icon.png'}]
  },
  /*
   ** Global CSS
   */
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '@/static/fonts/roboto.css'
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {src: '@/plugins/vue-hotkey.js', ssr: false},
    {src: '@/plugins/data-manager.js', ssr: false},
    {src: '@/plugins/event-bus.js', ssr: false},
    {src: '@/plugins/vue-clipboard2.js', ssr: false},
    {src: '@/plugins/persistence.js', ssr: false}
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/vuetify-module
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa'
  ],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /*
   ** Vuetify config
   **
   */
  vuetify: {
    theme: {
      dark: true
    },
    defaultAssets: false
  },

  pwa: {
    meta: {
      /* eslint-disable camelcase */
      title: 'Scrutinized Report Nexus',
      author: 'Lutonite',
      description: 'A database with all the reports from Scrutinized',
      theme_color: '#212121',
      lang: 'en',
      mobileApp: false
    },
    manifest: {
      name: 'Scrutinized Report Nexus',
      short_name: 'Scrutinized Nexus',
      lang: 'en',
      theme_color: '#212121',
      useWebmanifestExtension: false,
      background_color: '#212121'
      /* eslint-enable camelcase */
    },
    icon: {
      purpose: ['badge', 'maskable']
    }
  },

  loadingIndicator: '@/template/loading.html'
};
