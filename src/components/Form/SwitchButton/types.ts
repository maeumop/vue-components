import type { switchButtonColors } from './const';

export type SwitchButtonColors = (typeof switchButtonColors)[keyof typeof switchButtonColors];

export interface SwitchButtonProps {
  modelValue: string | boolean;
  small?: boolean;
  label?: string[]; // [0 => false label, 1 => true label]
  validate?: string | boolean;
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  placeholder?: string;
  readonly?: boolean;
  checkbox?: boolean;
  color?: SwitchButtonColors;
  disabled?: boolean;
}

export interface SwitchButtonModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
