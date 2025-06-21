<script setup lang="ts">
import { mdiChevronDown } from '@/assets/svg/iconPath.js';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { StatusSelectorProps } from './types.d.ts';

const props = withDefaults(defineProps<StatusSelectorProps>(), {
  circle: false,
  readOnly: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void,
  (event: 'update:selectedIndex', value: number): void,
}>();

let text = ref<string>('대기중');
let color = ref<string>('grey');
let isShow = ref<boolean>(false);
let selectedIndex = ref<number>(-1);
const selector = ref<HTMLDivElement>();

const getWrapColor = computed(() => {
  return { backgroundColor: props.bgColor === undefined ? '#efefef' : props.bgColor };
});

const toggle = (): void => {
  if (!props.readOnly) {
    isShow.value = !isShow.value;
  }
};

const outsideClickEvent = (evt: MouseEvent) => {
  if (selector.value !== undefined) {
    const target = evt.target as HTMLElement;

    if (!selector.value.contains(target)) {
      isShow.value = false;
    }
  }
};

const selection = (i: number) => {
  selectedIndex.value = i;
  color.value = props.options[i].color;
  text.value = props.options[i].text;
  toggle();

  emit('update:modelValue', props.options[i].value);
  emit('update:selectedIndex', i);
};

const getCircleColor = (color:string): string => {
  return ['primary', 'secondary', 'info', 'success', 'warning', 'danger']
    .includes(color) ? color : ``;
};


onMounted(() => {
  for (let i = 0; i < props.options.length; i++) {
    let item = props.options[i];

    if (item.value === props.modelValue) {
      color.value = item.color;
      text.value = item.text;
      selectedIndex.value = i;
    }
  }

  document.addEventListener('click', outsideClickEvent);
});

onUnmounted(() => {
  document.removeEventListener('click', outsideClickEvent);
});
</script>

<template>
  <div
    ref="selector"
    class="status-selector"
    @click="toggle"
  >
    <div
      :class="['wrap', { readonly: props.readOnly }]"
      :style="getWrapColor"
    >
      <span
        :class="['circle', getCircleColor(color) ]"
        :style="getCircleColor(color) || { backgroundColor: color }"
        v-if="props.circle"
      >
      </span>
      <span :style="getCircleColor(color) || { color: color }">{{ text }}</span>
      <SvgIcon
        size="12"
        type="mdi"
        :path="mdiChevronDown"
        :class="{ rotate:isShow }"
        v-if="!props.readOnly"
      />
    </div>

    <Transition name="fade">
      <ul v-show="isShow">
        <li
          :key="`selector-${i}`"
          @click.stop="selection(i)"
          v-for="(item, i) in props.options"
        >
          <div class="selectorWrap">
            <span
              :class="['circle', getCircleColor(item.color) ]"
              :style="getCircleColor(item.color) || { backgroundColor: item.color }"
              v-if="props.circle"
            >
            </span>
            {{ item.text }}
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import './style';
</style>
<script lang="ts">
export default { name: 'StatusSelector' };
</script>