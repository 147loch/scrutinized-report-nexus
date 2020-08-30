<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    shortcut: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    cache: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    keymap() {
      if (this.shortcut) {
        return {
          [this.shortcut]: this.focus
        };
      }

      return {};
    }
  },
  methods: {
    focus(event) {
      event.preventDefault();
      this.$store.commit('resetSearch');
      this.$vuetify.goTo(0);
      this.$emit('blur-fields');
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    input($event) {
      this.$emit('input', $event);
      this.$search(this.cache);
    },
    blur() {
      this.$refs.input.blur();
    }
  }
};
</script>

<template>
  <VAutocomplete
    ref="input"
    v-hotkey="keymap"
    :label="label"
    :items="items"
    :value="value"
    outlined
    hide-details
    auto-select-first
    autocomplete="off"
    @input="input($event)"
  />
</template>
