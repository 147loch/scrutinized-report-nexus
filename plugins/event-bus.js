import Vue from 'vue';

export default (_, inject) => {
  inject('EventBus', new Vue());
};
