<script setup lang="ts">
  import { computed } from 'vue';
  import { listTableCheckboxIcon, listTableRadioIcon } from './const';
  import type { ListTableListCheckIconKeys, ListTableListCheckProps } from './types';

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
  }>();

  const props = withDefaults(defineProps<ListTableListCheckProps>(), {
    type: 'checkbox',
  });

  const svgIcon = computed<string>(() => {
    let type: ListTableListCheckIconKeys = 'blank';

    if (props.disabled) {
      type = 'disabled';
    } else if (props.modelValue) {
      type = 'checked';
    }

    return props.type === 'radio' ? listTableRadioIcon[type] : listTableCheckboxIcon[type];
  });

  const checkEvent = (event: Event): void => {
    if (!props.disabled) {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.checked);
    }
  };
</script>

<template>
  <label class="checkbox-wrap">
    <input
      :type="props.type"
      :disabled="props.disabled"
      :value="props.value"
      :checked="props.modelValue === true"
      @input="checkEvent"
      v-show="false"
    />
    <SvgIcon size="2.4rem" :path="svgIcon" />
  </label>
</template>
<script lang="ts">
  export default { name: 'ListTableCheck' };
</script>
