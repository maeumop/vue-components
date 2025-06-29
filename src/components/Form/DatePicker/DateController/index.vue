<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { inject } from 'vue';
import type { DatePickerStore } from '../types';

import Selector from '../Selector/index.vue';

const props = defineProps<{
  end?: boolean;
  maxYear: number;
  minYear: number;
}>();

const store = inject('datePickerStore') as DatePickerStore;
const { dateState, setDateState } = store;

/**
 * 연도 변경
 * @param v
 * @param calc
 */
const changedYear = (v: number, calc: boolean = false): void => {
  const flag: string = props.end ? 'end' : 'start';
  let year: number = v;

  if (calc) {
    year = dateState[flag].year + v;

    if (year > props.maxYear) {
      year = props.maxYear;
    } else if (year < props.minYear) {
      year = props.minYear;
    }
  }

  setDateState(flag, 'year', year);
};

/**
 * 월 변경, 계산 된 내용이 1 미만, 12 초과 일 경우 연도를 새로 계산하여 적용
 * @param v
 * @param calc
 */
const changedMonth = (v: number, calc: boolean = false): void => {
  const flag: string = props.end ? 'end' : 'start';
  let month: number = v;

  if (calc) {
    month = dateState[flag].month + v;

    let year: number = dateState[flag].year;

    if (month > 12) {
      month = 1;
      year++;
    } else if (month <= 0) {
      month = 12;
      year--;
    }

    setDateState(flag, 'year', year);
  }

  setDateState(flag, 'month', month);
};
</script>

<template>
  <div class="select-month">
    <Icon icon="mdi:chevron-double-left" @click="changedYear(-1, true)" />
    <Icon icon="mdi:chevron-left" @click="changedMonth(-1, true)" />

    <Selector year :end="props.end" :max="maxYear" :min="minYear" />

    <Selector month :end="props.end" />

    <Icon icon="mdi:chevron-right" @click="changedMonth(1, true)" />
    <Icon icon="mdi:chevron-double-right" @click="changedYear(1, true)" />
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
