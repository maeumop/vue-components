<script setup lang="ts">
  import {
    mdiChevronDoubleLeft,
    mdiChevronDoubleRight,
    mdiChevronLeft,
    mdiChevronRight,
  } from '@/assets/svg/iconPath';
  import { computed, ref, watch, watchEffect } from 'vue';
  import type { PaginationEmits, PaginationItem, PaginationProps } from './types';

  const emit = defineEmits<PaginationEmits>();
  const props = withDefaults(defineProps<PaginationProps>(), {
    size: 20,
    block: 10,
    total: 0,
  });

  let pageList = ref<PaginationItem[]>([]);
  let maxPage = ref<number>(1);
  let pageBlock = ref<number>(10);
  let startPage = ref<number>(1);
  let endPage = ref<number>(1);
  let prev = ref<number>(0);
  let next = ref<number>(0);

  const nowPage = computed<number>(() => {
    let result: number = 1;

    if (props.modelValue) {
      result = props.modelValue;

      result < 1 && (result = 1);
      props.modelValue > maxPage.value && (result = maxPage.value);
    }

    return result;
  });

  const isDisabledPrev = computed<boolean>(() => nowPage.value <= props.block);
  const isDisabledNext = computed<boolean>(() => next.value === maxPage.value);

  watch(
    () => [props.total, props.size, props.block],
    () => {
      makePageList();
    },
  );

  watch(
    () => [props.block],
    () => {
      pageBlock.value = props.block || 10;
    },
  );

  watchEffect(
    () => {
      makePageList(props.modelValue);
    },
    { flush: 'post' },
  );

  const makePageList = (now: number = nowPage.value): void => {
    pageList.value = [];
    maxPage.value = Math.ceil((props.total || 1) / props.size);
    startPage.value = Math.floor((now - 1) / pageBlock.value) * pageBlock.value + 1;
    endPage.value =
      startPage.value + pageBlock.value - 1 > maxPage.value
        ? maxPage.value
        : startPage.value + pageBlock.value - 1;

    if (endPage.value === 0) {
      endPage.value = 1;
    }

    prev.value = startPage.value - 1 > 0 ? startPage.value - 1 : 1;
    next.value =
      startPage.value + pageBlock.value <= maxPage.value ? endPage.value + 1 : maxPage.value;

    for (let num = startPage.value; num <= endPage.value; num++) {
      pageList.value.push({
        num,
        isOn: now === num ? true : false,
      });
    }
  };

  const updateValue = (v: number): void => {
    if (v !== nowPage.value) {
      emit('update:modelValue', v);
    }
  };

  makePageList();
</script>

<template>
  <div class="pagination">
    <ul>
      <li :class="{ disable: nowPage <= 1 }">
        <a href="#" @click.prevent="updateValue(1)">
          <SvgIcon type="mdi" size="20" :path="mdiChevronDoubleLeft" />
        </a>
      </li>
      <li :class="{ disable: isDisabledPrev }">
        <a href="#" @click.prevent="updateValue(prev)">
          <SvgIcon type="mdi" size="20" :path="mdiChevronLeft" />
        </a>
      </li>

      <li
        :key="`page-key-${v.num}`"
        :class="['page-item', { active: v.num === nowPage }]"
        v-for="v in pageList"
      >
        <a href="#" @click.prevent="updateValue(v.num)">{{ v.num }}</a>
      </li>

      <li :class="{ disable: isDisabledNext }">
        <a href="#" @click.prevent="updateValue(next)">
          <SvgIcon type="mdi" size="20" :path="mdiChevronRight" />
        </a>
      </li>
      <li :class="{ disable: nowPage >= maxPage }">
        <a href="#" @click.prevent="updateValue(maxPage)">
          <SvgIcon type="mdi" size="20" :path="mdiChevronDoubleRight" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  @use './style';
</style>
<script lang="ts">
  export default { name: 'Pagination' };
</script>
