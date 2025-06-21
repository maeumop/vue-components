import type { OptionItem, RuleFunc } from '../../types';

export interface SelectBoxItem extends OptionItem {
  [K: string]: any;
}

export interface SelectBoxProps {
  modelValue: string | string[];
  options: SelectBoxItem[];
  label?: string;
  inLabel?: boolean;
  placeholder?: string;
  block?: boolean;
  validate?: RuleFunc[];
  errorMessage?: string;
  width?: string;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  isShort?: boolean;
  btnAccept?: boolean;
  labelText?: boolean;
  maxLength?: number;
  searchable?: boolean;
  hideMessage?: boolean;
  blurValidate?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
}

export interface SelectBoxEmits {
  (event: 'update:modelValue', value: any): void;
  (event: 'update:selectedIndex', index: number): void;
  (event: 'blur', value: string | string[]): void;
}

export interface SelectBoxModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
