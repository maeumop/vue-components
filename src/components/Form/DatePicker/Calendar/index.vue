<script setup lang="ts">
  import { inject, ref, watch } from 'vue';
  import { transitionCase } from '../const';
  import { useDatePickerHelper } from '../helper';
  import type { DateCellType, DatePickerStore, DateStateValueType, TransitionCase } from '../types';

  const emit = defineEmits<{
    (event: 'update:date', value: boolean): void;
  }>();

  const props = withDefaults(
    defineProps<{
      end?: boolean;
      range: boolean;
      separator: string;
      maxRange: number;
    }>(),
    {
      modelValue: '',
      end: false,
    },
  );

  const store = inject('datePickerStore') as DatePickerStore;
  const {
    startDate,
    endDate,
    curYear,
    curMonth,
    curDay,
    beforeState,
    dateState,
    selectedDate,
    setStartDate,
    setEndDate,
    setSelected,
  } = store;
  const helper = useDatePickerHelper();

  const caseStartEnd: string = props.end ? 'end' : 'start';
  const before: DateStateValueType = beforeState[caseStartEnd];
  const state: DateStateValueType = dateState[caseStartEnd];

  let isShow = ref<boolean>(true);

  const head: string[] = ['일', '월', '화', '수', '목', '금', '토'];
  const transitionName = ref<TransitionCase>(transitionCase.down);
  const dateRender = ref<DateCellType[][]>([]);

  watch([startDate, endDate], v => {
    let date = props.end ? endDate.value : startDate.value;

    if (v) {
      setSelected(caseStartEnd, date);
    } else {
      setSelected(caseStartEnd, '');
    }
  });

  watch(
    () => state.year,
    v => {
      if (v > before.year) {
        transitionName.value = transitionCase.down;
      } else {
        transitionName.value = transitionCase.up;
      }

      isShow.value = false;
    },
  );

  watch(
    () => state.month,
    v => {
      if (v > before.month) {
        transitionName.value = transitionCase.left;
      } else {
        transitionName.value = transitionCase.right;
      }

      isShow.value = false;
    },
  );
  /**
   * 날짜 선택
   * 달력의 2차원 배열에 맞게 전달 값을 받아 날짜 정보 확인 후 처리
   *
   * @param tr 1차 배열 index
   * @param td 2차 배열 index
   * @param flag  start | end
   */
  const selectedDay = (tr: number, td: number): void => {
    // 날짜 선택
    const { type, day } = dateRender.value[tr][td];

    if (['current', 'today', 'date-range'].includes(type)) {
      const date: string = helper.getDateString(state.year, state.month, day, props.separator);
      setSelected(caseStartEnd, date);

      if (props.end) {
        const startTime = new Date(startDate.value).getTime();
        const endTime = new Date(selectedDate[caseStartEnd]).getTime();

        if (endTime >= startTime) {
          setEndDate(selectedDate[caseStartEnd]);
        } else {
          // 종료일이 시작일 보다 이전 날짜일 경우(오늘 날짜 선택가능) 이전 선택된 날짜로 돌린다.
          setSelected(caseStartEnd, endDate.value);
        }
      } else {
        setStartDate(selectedDate[caseStartEnd]);
      }

      emit('update:date', props.end);
    }
  };

  /**
   * 달력 랜더링 기초 데이터 생성
   *
   * @param flag start, end
   */
  const makeCalendar = (): void => {
    const startWeek: number = new Date(state.year, state.month - 1, 1).getDay();
    const lastDay: number = new Date(state.year, state.month, 0).getDate();

    let day: number = 1;
    let afterDay: number = 1;
    let beforeDay: number = helper.getBeforeDay(state.year, state.month - 1, startWeek);

    let startTime: number = new Date(startDate.value).getTime();
    let endTime: number = new Date(endDate.value).getTime();

    // 달력 총 7일 6줄을 생성한다
    for (let i = 0; i < 6; i++) {
      dateRender.value[i] = [];
    }

    let objData: DateCellType = { day: 0, type: '' };
    const { year, month } = state;

    for (let j = 0; j < 6 * 7; j++) {
      if (j >= startWeek && day <= lastDay) {
        let formatDate = helper.getDateString(year, month, day, props.separator);

        if (selectedDate[caseStartEnd] === formatDate) {
          objData = { day, type: 'selected' };
        } else if (year === curYear.value && month === curMonth.value && day === curDay.value) {
          objData = { day, type: 'today' };
        } else {
          objData = { day, type: 'current' };
        }

        // 시작 날짜와 끝 날짜 사이에 색상 표시
        if (objData.type !== 'selected' && props.range) {
          // 랜더링 하는 날짜의 time 값
          let time = new Date(formatDate).getTime();

          // 선택된 날짜 사이의 색상을 변경
          if (selectedDate[caseStartEnd]) {
            if (time >= startTime && time <= endTime) {
              if (props.end === false && time >= startTime) {
                objData.type = 'date-range';
              } else if (props.end && time <= endTime) {
                objData.type = 'date-range';
              }
            }

            // 시작일과 종료일 기준으로 선택 할 수 없도록 처리
            if (props.end && selectedDate[caseStartEnd] && time < startTime) {
              objData.type = 'disabled';
            } else if (props.end === false && selectedDate[caseStartEnd] && time > endTime) {
              objData.type = 'disabled';
            }
          }
        }

        day++;
      } else if (day > lastDay) {
        objData = { day: afterDay++, type: 'afterMonth' };
      } else if (j < startWeek) {
        objData = { day: beforeDay++, type: 'beforeMonth' };
      }

      let index = Math.floor(j / 7);
      dateRender.value[index][j % 7] = objData;
    }
  };

  const resetTransition = (): void => {
    setTimeout(() => {
      makeCalendar();
      isShow.value = true;
    }, 30);
  };

  const resetSelected = (): void => {
    setSelected(caseStartEnd, '');
  };

  makeCalendar();

  defineExpose({
    resetSelected,
    makeCalendar,
  });
</script>

<template>
  <div class="select-calendar-wrap">
    <Transition :name="transitionName" @after-leave="resetTransition">
      <div class="select-calendar" v-show="isShow">
        <ul class="header">
          <li
            :key="`start-head-${name}`"
            :class="{ sun: i === 0, sat: i === 6 }"
            v-for="(name, i) in head"
          >
            {{ name }}
          </li>
        </ul>
        <ul :key="`start-tr-${i}`" v-for="(li, i) in dateRender">
          <li
            :key="`calendar-${item.type}-${item.day}`"
            :class="[item.type, { sun: j === 0, sat: j === 6 }]"
            @click.prevent="selectedDay(i, j)"
            v-for="(item, j) in li"
          >
            {{ item.day }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  @import './style';
</style>
