import type { RuleFunc } from '../../types';

export interface NumberFormatProps {
  modelValue: number | string
  label?: string
  placeholder?: string
  validate?: RuleFunc[]
  errorMessage?: string
  disabled?: boolean
  block?: boolean
  width?: string
  autofocus?: boolean
  maxLength?: string | number
  readonly?: boolean
  required?: boolean
  hideMessage?: boolean
}


export interface NumberFormatModel {
  check(silence?: boolean): void
  resetForm(): void
  resetValidate(): void
}

export interface NumberFormatEmits {
  (event: 'update:modelValue', value: number): void
}
