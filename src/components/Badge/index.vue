<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { computed } from 'vue';
  import { createClassName, isValidColor, isValidPosition } from '../constants';
  import { BADGE_CONFIG, badgeColors, badgePosition } from './const';
  import type { BadgeProps } from './types';

  const props = withDefaults(defineProps<BadgeProps>(), {
    color: badgeColors.primary,
    position: badgePosition.right,
    size: BADGE_CONFIG.defaultSize,
  });

  // 크기 계산 (large prop과 size prop 호환성)
  const badgeSize = computed(() => {
    return props.large ? BADGE_CONFIG.largeSize : props.size;
  });

  // 아이콘 크기 계산
  const iconSize = computed(() => {
    return badgeSize.value === BADGE_CONFIG.largeSize
      ? BADGE_CONFIG.largeIconSize
      : BADGE_CONFIG.defaultIconSize;
  });

  // 뱃지 스타일 클래스 생성
  const badgeStyle = computed<string[]>(() => {
    const modifiers: Record<string, string | boolean> = {
      icon: !!props.icon && badgeSize.value === BADGE_CONFIG.largeSize,
      [props.color]: isValidColor(props.color),
      [badgeSize.value]: true,
      [props.position]: isValidPosition(props.position),
    };

    return createClassName('badge', modifiers).split(' ');
  });

  // 래퍼 클래스 생성
  const wrapperClass = computed(() => {
    const classes = ['badge-wrapper'];
    if (props.wrapperClass) {
      classes.push(props.wrapperClass);
    }
    return classes.join(' ');
  });

  // 뱃지 클래스 생성
  const badgeClass = computed(() => {
    const classes = badgeStyle.value;
    if (props.badgeClass) {
      classes.push(props.badgeClass);
    }
    return classes.join(' ');
  });

  // 접근성 라벨 생성
  const ariaLabel = computed(() => {
    if (props.text) {
      return `${props.text}개의 알림`;
    }
    return '알림';
  });
</script>

<template>
  <div :class="wrapperClass">
    <slot></slot>
    <div :class="badgeClass" :aria-label="ariaLabel" role="status">
      <template v-if="props.icon && badgeSize === BADGE_CONFIG.largeSize">
        <Icon :icon="props.icon" :width="iconSize" :height="iconSize" />
      </template>
      <template v-else>
        {{ props.text }}
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<script lang="ts">
  export default { name: 'Badge' };
</script>
