import VuexPersistence from 'vuex-persist';

export default ({store}) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      reducer: state => ({search: state.search, settings: state.settings})
    }).plugin(store);
  });
};
