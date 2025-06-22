<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import type { StyleValue } from 'vue';
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
  import { tooltipColor, tooltipPosition } from './const';
  import type { TooltipPosition, TooltipProps } from './types';

  const slots = useSlots();
  const props = withDefaults(defineProps<TooltipProps>(), {
    position: tooltipPosition.BOTTOM,
    hovering: true,
    btnClose: false,
    block: false,
    color: tooltipColor.DEFAULT,
    width: 140,
  });

  // 반응형 상태
  const isShow = ref<boolean>(false);
  const tooltipTrans = ref<string>('tooltip');
  const position = ref<TooltipPosition>(props.position);

  // DOM 참조
  const container = ref<HTMLElement>();
  const tooltip = ref<HTMLDivElement>();

  // 계산된 속성
  const bindingStyle = computed<StyleValue>(() => {
    const baseStyle: StyleValue = {
      width: props.width && `${props.width}px`,
      padding: props.padding,
    };

    return baseStyle;
  });

  // 테마 클래스 계산
  const themeClass = computed<string>(() => {
    return `tooltip-theme-${props.color}`;
  });

  // 툴팁 위치 계산
  const calculatePosition = (): void => {
    if (!tooltip.value || !container.value) {
      return;
    }

    const containerRect = container.value.getBoundingClientRect();
    const gap = 8;

    let left = '';
    let top = '';
    let right = '';
    let bottom = '';

    switch (props.position) {
      case tooltipPosition.RIGHT:
        left = `${containerRect.width + gap}px`;
        top = `${(containerRect.height - tooltip.value.offsetHeight) / 2}px`;
        break;
      case tooltipPosition.LEFT:
        right = `${containerRect.width + gap}px`;
        top = `${(containerRect.height - tooltip.value.offsetHeight) / 2}px`;
        break;
      case tooltipPosition.TOP:
        left = `${(containerRect.width - tooltip.value.offsetWidth) / 2}px`;
        bottom = `${containerRect.height + gap}px`;
        break;
      default: // BOTTOM
        left = `${(containerRect.width - tooltip.value.offsetWidth) / 2}px`;
        top = `${containerRect.height + gap}px`;
        break;
    }

    // 툴팁 위치 설정
    tooltip.value.style.left = left;
    tooltip.value.style.top = top;
    tooltip.value.style.right = right;
    tooltip.value.style.bottom = bottom;
  };

  // 툴팁 표시
  const showTooltip = (): void => {
    if (!tooltip.value) {
      return;
    }

    isShow.value = true;

    // 다음 틱에서 위치 계산 (DOM 업데이트 후)
    nextTick(() => {
      calculatePosition();
    });
  };

  // 툴팁 숨김
  const hideTooltip = (): void => {
    isShow.value = false;
  };

  // 마우스 이벤트 처리
  const onMouseEnter = (): void => {
    if (props.hovering) {
      showTooltip();
    }
  };

  const onMouseLeave = (): void => {
    if (props.hovering) {
      hideTooltip();
    }
  };

  // 클릭 이벤트 처리
  const onClick = (): void => {
    if (!props.hovering) {
      toggle();
    }
  };

  // 외부 클릭 감지
  const handleOutsideClick = (event: Event): void => {
    if (!props.hovering && isShow.value) {
      const target = event.target as HTMLElement;
      if (container.value && !container.value.contains(target)) {
        hideTooltip();
      }
    }
  };

  // 토글 함수 (클릭 모드)
  const toggle = (): void => {
    if (!props.hovering) {
      if (isShow.value) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // 숨기기 함수
  const hide = (): void => {
    hideTooltip();
  };

  // 위치 설정
  const setPosition = (): void => {
    position.value = props.position;
    if (isShow.value) {
      nextTick(() => {
        calculatePosition();
      });
    }
  };

  // 윈도우 리사이즈 감지
  const handleResize = (): void => {
    if (isShow.value) {
      nextTick(() => {
        calculatePosition();
      });
    }
  };

  // 라이프사이클
  onMounted(() => {
    // window 리사이즈 이벤트 추가
    window.addEventListener('resize', handleResize);

    // 외부 클릭 감지 이벤트 추가
    document.addEventListener('click', handleOutsideClick);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleOutsideClick);
  });

  // 위치 변경 감지
  watch(() => [props.position], setPosition, { immediate: true });

  // 닫기 함수
  const close = (): void => {
    tooltipTrans.value = '';
    hideTooltip();
  };

  // 외부 노출
  defineExpose({
    close,
  });
</script>

<template>
  <div
    ref="container"
    :class="['tooltip-container', { block: props.block }]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <!-- 감싸진 요소 (slot) -->
    <slot :toggle="toggle" :is-show="isShow"></slot>

    <!-- 툴팁 레이어 -->
    <Transition :name="tooltipTrans">
      <div
        ref="tooltip"
        :style="bindingStyle"
        :class="['tooltip-layer', position, themeClass, { dark: props.dark }]"
        role="tooltip"
        :aria-label="Array.isArray(message) ? message.join(', ') : message"
        v-show="isShow"
      >
        <template v-if="slots.content">
          <slot name="content" :close="hide"></slot>
        </template>
        <template v-else-if="Array.isArray(message)">
          <div class="title" v-if="props.title">
            <h5>{{ props.title }}</h5>
            <button
              v-if="props.btnClose"
              @click.stop="hide"
              class="close-btn"
              type="button"
              aria-label="툴팁 닫기"
            >
              <Icon icon="mdi:window-close" class="close" size="14" />
            </button>
          </div>
          <ul class="message-list">
            <li v-for="(msg, index) in message" :key="`tooltip-message-${index}`">
              {{ msg }}
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="single-message">{{ message }}</div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
  @use './style';
</style>

<script lang="ts">
  export default { name: 'Tooltip' };
</script>
