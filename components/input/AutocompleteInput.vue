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
  mounted() {
    this.$EventBus.$on('blur-fields', input => {
      if (this.$refs.input && this.$refs.input._uid !== input._uid) {
        this.$refs.input.blur();
        this.$store.commit('resetSearch');
      }
    });
  },
  methods: {
    focus(event) {
      event.preventDefault();
      this.$EventBus.$emit('blur-fields', this.$refs.input);
      this.$refs.input.focus();
      this.$store.commit('resetSearch');

      this.$vuetify.goTo(0).then(() => {
        this.$store.commit('resetSearch');
      });
    },
    input($event) {
      this.$emit('input', $event);
      this.$search(this.cache);
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
