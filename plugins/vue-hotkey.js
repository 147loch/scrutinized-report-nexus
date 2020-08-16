import Vue from 'vue';
import VueHotkey from 'v-hotkey';

Vue.use(VueHotkey);

Vue.directive('longpress', {
  bind(element, {value}, _) {
    if (typeof value !== 'function') {
      console.warn(`Expect a function, got ${value}`);
      return;
    }

    let pressTimer = null;

    const start = event => {
      if (event.type === 'click' && event.button !== 0) {
        return;
      }

      if (pressTimer === null) {
        pressTimer = setTimeout(() => value(event), 1500);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    ['mousedown', 'touchstart'].forEach(event => element.addEventListener(event, start));
    ['click', 'mouseout', 'touchend', 'touchcancel'].forEach(event => element.addEventListener(event, cancel));
  }
});
