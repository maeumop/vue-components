import type { RuleFunc } from '../../types';

export interface ValidateWrapProps {
  checkValue: any;
  validate?: RuleFunc[];
  errorMessage?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ValidateWrapModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
