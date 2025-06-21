<script setup lang="ts">
import type { SvgIconProps } from './types';

const props =  withDefaults(defineProps<SvgIconProps>(), {
  // color: '#fff',
  size: '20'
});

</script>
<script lang="ts"> export default {name: 'SvgIcon'}; </script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :fill="props.color || 'currentColor'"
    :width="props.size"
    :height="props.size"
  >
    <path :d="props.path" />
  </svg>
</template>