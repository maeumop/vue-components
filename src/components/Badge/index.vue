<script setup lang="ts">
import { computed } from 'vue';
import { badgeColors, badgePosition } from './const';
import type { BadgeProps } from './types';

const props = withDefaults(defineProps<BadgeProps>(), {
  color: badgeColors.primary,
  position: badgePosition.right,
});

const badgeStyle = computed<any[]>(() => {
  const size:string = `size-${props.large ? 'large' : 'default'}`;

  return ['badge', props.icon && 'icon',  props.color, size, props.position];
});
</script>

<template>
  <div class="badge-wrapper">
    <slot></slot>
    <div :class="badgeStyle">
      <template v-if="props.icon && props.large">
        <SvgIcon size="16" type="mdi" :path="props.icon" />
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