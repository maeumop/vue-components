<script setup lang="ts">
  import SvgIcon from '@/components/Icon/SvgIcon.vue';
  import { onUnmounted, ref, watch } from 'vue';
  import { toastColorCase, toastIconCase } from './const';
  import type { ToastColorCase, ToastIconCase, ToastListType, ToastOptions } from './types';

  const props = withDefaults(defineProps<ToastOptions>(), {
    delay: 300,
    maxShowMessage: 4,
  });

  let color = ref<ToastColorCase>(toastColorCase.success);
  let icon = ref<ToastIconCase>(toastIconCase.success);
  let message = ref<string>('');

  let list = ref<ToastListType[]>([]);
  let timeout: number[] = [];
  let key: number = 0;

  /**
   * Toast message 를 보여주고, 해당 내용을 delay 시간 만큼 유지 시킨후 제거 한다.
   */
  const show = (): void => {
    list.value.push({
      key,
      color: color.value,
      icon: icon.value,
      message: message.value,
    });

    // 표시 시간이 지나면 자동으로 메시지 삭제
    timeout.push(
      setTimeout((): void => {
        hide(0);
      }, props.delay),
    );

    key++;

    const len: number = list.value.length;

    if (len > props.maxShowMessage) {
      hide(0);
    }
  };

  /**
   * Toast message 제거
   * @param index 사용자가 클릭한 message index
   */
  const hide = (index: number = 0): void => {
    try {
      clearTimeout(timeout[list.value[index].key]);

      if (list.value.length > 0) {
        list.value.splice(index, 1);
      }
    } catch (err) {
      clear();
      console.warn(`Toast message error: ${err}`);
    }
  };

  /**
   * 변수 초기화
   */
  const clear = (): void => {
    list.value.forEach(item => {
      clearTimeout(timeout[item.key]);
    });
    key = 0;
    timeout = [];
    message.value = '';
    list.value = [];
  };

  watch(list.value, items => {
    if (!items.length) {
      clear();
    }
  });

  onUnmounted(() => {
    props.destroy();
  });

  defineExpose({
    show,
    message,
    icon,
    color,
  });
</script>

<template>
  <div class="toast-bg">
    <TransitionGroup name="toast-view">
      <div
        :key="`toast-${item.key}`"
        :class="['toast-body', item.color ? `bg-${item.color}` : '']"
        @click="hide(i)"
        v-for="(item, i) in list"
      >
        <SvgIcon type="mdi" class="icon" :path="item.icon" v-if="item.icon" />
        <span class="message">{{ item.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
  @use './style';
</style>
