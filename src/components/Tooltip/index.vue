<script setup lang="ts">
import { mdiHelpCircle, mdiWindowClose } from '@/assets/svg/iconPath';
import type { StyleValue } from 'vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import type { TooltipProps } from './types';

const slots = useSlots();
const props = withDefaults(defineProps<TooltipProps>(), {
  left: false,
  right: false,
  top: false,
  bottom: false,
  hovering: false,
  btnClose: false,
  icon: mdiHelpCircle,
  block: false,
});

let position = ref<string>('');
let isShow = ref<boolean>(false);
let tooltipTrans = ref<string>('tooltip');

const el = ref<HTMLElement>();
const tooltip = ref<HTMLDivElement>();
const bindingStyle = computed<StyleValue>(() => {
  return {
    width: props.width && `${props.width}px !important`,
    padding: props.padding,
  };
});

const tooltipPosition = (): void => {
  if (isShow.value) {
    const windowHeight: number = window.innerHeight;
    const windowWidth: number = window.innerWidth;
    const rect: DOMRect = el.value!.getBoundingClientRect();

    nextTick(() => {
      if (tooltip.value) {
        const tipRect: DOMRect = tooltip.value.getBoundingClientRect();
        const type = (props.left || props.right) ? 'height' : 'width';
        const center = (rect[type] - tipRect[type]) / 2;

        if (props.right) {
          tooltip.value.style.left = `${rect.right}px`;
          tooltip.value.style.top = `${rect.top + center}px`;

        } else if (props.left) {
          tooltip.value.style.right = `${windowWidth - rect.left}px`;
          tooltip.value.style.top = `${rect.top + center}px`;

        } else if (props.top) {
          tooltip.value.style.left = `${rect.left + center}px`;
          tooltip.value.style.bottom = `${windowHeight - rect.top}px`;

        } else {
          tooltip.value.style.left = `${rect.left + center}px`;
          tooltip.value.style.top = `${rect.top + rect.height}px`;
        }
      }
    });
  }
};

const resetStyle = (): void => {
  if (tooltip.value) {
    tooltip.value.style.left = '';
    tooltip.value.style.right = '';
    tooltip.value.style.top = '';
    tooltip.value.style.bottom = '';
  }
};

const onMouse = (show: boolean): void => {
  if (props.hovering) {
    isShow.value = show;
    tooltipPosition();
  }
};

const toggle = (): void => {
  if (!props.hovering) {
    isShow.value = !isShow.value;
    tooltipPosition();
  }
};

const hide = (): void => {
  isShow.value = false;
};

if (props.top) {
  position.value = 'top';
} else if (props.left) {
  position.value = 'left';
} else if (props.right) {
  position.value = 'right';
} else {
  position.value = 'bottom';
}

let eventParentElement: HTMLElement;

const parentScrollEvent = (): void => {
  if (isShow.value) {
    isShow.value = false;
  }
};

/**
 * 컴포넌트 상위 element를 탐색(재귀)하며 scroll이 있는 Element에
 * scroll event를 추가 하여 scorll 발생시 layer 창을 닫아 준다.
 * @param el
 */
const setScrollEvent = (el: HTMLElement): void => {
  const parent = el.parentElement as HTMLElement;

  if (parent && parent.tagName.toLowerCase() !== 'html') {
    if (parent.scrollHeight > parent.clientHeight + 10) {
      eventParentElement = parent;
      eventParentElement.addEventListener('scroll', parentScrollEvent);
      return;
    }

    setScrollEvent(parent);
  }
};

const close = (): void => {
  tooltipTrans.value = '';
  hide();
};

onMounted(() => {
  setScrollEvent(el.value!);
});

onBeforeUnmount(() => {
  if (eventParentElement) {
    eventParentElement.removeEventListener('scroll', parentScrollEvent);
  }
});

defineExpose({
  close,
});
</script>

<template>
  <div
    ref="el"
    :class="['tooltip-wrap', props.block && 'block']"
    @mouseenter="onMouse(true)"
    @mouseleave="onMouse(false)"
  >
    <div class="icon-wrap">
      <slot :toggle="toggle" v-if="slots.default !== undefined"></slot>
      <SvgIcon
        type="mdi"
        class="icon"
        :size="props.iconSize"
        :path="props.icon"
        @click="toggle"
        v-else
      />
    </div>

    <Transition :name="tooltipTrans" @after-leave="resetStyle">
      <div
        ref="tooltip"
        :style="bindingStyle"
        :class="['message-box', position, props.dark && 'dark']"
        v-show="isShow"
      >
        <template v-if="slots.content">
          <slot name="content" :close="hide"></slot>
        </template>
        <template v-else-if="Array.isArray(message)">
          <div class="title" v-if="props.title">
            <h5 v-if="props.title">{{ props.title }}</h5>

            <a href="#" @click.stop.prevent="hide" v-if="props.btnClose">
              <SvgIcon
                type="mdi"
                class="close"
                size="14"
                :path="mdiWindowClose"
              />
            </a>
          </div>

          <ul class="message-list">
            <li
              :key="`tooltip-message-list-${msg}`"
              v-for="msg in message"
            >
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
@import './style';
</style>
<script lang="ts">
export default { name: 'Tooltip' };
</script>