import Vue from 'vue';

const getDefaultState = () => ({
  search: {
    name: '',
    reportDate: '',
    minAge: '',
    maxAge: '',
    height: '',
    weight: '',
    gender: '',
    hairColor: '',
    eyeColor: ''
  },
  results: [],
  settings: {
    timer: false,
    sort: true,
    customSort: [
      {type: 'PICTURE', name: 'Pictures'},
      {type: 'TEXT_CONVO', name: 'Phone conversations'},
      {type: 'SEARCH_HISTORY', name: 'Search history'},
      {type: 'RECEIPT', name: 'Receipts'},
      {type: 'SOCIAL_POST', name: 'Social posts'},
      {type: 'POLICE_REPORT', name: 'Police reports'}
    ]
  }
});

export const state = getDefaultState;

export const mutations = {
  search(state, {key, value}) {
    Vue.set(state.search, key, value);
  },
  results(state, results) {
    Vue.set(state, 'results', results);
  },

  resetSearch(state) {
    state.results = [];
    Object.assign(state.search, getDefaultState().search);
  },

  cache(state, cache) {
    Vue.set(state, 'cache', cache);
  },

  settings(state, {key, value}) {
    Vue.set(state.settings, key, value);
  }
};
