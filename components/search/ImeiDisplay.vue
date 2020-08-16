<script>
export default {
  props: {
    imei: {
      type: String,
      default: ''
    }
  },
  methods: {
    click(event) {
      event.preventDefault();
      this.$copyText(this.imei);
    }
  }
};
</script>

<template>
  <VHover v-slot="{hover}">
    <span @click="click($event)">
      {{ $displayIMEI(imei) }}
      <span v-show="hover" class="grey--text text--lighten-1">
        Click to copy
      </span>
    </span>
  </VHover>
</template>
