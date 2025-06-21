<script setup lang="ts">
import { mdiCloseCircle } from '@/assets/svg/iconPath';
import type { StyleValue } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { useAddFormValidate } from '../common';
import type { TextFieldEmits, TextFieldProps } from './types';


const emit = defineEmits<TextFieldEmits>();

const props = withDefaults(defineProps<TextFieldProps>(), {
  rows: 5,
  type: 'text',
  validate: (): RuleFunc[] => [],
  blurValidate: true,
  errorMessage: '',
  maxLength: 0,
});

useAddFormValidate();

let isValidate = ref<boolean>(true);
let checkPass = ref<boolean>(false);
let message = ref<string>('');
let errorTransition = ref<boolean>(false);

const Textarea = ref<HTMLTextAreaElement>();
const Input = ref<HTMLInputElement>();

watch(() => props.errorMessage, (v) => {
  // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
  if (v) {
    message.value = v;
    isValidate.value = false;
    checkPass.value = false;
    errorTransition.value = true;
  } else {
    message.value = '';
    isValidate.value = true;
    checkPass.value = true;
    errorTransition.value = false;
  }
});

watch(() => props.validate, () => {
  resetValidate();
});

watch(() => props.modelValue, (v) => v && resetValidate());

watch(() => props.disabled, (v) => v && resetValidate());


/** 
 * 
 * @deprecated successful style,변수 감시용도 아닌 그냥 존재하여 삭제 예정.
*/
// const successful = computed<boolean>(() => isValidate.value && checkPass.value);

/** 
 * 
 * @deprecated [error|success] style,변수 감시용도 아닌 그냥 존재하여 삭제 예정.
*/
const wrapperStyle = computed<StyleValue>(() => [ 
  'input-wrap', 
  {
  // error: !isValidate.value,
  // success: successful,
    block: props.block
  }
]);

const inputStyleClass = computed<StyleValue>(() => [
  {
    'error': message.value,
    'left-space': props.icon && props.iconLeft,
    'right-space': props.icon && !props.iconLeft,
  }
]);

const updateValue = (evt: Event): void => {
  const target = evt.target as HTMLInputElement;

  // textarea maxlength 기능이 없기 때문에 코드로 구현
  if (props.isCounting && props.maxLength) {
    if (target.value.length > props.maxLength) {
      const cut = target.value.substring(0, props.maxLength);
      target.value = cut;
    }
  }
  emit('update:modelValue', target.value);
};

const clearValue = (): void => {
  emit('update:modelValue', '');
};

const clearButtonShow = computed<boolean>(
  () => props.clearable && props.modelValue !== '' && !props.disabled && !props.readonly
);

/**
 * blur 이벤트 핸들러에서 check() 함수의 반환값이 true 일경우에만 trim추가 처리 진행
 * disabled 일때에는 이벤트 발생하지 않기에 정의 하지 않습니다.
 * @author hjs0818
 * @returns
 */
const updateTrimValue = (evt: Event): void => {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement;

  const result: string = target.value.trim();
  if (result.length > 0) {
    emit('update:modelValue', result);
  }
};

const check = (silence?: boolean): boolean => {
  if (props.disabled) {
    return true;
  }

  // 임의로 지정된 에러가 없는 경우
  if (props.errorMessage === '') {

    // trim 되지 않은 value 값
    const checkValue: string = (props.multiline ? Textarea.value?.value : Input.value?.value) || '';

    // pattern check
    if (Array.isArray(props.pattern)) {
      const [ regExp, errMsg ] = props.pattern;

      if (regExp) {
        if (regExp.test(checkValue)) {
          message.value = '';
        } else {
          if (!silence) {
            message.value = errMsg ? errMsg : '형식이 일치 하지 않습니다.';
            isValidate.value = false;
            checkPass.value = false;
            errorTransition.value = true;
          }

          return false;
        }
      }
    }

    // validate check
    if (props.validate.length) {
      for (let i: number = 0; i < props.validate.length; i++) {
        let result: string | boolean = props.validate[i](checkValue);

        if (typeof result === 'string') {
          if (!silence) {
            message.value = result;
            isValidate.value = false;
            checkPass.value = false;
            errorTransition.value = true;
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

  errorTransition.value = true;

  return false;
};

const resetForm = (): void => {
  emit('update:modelValue', '');
};

const resetValidate = (): void => {
  isValidate.value = true;
  if (!props.errorMessage) {
    message.value = '';
    errorTransition.value = false;
  }
};

const feedback = ref<HTMLDivElement>();

onMounted(() => {
  if (props.autofocus) {
    if (props.multiline) {
      Textarea.value!.focus();
    } else {
      Input.value!.focus();
    }
  }
});

defineExpose({
  check,
  resetForm,
  resetValidate
});
</script>

<template>
  <div
    ref="TextField"
    :class="wrapperStyle"
    :style="{ width: props.width }"
  >

    <div class="options-wrap" v-if="props.label || (props.isCounting && props.maxLength)">
      <!-- label -->
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
   
      <div class="counting" v-if="props.isCounting && props.maxLength">
        {{ modelValue.length }} / {{ props.maxLength }}
      </div>
    </div>

    <textarea
      ref="Textarea"
      :class="{ 'error': message }"
      :style="[{ height: props.height }]"
      :rows="props.rows"
      :placeholder="props.placeholder"
      :value="props.disabled ? '' : props.modelValue"
      :readonly="props.readonly"
      :disabled="disabled"
      @blur="[emit('blur', $event), props.blurValidate && (check() && updateTrimValue($event))]"
      @input="updateValue"
      v-if="multiline"
    >
    </textarea>

    <div class="with-slot" v-else>
      <div class="input-relative">
        <input
          ref="Input"
          :type="props.type"
          :class="inputStyleClass"
          :style="[{ width: props.width }]"
          :placeholder="props.placeholder"
          :value="props.disabled ? '' : props.modelValue"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :maxlength="props.maxLength > 0 ? props.maxLength : ''"
          :autocomplete="props.type === 'password'? 'on' : 'off'"
          @blur="[emit('blur', $event), props.blurValidate && (check() && updateTrimValue($event))]"
          @input="updateValue"
        />

        <a
          href="#"
          :class="['btn-clear', (props.icon && !props.iconLeft) && 'with-icon']"
          @click.prevent="clearValue"
          v-if="clearButtonShow"
        >
          <SvgIcon
            type="mdi"
            size="2.0rem"
            :path="mdiCloseCircle"
          />
        </a>
      </div>
      <template v-if="props.icon">
        <a href="#" @click.prevent="props.iconAction" v-if="typeof props.iconAction === 'function'">
          <SvgIcon
            type="mdi"
            size="2.4rem"
            :class="{ left: props.iconLeft }"
            :path="props.icon"
          />
        </a>
        <SvgIcon
          type="mdi"
          size="2.4rem"
          :class="{ left: props.iconLeft }"
          :path="props.icon"
          v-else
        />
      </template>
      <slot></slot>
    </div>

    <div
      ref="feedback"
      :class="['feedback', { error: errorTransition }]"
      @animationend="errorTransition = false"
      v-show="message && !props.hideMessage"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './style';

</style>
<script lang="ts">
export default { name: 'TextField' };
</script>