<script>
import {get} from 'dot-prop';

export default {
  data() {
    return {
      night: 1,

      started: false,
      start: null,

      acknowledge: null,
      lastCheck: null,

      interval: null,

      text: 'START',
      textLocked: false,
      color: '',

      splits: [],
      splitsHistory: [],
      negativeSplits: new Array(14),

      difficulty: JSON.parse(localStorage.getItem('splits/settings/difficulty')) || {name: 'Normal (1.0.0)', timers: '100.normal'},

      timers: {
        100: {
          normal: {
            checks: ['4:30', '4:00', '2:30', '1:30', '1:30', '1:30', '1:30', '1:30', '1:00', '0:45'],
            nights: 10,
            splitHistory: 'splits/1.0.0/normal'
          },
          casual: {
            checks: ['4:30', '4:00', '3:00', '1:30', '1:30'],
            nights: 5,
            splitHistory: 'splits/1.0.0/casual'
          }
        },
        111: {
          casual: {
            checks: ['4:30', '4:00', '3:00', '1:30', '1:30'],
            nights: 5,
            splitHistory: 'splits/1.1.1/casual'
          },
          normal: {
            checks: ['4:30', '4:00', '2:30', '1:30', '1:30', '1:30', '1:30', '1:30', '1:00', '0:45'],
            nights: 10,
            splitHistory: 'splits/1.1.1/normal'
          },
          nightmare: {
            checks: ['4:30', '4:00', '2:30', '1:30', '1:30', '1:30', '1:30', '1:30', '1:00', '1:00', '0:50', '0:50', '0:40', '0:40'],
            nights: 14,
            splitHistory: 'splits/1.1.1/nightmare'
          }
        }
      },

      difficulties: [
        {name: 'Casual (1.0.0)', timers: '100.casual'},
        {name: 'Normal (1.0.0)', timers: '100.normal'},
        {name: 'Casual (1.1.1)', timers: '111.casual'},
        {name: 'Normal (1.1.1)', timers: '111.normal'},
        {name: 'Nightmare (1.1.1)', timers: '111.nightmare'}
      ]
    };
  },
  mounted() {
    this.splits = this.getSplits();
    this.splitsHistory = this.getSplits();
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.acknowledge);
  },
  methods: {
    getConfig() {
      return get(this.timers, this.difficulty.timers);
    },
    getSplits() {
      return JSON.parse(localStorage.getItem(this.getConfig().splitHistory)) || new Array(this.getConfig().nights);
    },
    formatMiliseconds(time, hideIfZero = false) {
      const ms = (time % 1000) / 10 | 0;
      const s = (time / 1000) % 60 | 0;
      const m = (time / (1000 * 60)) % 60 | 0;
      const h = (time / (1000 * 60 * 60)) % 24 | 0;

      if (hideIfZero) {
        return `${h > 0 ? `${h}:` : ''}${m > 0 ? `${m < 10 ? `0${m}` : m}:` : ''}${s < 10 ? `0${s}` : s}.${ms < 10 ? `0${ms}` : ms}`;
      }

      return `${h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}.${ms < 10 ? `0${ms}` : ms}`;
    },

    startTimer() {
      this.started = true;

      this.lastCheck = Date.now();
      this.start = Date.now();

      this.splits = this.getSplits();
      this.splitsHistory = this.getSplits();

      this.color = '';

      this.interval = setInterval(this.update, 15);
    },

    update() {
      this.updateCurrentSplit(this.night);

      if (!this.textLocked) {
        this.text = this.formatMiliseconds(Date.now() - this.start);
      }
    },

    endTimer(save = true) {
      clearInterval(this.interval);
      this.interval = null;

      this.started = false;
      this.start = null;

      this.night = 1;

      this.color = 'blue darken-1';

      if (save && (!this.getSplits()[this.getSplits().length - 1] || this.splits[this.splits.length - 1].current < this.getSplits()[this.getSplits().length - 1].current)) {
        localStorage.setItem(this.getConfig().splitHistory, JSON.stringify(this.splits));
      }
    },

    resetTimer() {
      this.endTimer(false);

      this.text = 'START';
      this.splits = this.getSplits();
      this.splitsHistory = this.getSplits();
    },

    resetHistory() {
      localStorage.removeItem(this.getConfig().splitHistory);
      this.resetTimer();
    },

    split() {
      this.updateCurrentSplit(this.night++);
    },

    sleep() {
      if (this.night === this.getConfig().nights) {
        this.endTimer();
        return;
      }

      this.split();
    },
    ackCheck() {
      if (!this.started) {
        this.startTimer();
      }
    },

    updateCurrentSplit(night) {
      const time = Date.now() - this.start;
      this.$set(this.splits, night - 1, {
        current: time,
        previous: night >= 2 ? time - this.splits[night - 2].current : 0
      });
    },

    changeDifficulty(diff) {
      this.difficulty = diff;
      localStorage.setItem('splits/settings/difficulty', JSON.stringify(diff));
      this.resetTimer();
    },

    firstColumn(current, history, night) {
      if (history && Math.abs(history.current - current.current) > 0) {
        if (this.night === night && history.current - current.current < 3000) {
          return `${history.current - current.current < 0 ? '+' : '-'}${this.formatMiliseconds(Math.abs(history.current - current.current), true)}`;
        }

        if (this.night > night || !this.started) {
          return `${history.current - current.current < 0 ? '+' : '-'}${this.formatMiliseconds(Math.abs(history.current - current.current), true)}`;
        }
      }

      return '';
    }
  }
};
</script>

