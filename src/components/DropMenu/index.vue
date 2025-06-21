<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
  import { dropMenuColors, dropMenuPosition, dropMenuTransition } from './const';
  import type { DropMenuProps } from './types';

  const props = withDefaults(defineProps<DropMenuProps>(), {
    position: dropMenuPosition.bottom,
    transition: dropMenuTransition.slide,
    color: dropMenuColors.primary,
  });

  const transitionName = computed<string>(() => `${props.transition}-${props.position}`);
  const dropMenu = ref<HTMLDivElement>();
  let isShow = ref<boolean>(false);
  const layerPositionStyle = reactive<CSSProperties>({
    top: '',
    bottom: '',
    left: '',
    right: '',
    width: '',
  });

  const toggle = (): void => {
    if (!isShow.value) {
      const windowHeight: number = window.innerHeight;
      const windowWidth: number = window.innerWidth;
      const rect: DOMRect = dropMenu.value!.getBoundingClientRect();

      layerPositionStyle.top = '';
      layerPositionStyle.bottom = '';
      layerPositionStyle.left = '';
      layerPositionStyle.right = '';

      switch (props.position) {
        case dropMenuPosition.top:
          layerPositionStyle.left = `${rect.left}px`;
          layerPositionStyle.bottom = `${windowHeight - rect.top}px`;
          break;
        case dropMenuPosition.right:
          layerPositionStyle.left = `${rect.right}px`;
          layerPositionStyle.top = `${rect.top}px`;
          break;
        case dropMenuPosition.left:
          layerPositionStyle.right = `${windowWidth - rect.left}px`;
          layerPositionStyle.top = `${rect.top}px`;
          break;
        default:
          layerPositionStyle.left = `${rect.left}px`;
          layerPositionStyle.top = `${rect.top + rect.height}px`;
      }
    }

    isShow.value = !isShow.value;
  };

  const clickEvent = (event: Event): void => {
    const target = event.target as HTMLElement;

    if (!dropMenu.value!.contains(target)) {
      isShow.value = false;
    }
  };

  onMounted(() => {
    // drop 메뉴의 최소 크기를 정해주기 위한 로직
    const rect = dropMenu.value!.getBoundingClientRect();
    layerPositionStyle.minWidth = `${rect.width}px`;

    document.addEventListener('click', clickEvent);
  });

  onUnmounted(() => {
    document.removeEventListener('click', clickEvent);
  });
</script>

<template>
  <div ref="dropMenu" :class="['drop-menu', props.color]" @click="toggle">
    <slot :toggle="isShow"></slot>

    <Transition :name="transitionName">
      <ul :style="layerPositionStyle" :class="['drop-menu-wrap', props.position]" v-show="isShow">
        <li :key="`menu-list-${i}`" v-for="(item, i) in props.items">
          <a href="#" @click.prevent="item.action">
            <span>{{ item.text }}</span>
            <SvgIcon type="mdi" size="20" :path="item.icon" v-if="item.icon" />
          </a>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<script lang="ts">
  export default { name: 'DropMenu' };
</script>
