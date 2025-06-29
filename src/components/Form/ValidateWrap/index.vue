<script setup lang="ts">
import { ref, useSlots, watch } from 'vue';
import type { RuleFunc } from '../../types';
import type { ValidateWrapProps } from './types';

const props = withDefaults(defineProps<ValidateWrapProps>(), {
  validate: (): RuleFunc[] => [],
  errorMessage: '',
});

const emit = defineEmits<{
  (event: 'update:checkValue'): void;
}>();

const slots = useSlots();

watch(
  () => [props.checkValue, props.validate, props.disabled],
  (a, b) => {
    if (a[0] !== b[0]) {
      emit('update:checkValue');
    }

    resetForm();
  },
);

watch(
  () => props.errorMessage,
  v => {
    message.value = v;
  },
);

const isValidate = ref<boolean>(true);
const checkPass = ref<boolean>(false);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);

const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {
    // validate check
    if (props.validate.length) {
      for (let i = 0; i < props.validate.length; i++) {
        const result = props.validate[i](props.checkValue);

        if (typeof result === 'string') {
          if (!silence) {
            errorTransition.value = true;
            message.value = result;
            isValidate.value = false;
            checkPass.value = false;
          }

          return false;
        } else {
          message.value = '';
        }
      }
    }

    isValidate.value = true;
    checkPass.value = true;

    return true;
  }

  return false;
};

const resetForm = (): void => {
  isValidate.value = true;
  checkPass.value = false;
  message.value = '';
};

const resetValidate = (): void => {
  resetForm();
};

const childBlur = (): void => {
  check();
};

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div class="validate-wrap">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
      <div class="add-option" v-if="slots['add-on']">
        <slot name="add-on"></slot>
      </div>
    </div>

    <div :class="['input-wrap', { error: message }]">
      <slot :on-blur="childBlur"></slot>
    </div>

    <div
      :class="['feedback', { error: errorTransition }]"
      @animationend="errorTransition = false"
      v-show="message"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
<script lang="ts">
export default { name: 'ValidateWrap' };
</script>
