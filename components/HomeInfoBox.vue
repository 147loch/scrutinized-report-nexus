<script>
import Draggable from 'vuedraggable';

export default {
  components: {
    Draggable
  },
  props: {
    changelog: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hidden: true,
      changelogModal: false
    };
  },
  computed: {
    timer: {
      set(value) {
        this.$store.commit('settings', {key: 'timer', value});
      },
      get() {
        return this.$store.state.settings.timer;
      }
    },
    sort: {
      set(value) {
        this.$store.commit('settings', {key: 'sort', value});
      },
      get() {
        return this.$store.state.settings.sort;
      }
    },
    customSort: {
      set(value) {
        this.$store.commit('settings', {key: 'customSort', value});
      },
      get() {
        return this.$store.state.settings.customSort;
      }
    },

    reversedChangelog() {
      return this.changelog.slice().reverse();
    }
  }
};
</script>

<template>
  <VRow align="center" justify="center" no-gutters>
    <VCol cols="12">
      <VCard elevation="10">
        <VCardTitle>
          Scrutinized Report Nexus
          <VChip color="grey darken-2" class="ml-2">
            {{ $version }}
          </VChip>
          <VSpacer />
          <VDialog
            v-model="changelogModal"
            width="600"
            scrollable
          >
            <template #activator="{on, attrs}">
              <VBtn
                icon
                small

                class="mr-5"

                v-bind="attrs"
                v-on="on"
              >
                <VIcon>mdi-delta</VIcon>
              </VBtn>
            </template>

            <VCard>
              <VCardTitle class="indigo darken-2">
                Changelog
                <VSpacer />
                <VBtn
                  icon

                  @click="changelogModal = false;"
                >
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VCardTitle>
              <VCardText class="py-0">
                <VTimeline dense>
                  <VTimelineItem v-for="change in reversedChangelog" :key="change.version" small fill-dot :color="change.color">
                    <VRow class="align-center">
                      <VCol cols="2">
                        <strong :class="`subtitle-1 font-weight-bold ${change.color}--text`">
                          {{ change.version }}
                        </strong>
                      </VCol>
                      <VCol>
                        <strong :class="`headline font-weight-bold ${change.color}--text`">
                          {{ change.title }}
                        </strong>
                        <div v-for="c in change.changes" :key="c.label">
                          <VChip
                            label
                            x-small
                            :color="c.added ? 'green' : c.modified ? 'blue' : c.neutral ? 'blue-grey' : c.deleted ? 'red' : 'grey'"
                          >
                            {{ c.added ? 'Added' : c.modified ? 'Modified' : c.neutral ? 'Info' : c.deleted ? 'Deleted' : 'Unknown' }}
                          </VChip>
                          <span class="caption">
                            {{ c.label }}
                          </span>
                        </div>
                      </VCol>
                    </VRow>
                  </VTimelineItem>
                </VTimeline>
              </VCardText>
            </VCard>
          </VDialog>
          <VBtn
            icon
            small
            @click="hidden = !hidden"
          >
            <VIcon>{{ hidden ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</VIcon>
          </VBtn>
        </VCardTitle>
        <VExpandTransition>
          <div v-show="!hidden">
            <VDivider />
            <VCardText>
              <p><strong>How to use it</strong> - If you have the name in the report, use it. If the name is unknown, then type in the report date.</p>
              <p><strong>Search fields</strong> - Weight and Height fields search for both the guesses values and the real values. Search is done live upon field completion.</p>
              <p><strong>Reset the app</strong> - Press Ctrl+R to reset the app to get ready to search someone else.</p>
              <p><strong>Fuzzy search</strong> - Press Ctrl+F to open the fuzzy search input. It will only show the top 10 results based on the search score.</p>
              <p>
                <strong>Abbreviations definition</strong>
                <ul>
                  <li><strong>Avatar</strong>: U - Name Unknown, K - Name Known. Press Ctrl+X to copy the full name of the first search result. Press Ctrl+Y to copy the alias of the first search result.</li>
                  <li><strong>Age</strong>: R - Real, F - Fake, Unk - Unknown</li>
                  <li><strong>Height</strong>: R - Real, G - Guess, F - Fake, Unk - Unknown</li>
                  <li><strong>Weight</strong>: R - Real, G - Guess, F - Fake, Unk - Unknown</li>
                  <li><strong>Gender</strong>: R - Real, F - Fake, Unk - Unknown</li>
                  <li><strong>Colors</strong>: H - Hair, FH - Fake Hair, E - Eye, FE - Fake Eye, HUnk - Hair Unknown, EUnk - Eye unknown</li>
                  <li><strong>Other</strong>: FDat - Use Fake Data, Soc - Has Social Profile</li>
                  <li><strong>Phone</strong>: 3 reports have two IMEI, they are shown here. Press Ctrl+C to copy the IMEI of the first search result.</li>
                </ul>
              </p>
              <VDivider />
              <div class="grey--text text-subtitle-1 mt-2">
                App settings
              </div>
              <VSwitch
                v-model="timer"

                class="mt-1"
                label="Enable the timer"
                hide-details
              />
              <VSwitch
                v-model="sort"

                class="mt-1"
                label="Use the default evidence sort (by amount of current type)"
                hide-details
              />
              <VCard class="mt-3" outlined>
                <VContainer fluid>
                  <h4 v-if="!sort">
                    Custom evidence order
                  </h4>
                  <h4 v-else>
                    Preferred evidence order
                  </h4>
                  <VList dense>
                    <VDivider />
                    <Draggable v-model="customSort">
                      <template v-for="(option, i) in customSort">
                        <div :key="i">
                          <VListItem class="pointer">
                            <VListItemIcon>
                              <VIcon>mdi-drag-horizontal</VIcon>
                            </VListItemIcon>
                            <VListItemContent>
                              <VListItemTitle>{{ option.name }}</VListItemTitle>
                            </VListItemContent>
                          </VListItem>
                          <VDivider />
                        </div>
                      </template>
                    </Draggable>
                  </VList>
                </VContainer>
              </VCard>
            </VCardText>
          </div>
        </VExpandTransition>
        <VDivider />
        <VCardText>
          <div>
            App by Lutonite -
            <span class="red--text">
              CONTAINS SPOILERS
            </span> -
            <small>This app is not endorsed by or affiliated with Reflect Studios. All game content and materials are copyright Reflect Studios.</small>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
  .pointer {
    cursor: n-resize;
  }
</style>
