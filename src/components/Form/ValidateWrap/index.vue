<script setup lang="ts">
import { ref, useSlots, watch } from 'vue';
import type { RuleFunc } from '../../types';
import type { ValidateWrapProps } from './types';

const props = withDefaults(defineProps<ValidateWrapProps>(), {
  validate: (): RuleFunc[] => [],
  errorMessage: '',
});

// emit은 현재 사용되지 않지만 향후 확장을 위해 유지
// const emit = defineEmits<ValidateWrapEmits>();

const slots = useSlots();

watch(
  () => props.checkValue,
  () => {
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
const message = ref<string>('');
const showError = ref<boolean>(false);

const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // errorMessage가 설정되어 있으면 해당 메시지 사용
  if (props.errorMessage) {
    if (!silence) {
      message.value = props.errorMessage;
      showError.value = true;
      isValidate.value = false;
    }
    return false;
  }

  // validate 함수들 실행
  if (props.validate.length) {
    for (const validateFunc of props.validate) {
      const result = validateFunc(props.checkValue);

      if (typeof result === 'string') {
        if (!silence) {
          message.value = result;
          showError.value = true;
          isValidate.value = false;
        }

        return false;
      }
    }
  }

  // 모든 검증 통과
  message.value = '';
  showError.value = false;
  isValidate.value = true;
  return true;
};

const resetForm = (): void => {
  isValidate.value = true;
  message.value = '';
  showError.value = false;
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

    <div :class="['input-wrap', { error: showError }]">
      <slot :on-blur="childBlur"></slot>
    </div>

    <div :class="['feedback', { error: showError }]">
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
