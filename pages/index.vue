<script>
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import compareAsc from 'date-fns/compareAsc';
import Fuse from 'fuse.js';

import WireFrameLoader from '@/components/search/WireFrameLoader';

export default {
  components: {
    AsyncHomeSearchResultsBox: () => ({
      component: import('@/components/HomeSearchResultsBox'),
      loading: WireFrameLoader,
      delay: 50
    })
  },
  async asyncData({$displayHeight}) {
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

    const [Avatar, Pictures, POI, EvidencePool, Cellphones, SearchHistory, TextConversations, SocialPosts, Receipts, PoliceReports] = await Promise.all([
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/95a75782d2ec53877503bc92a2d07429e38573b1/avatars.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/9873e86c6798080f4e3ffc11a8c82b879e0a4142/pictures.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/poi.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/evidence-pool.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/e472af5c0a7f51ab8c0ec366c23e670888966d66/cellphones.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/search-history.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/text-conversations.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/social-posts.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/receipts.json').then(response => response.json()),
      fetch('https://gist.githubusercontent.com/147loch/4908fd56339abd0c44af730a1aeb92ac/raw/ebf1c820dbf4b2b01bb863794d3bbbf18492b059/police-reports.json').then(response => response.json())
    ]);

    const insertIfNotPresent = (array, ...values) => {
      values.forEach(value => {
        if (!array.includes(value)) {
          array.push(value);
        }
      });
    };

    const poiCache = {
      NAMES: [],
      REPORT_DATES: [],
      MIN_AGES: [],
      MAX_AGES: [],
      HEIGHTS: [],
      WEIGHTS: [],
      GENDERS: [],
      HAIR_COLORS: [],
      EYE_COLORS: [],

      data: {}
    };

    POI.forEach(report => {
      insertIfNotPresent(poiCache.NAMES, `${report.FirstName.trim()} ${report.LastName.trim()}`);
      insertIfNotPresent(poiCache.REPORT_DATES, format(parse(report.ReportDate, 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM-dd hh:mm:ss aa'));
      insertIfNotPresent(poiCache.MIN_AGES, report.AgeMin);
      insertIfNotPresent(poiCache.MAX_AGES, report.AgeMax);
      insertIfNotPresent(poiCache.HEIGHTS, $displayHeight(report.HeightGuess), $displayHeight(report.Height));
      insertIfNotPresent(poiCache.WEIGHTS, report.WeightGuess, report.Weight);
      insertIfNotPresent(poiCache.GENDERS, report.Gender);
      insertIfNotPresent(poiCache.HAIR_COLORS, report.HairColor);
      insertIfNotPresent(poiCache.EYE_COLORS, report.EyeColor);

      poiCache.data[report.ID] = report;
      poiCache.data[report.ID].ReportDate = format(parse(poiCache.data[report.ID].ReportDate, 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM-dd hh:mm:ss aa');
      poiCache.data[report.ID].EvidencePool = EvidencePool.filter(evidence => evidence.OwnerID === report.ID);
      poiCache.data[report.ID].CellPhone = Cellphones.filter(phone => phone.OwnerID === report.ID);
      poiCache.data[report.ID].Avatar = Avatar.filter(avatar => avatar.ParentID === report.ID);
      poiCache.data[report.ID].EvidencePool.forEach(evidence => {
        evidence.data = [];
        switch (evidence.EvidenceType) {
          case 'SEARCH_HISTORY':
            poiCache.data[report.ID].CellPhone.forEach(phone => {
              const data = SearchHistory.filter(history => history.ID === evidence.EvidenceID && history.CellPhoneID === phone.ID)[0];
              if (data === undefined) {
                return;
              }

              evidence.data.push({
                type: 'SEARCH_HISTORY',
                phone: phone.IMEI,
                data
              });
            });
            break;
          case 'TEXT_CONVO':
            poiCache.data[report.ID].CellPhone.forEach(phone => {
              const data = TextConversations.filter(convo => convo.ID === evidence.EvidenceID && convo.CellPhoneID === phone.ID)[0];
              if (data === undefined) {
                return;
              }

              evidence.data.push({
                type: 'TEXT_CONVO',
                phone: phone.IMEI,
                data
              });
            });
            break;
          case 'PICTURE':
            poiCache.data[report.ID].CellPhone.forEach(phone => {
              const data = Pictures.filter(picture => picture.ID === evidence.EvidenceID && picture.CellPhoneID === phone.ID)[0];
              if (data === undefined) {
                return;
              }

              evidence.data.push({
                type: 'PICTURE',
                phone: phone.IMEI,
                data
              });
            });
            break;
          case 'SOCIAL_POST':
            evidence.data = SocialPosts.filter(post => post.ID === evidence.EvidenceID && post.ParentID === report.ID)[0];
            break;
          case 'RECEIPT':
            evidence.data = Receipts.filter(receipt => receipt.ID === evidence.EvidenceID && receipt.OwnerID === report.ID)[0];
            break;
          case 'POLICE_REPORT':
            evidence.data = PoliceReports.filter(policeReport => policeReport.ID === evidence.EvidenceID && policeReport.OwnerID === report.ID)[0];
            break;
          default:
            console.warn('[EVIDENCE PARSE] Missing handler for type:', evidence.EvidenceType);
        }
      });
    });

    poiCache.NAMES.sort((a, b) => a.split(' ')[1].toLowerCase().localeCompare(b.split(' ')[1].toLowerCase()));
    poiCache.REPORT_DATES.sort((a, b) => compareAsc(parse(a, 'yyyy-MM-dd HH:mm:ss', new Date()), parse(b, 'yyyy-MM-dd HH:mm:ss', new Date())));
    poiCache.MIN_AGES.sort();
    poiCache.MAX_AGES.sort();
    poiCache.HEIGHTS.sort();
    poiCache.WEIGHTS.sort();
    poiCache.GENDERS.sort().reverse();
    poiCache.HAIR_COLORS.sort();
    poiCache.EYE_COLORS.sort();

    return {
      poiCache,
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
        console.log(this.fuzzySearch.search(to));
        const results = this.fuzzySearch.search(to).map(r => ({
          firstName: r.item.FirstName,
          lastName: r.item.LastName,
          reportDate: r.item.ReportDate,
          id: r.item.ID,
          matches: r.matches
        }));
        this.results = results.slice(0, 10);
        this.resultsTruncated = results.length - 10;
      }
    }
  },
  methods: {
    toggleFuzzySearch(event) {
      event.preventDefault();
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
        <HomeInfoBox class="mb-2" />
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
