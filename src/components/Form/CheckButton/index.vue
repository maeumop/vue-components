<script setup lang="ts">
  import {
    mdiCheckboxBlank,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiCircle,
    mdiRadioboxBlank,
    mdiRadioboxMarked,
  } from '@/assets/svg/iconPath';
  import { nextTick, ref, watch } from 'vue';
  import type { RuleFunc } from '../../types';
  import { useAddFormValidate } from '../common';
  import { checkButtonColors } from './const';
  import type { CheckButtonItem, CheckButtonProps } from './types';

  const props = withDefaults(defineProps<CheckButtonProps>(), {
    type: 'checkbox',
    all: false,
    maxLength: 0,
    items: (): CheckButtonItem[] => [],
    validate: (): RuleFunc[] => [],
    button: false,
    block: false,
    color: checkButtonColors.primary,
    lineLimit: 0,
  });

  const emit = defineEmits<{
    (event: 'update:after'): void;
    (event: 'update:modelValue', value: string | string[]): void;
    (evemt: 'update:clickIndex', value: number): void;
  }>();

  useAddFormValidate();

  const list = ref<CheckButtonItem[]>([]);
  const val = ref<string | string[]>(props.type === 'radio' ? '' : []);
  const isValidate = ref<boolean>(true);
  const checkPass = ref<boolean>(false);
  const message = ref<string>('');
  const errorTransition = ref<boolean>(false);

  watch(
    () => props.items,
    items => {
      if (items.length) {
        list.value = [...items];
      }
    },
  );

  watch(
    () => props.errorMessage,
    v => {
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
    },
  );

  watch(
    () => props.modelValue,
    v => {
      if (v) {
        val.value = v;
      }

      resetValidate();
    },
  );

  watch(val, () => {
    resetValidate();
  });

  watch(
    () => props.validate,
    () => {
      resetValidate();
    },
  );

  watch(
    () => props.disabled,
    v => v && resetValidate(),
  );

  const updateValue = (): void => {
    emit('update:modelValue', val.value);
    check();

    nextTick(() => {
      emit('update:after');
    });
  };

  const setIndex = (index: number): void => {
    emit('update:clickIndex', index);
    updateValue();
  };

  const checkValue = (index: number, v: string): void => {
    setIndex(index);

    if (props.type === 'checkbox') {
      if (v !== '') {
        if (props.maxLength > 0 && Array.isArray(val.value)) {
          val.value.splice(props.maxLength, 1);
        } else {
          if (val.value.indexOf('') > -1 && Array.isArray(val.value)) {
            val.value.splice(0, 1);
          }
        }
      }
    }
    updateValue();
  };

  /**
   * 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
   *
   * @return { Boolean }
   */
  const check = (silence: boolean = false): boolean => {
    // validate check
    if (!props.disabled) {
      if (!props.errorMessage && props.validate.length) {
        for (let i = 0; i < props.validate.length; i++) {
          const result: string | boolean =
            props.type === 'checkbox'
              ? props.validate[i](Array.from(val.value))
              : props.validate[i](val.value);

          if (typeof result !== 'boolean') {
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

      message.value = '';
      isValidate.value = true;
    }

    return true;
  };

  const resetValidate = (): void => {
    isValidate.value = true;
    if (!props.validate.length) {
      message.value = '';
      errorTransition.value = false;
    }
  };

  const resetForm = (): void => {
    val.value = props.type === 'radio' ? '' : [];
  };

  if (props.items) {
    list.value = [...props.items];
  }

  if (props.all) {
    list.value.unshift({ text: '전체 선택', value: '' });
  }

  if (props.modelValue) {
    val.value = props.modelValue;
  }

  defineExpose({
    check,
    resetForm,
    resetValidate,
  });
</script>

<template>
  <div class="check-button">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
    </div>

    <template v-if="button">
      <div :class="['check-button-group', props.color, { disabled: props.disabled }]">
        <template :key="`keyword${i}`" v-for="({ text, value }, i) in list">
          <input
            type="checkbox"
            :id="`${name}${i}`"
            :name="name"
            :disabled="props.disabled"
            :value="value"
            @change="checkValue(i, value)"
            v-model="val"
          />

          <label :class="{ last: list.length - 1 === i }" :for="`${name}${i}`">
            {{ text }}
          </label>
        </template>
      </div>
    </template>
    <template v-else>
      <template :key="`check-button-${i}`" v-for="({ text, value }, i) in list">
        <div :class="['origin-check-button', { block: props.block }]">
          <label :class="props.color" :for="`${name}${i}`">
            <input
              type="radio"
              :disabled="props.disabled"
              :id="`${name}${i}`"
              :name="name"
              :value="value"
              @change="setIndex(i)"
              v-model="val"
              v-if="type === 'radio'"
            />

            <input
              type="checkbox"
              :id="`${name}${i}`"
              :name="name"
              :disabled="props.disabled"
              :value="value"
              @change="checkValue(i, value)"
              v-model="val"
              v-else
            />

            <template v-if="type === 'radio'">
              <Transition name="check-scale" mode="out-in">
                <SvgIcon type="mdi" :path="mdiRadioboxMarked" v-if="props.modelValue === value" />
                <SvgIcon type="mdi" :path="props.disabled ? mdiCircle : mdiRadioboxBlank" v-else />
              </Transition>
            </template>
            <template v-else>
              <Transition name="check-scale" mode="out-in">
                <SvgIcon
                  type="mdi"
                  :path="mdiCheckboxMarked"
                  v-if="props.modelValue?.includes(value)"
                />
                <SvgIcon
                  type="mdi"
                  :path="props.disabled ? mdiCheckboxBlank : mdiCheckboxBlankOutline"
                  v-else
                />
              </Transition>
            </template>

            {{ text }}
          </label>
        </div>
        <div class="line-break" v-if="(i + 1) % props.lineLimit === 0"></div>
      </template>
    </template>

    <div
      :class="['description', { error: errorTransition }]"
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
  export default { name: 'CheckButton' };
</script>