<template>
  <VRow no-gutters>
    <VCol cols="12">
      <VCard elevation="2">
        <VCardTitle>
          Timer
          <VSpacer />
          <VMenu offset-y>
            <template #activator="{on, attrs}">
              <VChip color="primary" label v-bind="attrs" v-on="on">
                {{ difficulty.name }}
              </VChip>
            </template>
            <VList>
              <VListItem
                v-for="(item, i) in difficulties"
                :key="i"
                @click="changeDifficulty(item)"
              >
                <VListItemTitle>{{ item.name }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VCardTitle>
        <VDivider />
        <VContainer fluid>
          <VRow dense>
            <VCol cols="6">
              <VBtn x-large :disabled="!started" color="primary" width="100%" height="80px" @click="sleep()">
                Sleep
              </VBtn>
            </VCol>
            <VCol cols="6">
              <VBtn v-longpress="resetHistory" x-large color="red" width="100%" height="80px"  @click="resetTimer()">
                Reset
              </VBtn>
            </VCol>
          </VRow>

          <VCard height="150px" class="d-flex flex-column justify-center align-center" style="transition: background-color 250ms linear;" :color="color" outlined @click="ackCheck()">
            <div>
              <div :class="`${started && color === '' ? 'light-green--text' : 'white--text'} text-h3 font-weight-normal`">
                {{ text }}
              </div>
              <div class="text-h5 grey--text text--lighten-1 font-weight-light text-right">
                {{ splits[night - 1] && night > 1 ? formatMiliseconds(splits[night - 1].previous) : '' }}
              </div>
            </div>
          </VCard>

          <VDivider v-if="splits.length > 0" class="my-2" />

          <div v-if="splits.length > 0" class="text-h6 font-weight-thin grey--text text--lighten-1">
            Splits
          </div>

          <VRow v-if="splits.length > 0" dense>
            <template v-for="(currentSplit, i) in splits">
              <VCol :key="`${i}-1`" cols="3">
                <div class="text-body-1 font-weight-thin grey--text text--lighten-1">
                  Night
                  <span class="font-weight-normal white--text">
                    {{ i + 1 }}
                  </span>
                </div>
              </VCol>
              <VCol :key="`${i}-2`" cols="2">
                <span class="font-weight-thin grey--text ml-1">
                  {{ getConfig().checks[i] }}
                </span>
              </VCol>
              <VCol :key="`${i}-3`" cols="7" class="text-right">
                <span :class="`${firstColumn(currentSplit, splitsHistory[i], i + 1).split('')[0] === '+' ? 'red--text' : 'green--text'} font-weight-normal mr-3`">
                  <!-- {{ currentSplit && i >= 1 ? formatMiliseconds(currentSplit.previous) : '' }} -->
                  {{ firstColumn(currentSplit, splitsHistory[i], i + 1) }}
                </span>
                <span :class="`${i > night - 1 || !started ? 'grey--text' : 'white--text'} font-weight-normal`">
                  {{ currentSplit ? i >= night - 1 && started && splitsHistory[i] ? formatMiliseconds(splitsHistory[i].current) : formatMiliseconds(currentSplit.current) : '' }}
                </span>
              </VCol>
            </template>
          </VRow>
        </VContainer>
      </VCard>
    </VCol>
  </VRow>
</template>
