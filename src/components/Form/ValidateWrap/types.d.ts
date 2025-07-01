import type { RuleFunc } from '../../types';

export interface ValidateWrapProps {
  checkValue: unknown;
  validate?: RuleFunc[];
  errorMessage?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ValidateWrapModel {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}

export interface ValidateWrapEmits {
  (event: 'update:checkValue'): void;
}
