<script setup lang="ts">
import { mdiCheckboxBlank, mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@/assets/svg/iconPath';
import { nextTick, ref, watch } from 'vue';
import { useAddFormValidate } from '../common';
import { switchButtonColors } from './const';
import type { SwitchButtonProps } from './types';

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | boolean): void
  (event: 'update:after'): void
}>();

const props = withDefaults(defineProps<SwitchButtonProps>(), {
  label: (): string[] => ['미설정', '설정'],
  validate: false,
  trueValue: true,
  falseValue: false,
  color: switchButtonColors.primary,
});

useAddFormValidate();

let onError = ref<boolean>(false);
let errorTransition = ref<boolean>(false);
let message = ref<string>('');
let isValidate = ref<boolean>(true);

watch(() => props.modelValue, () => {
  resetForm();
});

watch(errorTransition, (v) => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false;
    }, 300);
  }
});

const check = (silence: boolean = false): boolean => {
  // validate check
  if (props.validate) {
    if (props.modelValue === props.trueValue) {
      resetForm();
      return true;
    } else {
      if (!silence) {
        message.value = (typeof props.validate === 'string')
          ? props.validate
          : `${props.label[1]}을(를) 선택해주세요.`;
        onError.value = true;
        isValidate.value = false;
        errorTransition.value = true;
      }

      return false;
    }
  }

  return true;
};

const resetForm = (): void => {
  resetValidate();
};

const resetValidate = (): void => {
  message.value = '';
  onError.value = false;
  isValidate.value = true;
  errorTransition.value = false;
};

const updateValue = (evt: Event): void => {
  const e = evt.target as HTMLInputElement;

  if (!props.readonly) {
    emit('update:modelValue', e.checked ? props.trueValue : props.falseValue);

    nextTick(() => {
      emit('update:after');
    });
  } else {
    // 상태가 변경 되지 않도록 처리
    e.checked = !e.checked;
  }
};

defineExpose({
  resetValidate,
  check,
  resetForm
});
</script>

<template>
  <div :class="['switch-wrap', props.color]">
    <label :class="['switch', { small, checkbox: props.checkbox }]">
      <input
        type="checkbox"
        :disabled="props.disabled || props.readonly"
        :checked="props.modelValue == props.trueValue"
        @change="updateValue"
      />

      <template v-if="props.checkbox">
        <Transition name="check-scale" mode="out-in">
          <SvgIcon type="mdi" :path="mdiCheckboxMarked" v-if="props.modelValue == props.trueValue" />
          <SvgIcon type="mdi" :path="props.disabled ? mdiCheckboxBlank : mdiCheckboxBlankOutline" v-else />
        </Transition>
      </template>
      <template v-else>
        <span><i></i></span>
      </template>

      <Transition name="label-fade" mode="out-in">
        <div class="label-text" v-if="props.modelValue === props.trueValue">{{ props.label[1] }}</div>
        <div class="label-text" v-else>{{ props.label[0] }}</div>
      </Transition>
    </label>

    <div
      :class="['description', { error: errorTransition }]"
      @animationend="errorTransition = false"
      v-show="message"
    >
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './style';
</style>
<script lang="ts">
export default { name: 'SwitchButton' };
</script>