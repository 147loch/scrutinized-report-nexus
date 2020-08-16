<script>
import {get} from 'dot-prop';

export default {
  name: 'SearchDetailsBox',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fields: [
        {
          name: 'Age',
          values: [
            {value: 'AgeMin', name: 'Min'},
            {value: 'AgeMax', name: 'Max'},
            {value: 'Age', name: 'R'},
            {value: 'FakeAge', name: 'F'},
            {value: 'AgeUnknown', name: 'Unk', bool: true}
          ]
        },
        {
          name: 'Height',
          values: [
            {value: 'Height', name: 'R', height: true},
            {value: 'HeightGuess', name: 'G', height: true},
            {value: 'FakeHeight', name: 'F', height: true},
            {value: 'HeightUnknown', name: 'Unk', bool: true}
          ]
        },
        {
          name: 'Weight',
          values: [
            {value: 'Weight', name: 'R'},
            {value: 'WeightGuess', name: 'G'},
            {value: 'FakeWeight', name: 'F'},
            {value: 'WeightUnknown', name: 'Unk', bool: true}
          ]
        },
        {
          name: 'Gender',
          values: [
            {value: 'Gender', name: 'R'},
            {value: 'FakeGender', name: 'F'},
            {value: 'GenderUnknown', name: 'Unk', bool: true}
          ]
        },
        {
          name: 'Colors',
          values: [
            {value: 'HairColor', name: 'H'},
            {value: 'FakeHairColor', name: 'FH'},
            {value: 'EyeColor', name: 'E'},
            {value: 'FakeEyeColor', name: 'FE'},
            {value: 'HairColorUnknown', name: 'HUnk', bool: true},
            {value: 'EyeColorUnknown', name: 'EUnk', bool: true}
          ]
        },
        {
          name: 'Other',
          values: [
            {value: 'Alias', name: 'Alias'},
            {value: 'UseFakeData', name: 'FDat', bool: true},
            {value: 'HasSocialProfile', name: 'Soc', bool: true}
          ]
        }
      ],
      detailsHidden: this.data.Threat === 0
    };
  },
  computed: {
    keymap() {
      return {
        'alt+t': this.toggleDetails
      };
    }
  },
  methods: {
    get,

    toggleDetails(event) {
      event.preventDefault();
      this.detailsHidden = !this.detailsHidden;
    }
  }
};
</script>

<template>
  <VCard v-hotkey="keymap" color="blue-grey darken-4" elevation="2" class="mt-2">
    <VCardTitle>
      Details
      <small class="ml-1 grey--text text--darken-1">
        (Alt+T)
      </small>
      <VSpacer />
      <VBtn
        icon
        small
        @click="detailsHidden = !detailsHidden"
      >
        <VIcon>{{ detailsHidden ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</VIcon>
      </VBtn>
    </VCardTitle>
    <VExpandTransition>
      <VList v-show="!detailsHidden" two-line class="py-0 blue-grey darken-4" flat>
        <template v-for="(field, i) in fields">
          <VDivider :key="`${i}-1`" />
          <VListItem :key="`${i}-2`">
            <VListItemContent class="py-2">
              <VListItemTitle class="font-weight-normal">
                {{ field.name }}
              </VListItemTitle>
              <VListItemSubtitle>
                <span v-for="(value, j) in field.values" :key="j" class="text-body-2 font-weight-thin grey--text">
                  {{ value.name }}
                  <span class="white--text font-weight-normal">
                    {{ value.bool ? (get(data, value.value) === 1 ? 'Y' : 'N') : value.height ? $displayHeight(get(data, value.value)) : get(data, value.value) }}
                  </span>
                  <span v-if="j < field.values.length - 1" class="grey--text text--darken-2">
                    |
                  </span>
                </span>
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </template>
        <VDivider />
        <VListItem>
          <VListItemContent class="pt-2 pb-0">
            <VListItemTitle class="font-weight-normal">
              Phone
            </VListItemTitle>
            <VListItemSubtitle>
              <span v-for="(phone, i) in data.CellPhone" :key="i" class="text-body-2 font-weight-thin grey--text">
                {{ i + 1 }}
                <ImeiDisplay class="white--text font-weight-normal" :imei="phone.IMEI" />
                <span v-if="i < data.CellPhone.length - 1" class="grey--text text--darken-2">
                  |
                </span>
              </span>
            </VListItemSubtitle>
          </VListItemContent>
        </VListItem>
      </VList>
    </VExpandTransition>
  </VCard>
</template>
