<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { badgeColor, badgeConfig, badgePosition } from './const';
import type { BadgeProps } from './types';

const props = withDefaults(defineProps<BadgeProps>(), {
  color: badgeColor.primary,
  position: badgePosition.right,
  size: badgeConfig.defaultSize,
});

// 크기 계산 (large prop과 size prop 호환성)
const badgeSize = computed(() => {
  return props.large ? badgeConfig.largeSize : props.size;
});

// 아이콘 크기 계산
const iconSize = computed(() => {
  return badgeSize.value === badgeConfig.largeSize
    ? badgeConfig.largeIconSize
    : badgeConfig.defaultIconSize;
});

// 뱃지 스타일 클래스 생성
const badgeStyle = computed<string[]>(() => {
  const classes = ['badge'];
  // 색상 클래스 - badgeColors의 키 값들을 직접 확인
  const validColors = Object.keys(badgeColor);

  if (validColors.includes(props.color)) {
    classes.push(props.color);
  } else {
    console.warn('Invalid color:', props.color, 'Valid colors:', validColors);
  }

  // 크기 클래스
  classes.push(`size-${badgeSize.value}`);

  // 위치 클래스 - 공통 상수와 SCSS 클래스명 매핑
  const positionMapping: Record<string, string> = {
    [badgePosition.right]: 'right',
    [badgePosition.left]: 'left',
    [badgePosition.bottomRight]: 'bottom-right',
    [badgePosition.bottomLeft]: 'bottom-left',
  };

  const positionClass = positionMapping[props.position];
  if (positionClass) {
    classes.push(positionClass);
  }

  // 아이콘 클래스
  if (props.icon && badgeSize.value === badgeConfig.largeSize) {
    classes.push('icon');
  }

  return classes;
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
      <template v-if="props.icon && badgeSize === badgeConfig.largeSize">
        <Icon :icon="props.icon" :width="iconSize" :height="iconSize" />
      </template>
      <template v-else>
        {{ props.text }}
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
<script lang="ts">
export default { name: 'Badge' };
</script>
