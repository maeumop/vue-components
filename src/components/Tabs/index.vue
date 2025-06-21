<script setup lang="ts">
  import { Comment, computed, ref, Static, Text, useSlots, type VNode, type VNodeTypes } from 'vue';
  import type { TabsProps } from './types';

  const slots = useSlots();

  const emit = defineEmits<{
    (event: 'changeTab', value: number): void;
  }>();

  const props = withDefaults(defineProps<TabsProps>(), {
    inBox: false,
  });

  const Tabs = ref<HTMLDivElement>();
  const transitionWrapper = ref<HTMLDivElement>();
  let active = ref<number>(0);
  let transition = ref<string>('tab-slide-left');

  /**
   * slot.default 아래의 vNode[] 중 :key 속성을 부여받지 못하는 vNode들 제거
   */
  const RenderSlotItems = computed<VNode[]>(() => {
    const vNodes: VNode[] = slots.default ? slots.default() : [];
    return vNodes.filter(vnode => !([Comment, Text, Static] as VNodeTypes[]).includes(vnode.type));
  });

  /**
   * 탭 항목을 클릭 할때 현재 인덱스 값 및 transition 스타일 변경
   *
   * @param index 선택된 탭 index
   */
  const setIndex = (index: number): void => {
    transition.value = active.value < index ? 'tab-slide-left' : 'tab-slide-right';
    active.value = index;

    emit('changeTab', index);
  };
</script>

<template>
  <div ref="Tabs" class="tabs">
    <div class="tab-item-wrap">
      <ul class="tab-items">
        <li
          :key="`tabs-${index}`"
          :class="{ active: index === active }"
          @click="setIndex(index)"
          v-for="(item, index) in props.tabItems"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div :class="['tab-contents', props.inBox && 'in-box']">
      <div ref="transitionWrapper" class="transition-wrapper">
        <TransitionGroup :name="transition">
          <template :key="index" v-for="(slot, index) in RenderSlotItems">
            <component :is="slot" v-show="index === active" />
          </template>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<script lang="ts">
  export default { name: 'Tabs' };
</script>
./types
