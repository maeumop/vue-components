<script setup lang="ts">
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@/assets/svg/iconPath';
import { inject } from 'vue';
import type { DatePickerStore } from '../types';

import Selector from '../Selector/index.vue';

const props = defineProps<{
  end?: boolean
  maxYear: number
  minYear: number
}>();

const store = inject('datePickerStore') as DatePickerStore;
const { dateState, setDateState } = store;

/**
 * 연도 변경
 * @param v
 * @param calc
 */
const changedYear = (v: number, calc: boolean = false): void => {
  let flag: string = props.end ? 'end' : 'start';
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
  let flag: string = props.end ? 'end' : 'start';
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
    <SvgIcon
      type="mdi"
      :path="mdiChevronDoubleLeft"
      @click="changedYear(-1, true)"
    />
    <SvgIcon
      type="mdi"
      :path="mdiChevronLeft"
      @click="changedMonth(-1, true)"
    />

    <Selector
      year
      :end="props.end"
      :max="maxYear"
      :min="minYear"
    />

    <Selector
      month
      :end="props.end"
    />

    <SvgIcon
      type="mdi"
      :path="mdiChevronRight"
      @click="changedMonth(1, true)"
    />
    <SvgIcon
      type="mdi"
      :path="mdiChevronDoubleRight"
      @click="changedYear(1, true)"
    />
  </div>
</template>

<style scoped lang="scss">
@import './style';
</style>