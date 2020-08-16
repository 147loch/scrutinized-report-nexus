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
      reportModal: false
    };
  },
  computed: {
    sort() {
      return this.$store.state.settings.sort;
    },
    customSort() {
      return this.$store.state.settings.customSort;
    },
    sortedEvidencePool() {
      if (this.sort) {
        return this.data.EvidencePool.slice().sort((a, b) => {
          const c = this.data.EvidencePool.filter(i => i.EvidenceType === b.EvidenceType).length - this.data.EvidencePool.filter(i => i.EvidenceType === a.EvidenceType).length;
          if (c === 0) {
            return this.customSort.findIndex(i => i.type === a.EvidenceType) - this.customSort.findIndex(i => i.type === b.EvidenceType);
          }

          return c;
        });
      }

      return this.data.EvidencePool.slice().sort((a, b) => this.customSort.findIndex(i => i.type === a.EvidenceType) - this.customSort.findIndex(i => i.type === b.EvidenceType));
    }
  },
  methods: {
    btoimg(source) {
      return `data:image/png;base64,${source}`;
    }
  }
};
</script>

<template>
  <VCard elevation="2" class="mb-3">
    <VContainer fluid>
      <VRow no-gutters>
        <VCol cols="4" lg="3">
          <VImg style="border-radius: 4px;" :src="btoimg(data.Avatar[0].ImageData)" eager>
            <VRow align="end" class="lightbox white--text pa-3 fill-height" no-gutters>
              <VCol>
                <div class="white--text text-h5 font-weight-normal">
                  {{ data.FirstName }} {{ data.LastName }}
                  <small class="white--text text--darken-1 font-weight-light">
                    ({{ data.NameUnknown ? 'U' : 'K' }})
                  </small>
                </div>
                <div>
                  {{ data.ReportDate }}
                </div>
              </VCol>
            </VRow>
          </VImg>
          <VAlert :type="data.Threat === 0 ? 'info' : 'error'" class="mt-3 mb-0">
            {{ data.Threat === 0 ? 'Innocent' : 'Criminal' }}
          </VAlert>
          <SearchDetailsBox :data="data" />
          <VDialog v-model="reportModal" max-width="580">
            <template #activator="{on, attrs}">
              <VBtn
                color="teal darken-1"
                class="full-width mt-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Open Report
              </VBtn>
            </template>
            <VCard>
              <VCardTitle class="headline">
                Report
              </VCardTitle>
              <VCardText class="pb-0">
                {{ data.Report }}
              </VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn color="primary" text @click="reportModal = false">
                  Close
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VCol>
        <VCol cols="8" lg="9" class="pl-2">
          <div v-if="data.Threat === 0" class="d-flex flex-column justify-center align-center full-width full-height">
            <VIcon style="font-size: 8em;" color="blue">
              mdi-check-circle
            </VIcon>
            <div class="grey--text text--darken-2 mt-3">
              No evidence
            </div>
          </div>
          <div v-else>
            <EvidenceField v-for="(evidence, i) in sortedEvidencePool" :key="evidence.ID" :data="evidence" :class="`${i < sortedEvidencePool.length - 1 ? 'mb-2' : 'mb-0'}`" />
          </div>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>

<style scoped>
  .full-width {
    width: 100%;
  }

  .full-height {
    height: 100%;
  }

  .lightbox {
    box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 72px);
  }

  /deep/ .v-list-item__subtitle {
    text-overflow: initial;
    white-space: initial;
  }
</style>
