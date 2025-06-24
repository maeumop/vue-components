<script setup lang="ts">
  import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { DatePickerStore } from '../types';

  const props = withDefaults(
    defineProps<{
      year?: boolean;
      month?: boolean;
      end?: boolean;
      max?: number;
      min?: number;
    }>(),
    {
      max: 0,
      min: 1900,
    },
  );

  const store = inject('datePickerStore') as DatePickerStore;
  const { dateState, setDateState } = store;

  // 목록
  const el = ref<HTMLElement>();
  const items = ref<number[]>([]);
  const isShow = ref<boolean>(false);

  const flag: string = props.end ? 'end' : 'start';

  watch(
    () => props.max,
    v => {
      if (v > 0) {
        items.value = [];

        for (let i: number = v; i >= props.min; i--) {
          items.value.push(i);
        }
      }
    },
  );

  const getDateString = computed<string>(() => {
    return props.year ? dateState[flag].year + '년' : dateState[flag].month + '월';
  });

  const getDate = computed<number>(() => {
    return props.year ? dateState[flag].year : dateState[flag].month - 1;
  });

  watch(isShow, v => {
    nextTick(() => {
      if (el.value && v) {
        const li = el.value.querySelector<HTMLLIElement>('li.active');
        const top: number = li ? li.offsetTop - li.offsetHeight : 0;
        el.value.scrollTop = top;
      }
    });
  });

  /**
   * 선택된 연, 월 적용
   * @param v
   */
  const changedDate = (v: number): void => {
    setDateState(flag, props.year ? 'year' : 'month', props.year ? v : v + 1);
  };

  const Selector = ref<HTMLSpanElement>();

  /**
   * 년, 월 드롭 다운 레이어 외의 구역을 클릭 할 경우 레이어 닫기
   * @param evt
   */
  const outsideClickEvent = (evt: Event): void => {
    const target = evt.target as HTMLElement;

    if (!Selector.value?.contains(target)) {
      isShow.value = false;
    }
  };

  onMounted(() => {
    if (props.year) {
      const maxYear = props.max ? props.max : new Date().getFullYear();

      for (let i = maxYear; i >= props.min; i--) {
        items.value.push(i);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        items.value.push(i);
      }
    }

    document.addEventListener('click', outsideClickEvent);
  });

  onUnmounted(() => {
    document.removeEventListener('click', outsideClickEvent);
  });
</script>

<template>
  <span ref="Selector" @click="isShow = !isShow">
    {{ getDateString }}

    <Transition appear name="trans-slide-down">
      <div :class="['selector-box', { month: props.month }]" v-show="isShow">
        <div class="selector-box-wrap">
          <ul ref="el">
            <li
              :key="`date-${num}`"
              :class="{ active: num === getDate }"
              @click="changedDate(num)"
              v-for="num in items"
            >
              {{ max ? num : num + 1 }}
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </span>
</template>

<style scoped lang="scss">
  @use './style';
</style>
