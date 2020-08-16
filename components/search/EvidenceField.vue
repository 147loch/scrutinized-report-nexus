<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      name: '',
      color: ''
    };
  },
  mounted() {
    this.parseState(this.data.EvidenceType);
  },
  methods: {
    parseState(state) {
      switch (state) {
        case 'SEARCH_HISTORY':
          this.name = 'Phone search history';
          this.color = 'deep-orange darken-4';
          break;
        case 'TEXT_CONVO':
          this.name = 'Phone conversation';
          this.color = 'pink darken-4';
          break;
        case 'PICTURE':
          this.name = 'Phone picture';
          this.color = 'cyan darken-4';
          break;
        case 'SOCIAL_POST':
          this.name = 'Social post';
          this.color = 'indigo darken-4';
          break;
        case 'RECEIPT':
          this.name = 'Receipt';
          this.color = 'green darken-4';
          break;
        case 'POLICE_REPORT':
          this.name = 'Police report';
          this.color = 'blue-grey darken-3';
          break;
        default:
          console.warn('[EVIDENCE PARSE] Missing handler for type:', state);
      }
    },
    btoimg(source) {
      return `data:image/png;base64,${source}`;
    },
    debug(dataO) {
      if (dataO === undefined) {
        console.log(this.data);
      }
    }
  }
};
</script>

<template>
  <VCard :color="color" elevation="5" dark>
    <template v-if="data.EvidenceType === 'PICTURE'">
      <template v-for="(phone, i) in data.data">
        <VContainer :key="`${i}-1`" fluid>
          <VRow no-gutters>
            <VCol cols="4" lg="3">
              <VImg :src="btoimg(phone.data.ThumbNail)" eager />
            </VCol>
            <VCol cols="8" lg="9" class="pl-3">
              <h4 class="grey--text text--lighten-1 font-weight-light">
                Incriminating Evidence
              </h4>
              <VDivider class="mb-2" />
              <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
                Type
                <span class="font-weight-normal white--text">
                  {{ name }}
                </span>
              </div>
              <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
                Phone IMEI
                <ImeiDisplay class="white--text font-weight-normal" :imei="phone.phone" />
              </div>
            </VCol>
          </VRow>
        </VContainer>
        <VDivider v-if="i < data.data.length - 1" :key="`${i}-2`" />
      </template>
    </template>
    <template v-if="data.EvidenceType === 'TEXT_CONVO'">
      <template v-for="(phone, i) in data.data">
        <VContainer :key="`${i}-1`" fluid>
          <h4 class="grey--text text--lighten-1 font-weight-light">
            Incriminating Evidence
          </h4>
          <VDivider class="mb-2" />
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Type
            <span class="font-weight-normal white--text">
              {{ name }}
            </span>
          </div>
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Phone IMEI
            <ImeiDisplay class="white--text font-weight-normal" :imei="phone.phone" />
          </div>
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Conversation name
            <span class="font-weight-normal white--text">
              {{ phone.data.Person }}
            </span>
          </div>
        </VContainer>
        <VDivider v-if="i < data.data.length - 1" :key="`${i}-2`" />
      </template>
    </template>
    <template v-if="data.EvidenceType === 'SEARCH_HISTORY'">
      <template v-for="(phone, i) in data.data">
        {{ debug(phone.data) }}

        <VContainer :key="`${i}-1`" fluid>
          <h4 class="grey--text text--lighten-1 font-weight-light">
            Incriminating Evidence
          </h4>
          <VDivider class="mb-2" />
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Type
            <span class="font-weight-normal white--text">
              {{ name }}
            </span>
          </div>
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Phone IMEI
            <ImeiDisplay class="white--text font-weight-normal" :imei="phone.phone" />
          </div>
          <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
            Search
            <span class="font-weight-normal white--text">
              {{ phone.data.Search }}
            </span>
          </div>
        </VContainer>
        <VDivider v-if="i < data.data.length - 1" :key="`${i}-2`" />
      </template>
    </template>
    <template v-if="data.EvidenceType === 'SOCIAL_POST'">
      <VContainer fluid>
        <h4 class="grey--text text--lighten-1 font-weight-light">
          Incriminating Evidence
        </h4>
        <VDivider class="mb-2" />
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Type
          <span class="font-weight-normal white--text">
            {{ name }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Post date
          <span class="font-weight-normal white--text">
            {{ data.data.PostDate }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Post content
          <span class="font-weight-normal white--text">
            {{ data.data.PostText }}
          </span>
        </div>
      </VContainer>
    </template>
    <template v-if="data.EvidenceType === 'RECEIPT'">
      <VContainer fluid>
        <h4 class="grey--text text--lighten-1 font-weight-light">
          Incriminating Evidence
        </h4>
        <VDivider class="mb-2" />
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Type
          <span class="font-weight-normal white--text">
            {{ name }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Store name
          <span class="font-weight-normal white--text">
            {{ data.data.StoreName }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Date
          <span class="font-weight-normal white--text">
            {{ data.data.PurchaseDate }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Amount
          <span class="font-weight-normal white--text">
            {{ data.data.PurchaseAmount }}
          </span>
        </div>
      </VContainer>
    </template>
    <template v-if="data.EvidenceType === 'POLICE_REPORT'">
      <VContainer fluid class="police-report">
        <h4 class="grey--text text--lighten-1 font-weight-light">
          Incriminating Evidence
        </h4>
        <VDivider class="mb-2" />
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Type
          <span class="font-weight-normal white--text">
            {{ name }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Location
          <span class="font-weight-normal white--text">
            {{ data.data.Location }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Date
          <span class="font-weight-normal white--text">
            {{ data.data.ReportDate }}
          </span>
        </div>
        <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
          Description
          <span class="font-weight-normal white--text">
            {{ data.data.Description }}
          </span>
        </div>
      </VContainer>
    </template>
  </VCard>
</template>

<style scoped>
  .police-report {
    max-height: 350px;
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: #616161 #263238;
  }

  .police-report::-webkit-scrollbar {
    width: 12px;
  }
  .police-report::-webkit-scrollbar-track {
    background: #263238;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .police-report::-webkit-scrollbar-thumb {
    background-color: #616161;
    border-radius: 20px;
    border: 3px solid #263238;
  }
</style>
