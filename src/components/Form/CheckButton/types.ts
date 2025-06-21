import type { OptionItem, RuleFunc } from '../../types';
import type { checkButtonColors, checkButtonType } from './const';

export type CheckButtonColors = (typeof checkButtonColors)[keyof typeof checkButtonColors];

export type CheckButtonType = (typeof checkButtonType)[keyof typeof checkButtonType];

export interface CheckButtonItem extends OptionItem {}

export interface CheckButtonProps {
  items: CheckButtonItem[];
  name: string;
  modelValue?: string | string[];
  type?: CheckButtonType;
  maxLength?: number; // 최대 체크 가능한 수량
  validate?: RuleFunc[];
  errorMessage?: string; // 강제 에러 출력 - check함수를 수행 하지 않음
  button?: boolean; // button UI 변경
  block?: boolean;
  color?: CheckButtonColors;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  lineLimit?: number;

  // 개선 필요.
  all?: boolean; // 전체 버튼 추가
}

export interface CheckButtonModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
