<script>
export default {
  props: {
    cache: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    keymap() {
      return {
        'ctrl+x': this.copyFirstReportName,
        'ctrl+c': this.copyFirstReportIMEI
      };
    },
    results() {
      return this.$store.state.results;
    }
  },
  watch: {
    results(to) {
      if (to.length > 0) {
        this.$nextTick(() => {
          this.$vuetify.goTo('#title');
        });
      }
    }
  },
  methods: {
    copyFirstReportIMEI(event) {
      event.preventDefault();
      if (this.results.length > 0) {
        this.$copyText(this.cache.data[this.results[0]].CellPhone[0].IMEI);
      }
    },
    copyFirstReportName(event) {
      event.preventDefault();
      if (this.results.length > 0) {
        this.$copyText(`${this.cache.data[this.results[0]].FirstName} ${this.cache.data[this.results[0]].LastName}`);
      }
    }
  }
};
</script>

<template>
  <VRow v-show="results.length > 0" v-hotkey="keymap" align="center" justify="center" no-gutters>
    <VCol cols="12">
      <VDivider />
      <VSubheader id="title">
        Search results
      </VSubheader>
      <HomeSearchResult
        v-for="result in Object.values(cache.data).filter(rep => results.includes(rep.ID)).sort((a,b) => results.indexOf(a.ID) - results.indexOf(b.ID)).slice(0, 10)"
        :key="result.ID"
        :data="result"
      />
    </VCol>
  </VRow>
</template>
