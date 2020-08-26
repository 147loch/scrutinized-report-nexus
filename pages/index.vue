<script>
import pako from 'pako';
import Fuse from 'fuse.js';

import WireframeLoader from '@/components/search/WireframeLoader';

const CACHE_ITEMS = 40;
const CHANGELOG_URL = 'https://gist.githubusercontent.com/147loch/22746bd7470840377db20f0b1fcadc66/raw/srn-changelog.json';

export default {
  components: {
    AsyncHomeSearchResultsBox: () => ({
      component: import('@/components/HomeSearchResultsBox'),
      loading: WireframeLoader,
      delay: 50
    })
  },
  async asyncData() {
    const fuseOptions = {
      includeScore: true,
      includeMatches: true,
      keys: [
        'FirstName',
        'LastName',
        'Report',
        'ReportDate'
      ]
    };

    const awaitArray = [fetch(CHANGELOG_URL).then(response => response.json())];

    for (let i = 1; i <= CACHE_ITEMS; i++) {
      awaitArray.push(fetch(`/cache.chunk-${i}.gz`).then(response => response.arrayBuffer()));
    }

    const chunks = await Promise.all(awaitArray);

    const appChangelog = chunks[0];

    const poiCache = chunks.slice(1).reduce((accumulator, current) => {
      const currentParsed = JSON.parse(new TextDecoder('utf-8').decode(pako.ungzip(current)));
      if (currentParsed.length === 6) {
        Object.assign(accumulator, currentParsed[0]);
        for (let i = 1; i < 6; i++) {
          accumulator.data[currentParsed[i].ID] = currentParsed[i];
        }

        return accumulator;
      }

      for (let i = 0; i < 5; i++) {
        accumulator.data[currentParsed[i].ID] = currentParsed[i];
      }

      return accumulator;
    }, {data: {}});

    console.log(poiCache);

    return {
      poiCache,
      appChangelog,
      fuzzySearch: new Fuse(Object.values(poiCache.data), fuseOptions)
    };
  },
  data() {
    return {
      fuzzyOverlay: false,
      fuzzyText: '',
      results: [],
      resultsTruncated: 0
    };
  },
  computed: {
    displayTimer() {
      return this.$store.state.settings.timer;
    },

    keymap() {
      return {
        'ctrl+f': this.toggleFuzzySearch,
        enter: this.hideFuzzySearch
      };
    }
  },
  watch: {
    fuzzyText(to) {
      if (to !== '') {
        const results = this.fuzzySearch.search(to).map(r => ({
          firstName: r.item.FirstName,
          lastName: r.item.LastName,
          reportDate: r.item.ReportDate,
          id: r.item.ID,
          matches: r.matches,
          score: `${Math.round((1 - r.score) * 100)}%`
        }));
        this.results = results.slice(0, 10);
        this.resultsTruncated = results.length - 10;
      }
    }
  },
  methods: {
    toggleFuzzySearch(event) {
      event.preventDefault();
      event.stopPropagation();
      this.fuzzyOverlay = !this.fuzzyOverlay;

      if (this.fuzzyOverlay) {
        this.fuzzyText = '';
        this.results = [];
        this.resultsTruncated = 0;
        this.$nextTick(() => {
          this.$refs.fuzzy.focus();
        });
      }
    },
    hideFuzzySearch(event) {
      if (this.fuzzyOverlay) {
        event.preventDefault();
        event.stopPropagation();
        this.fuzzyOverlay = false;
        this.$store.commit('results', this.results.map(r => r.id));
      }
    }
  }
};
</script>

<template>
  <VMain v-hotkey="keymap" class="pa-4">
    <VDialog v-model="fuzzyOverlay" max-width="750">
      <VTextField
        ref="fuzzy"
        v-model="fuzzyText"
        label="Fuzzy search"
        background-color="grey darken-2"
        append-icon="mdi-magnify"
        hide-details
        solo
        dark
        full-width
        autofocus
      />

      <VCard v-for="(result, i) in results" :key="`${i}-${result.firstName}`" class="mt-2" color="grey darken-3">
        <VContainer fluid>
          <div>
            <span :class="result.matches.some(r => r.key === 'FirstName') ? 'pink darken-3' : ''">
              {{ result.firstName }}
            </span>
            <span :class="result.matches.some(r => r.key === 'LastName') ? 'pink darken-3' : ''">
              {{ result.lastName }}
            </span> -
            <span :class="result.matches.some(r => r.key === 'ReportDate') ? 'pink darken-3' : ''">
              {{ result.reportDate }}
            </span>
            <span v-if="result.matches.some(r => r.key === 'Report')">
              -
              <span class="pink darken-3">
                Match in report
              </span>
            </span>
            <span>
              - Score: {{ result.score }}
            </span>
          </div>
        </VContainer>
      </VCard>
      <VCard v-show="resultsTruncated > 0" color="grey darken-4" class="mt-2">
        <VContainer fluid>
          <div>and {{ resultsTruncated }} more...</div>
        </VContainer>
      </VCard>
    </VDialog>
    <VRow dense class="justify-center">
      <VCol cols="12" lg="9">
        <HomeInfoBox class="mb-2" :toggle-fuzzy="toggleFuzzySearch" :changelog="appChangelog" />
        <HomeSearchBox :cache="poiCache" class="mb-2" />
        <AsyncHomeSearchResultsBox :cache="poiCache" />
      </VCol>
      <VCol v-show="displayTimer" cols="12" :lg="displayTimer ? 3 : 12" class="follower-wrapper">
        <HelperColumn class="follower" />
      </VCol>
    </VRow>
  </VMain>
</template>

<style>
  * {
    scrollbar-width: thin;
    scrollbar-color: #616161 #212121;
  }

  /* Works on Chrome/Edge/Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }
  *::-webkit-scrollbar-track {
    background: #212121;
  }
  *::-webkit-scrollbar-thumb {
    background-color: #616161;
    border-radius: 20px;
    border: 3px solid #212121;
  }

  html, body {
    background-color: #121212;
  }
</style>

<style scoped>
  .follower {
    position: sticky;
    top: 20px;
  }

  .follower-wrapper {
    position: relative;
  }

  @media only screen and (max-width: 1264px) {
    .follower-wrapper {
      display: none;
    }
  }
</style>
