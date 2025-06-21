import type { KeyIndex, RuleFunc } from '../../types';

import type { Ref } from 'vue';
import type { transitionCase } from './const';

export type TransitionCase = typeof transitionCase[keyof typeof transitionCase];

export interface ToggleButtonType {
  text: string
  checked: boolean
}

export interface TimeoutType extends KeyIndex<number> {}

export interface DateCellType {
  day: number
  type: string
}

export interface DateStateValueType extends KeyIndex<number> {
  year: number
  month: number
}

export interface DateStateType extends KeyIndex<DateStateValueType> {
  start: DateStateValueType
  end: DateStateValueType
}

export interface DateOptionType {
  year: number[]
  month: number[]
}

export interface SelectedDateType extends KeyIndex<string> {
  start: string
  end: string
}

export interface DatePickerModel {
  check(silence?: boolean): void
  resetForm(): void
  resetValidate(): void
}

export interface Calendar {
  resetSelected(): void
  makeCalendar(): void
}

export interface DatePickerStore {
  startDate: Ref<string>
  endDate: Ref<string>
  curYear: Ref<number>
  curMonth: Ref<number>
  curDay: Ref<number>
  dateState: DateStateType
  beforeState: DateStateType
  selectedDate: SelectedDateType
  setStartDate(v: string): void
  setEndDate(v: string): void
  setDateState(main: string, sub: string, v: number): void
  setSelected(flag: string, v: string): void
  init(): void
}

export interface DatePickerHelper {
  getLayerPosition(input: HTMLDivElement, isRange?: boolean): any
  getDateFormat(d: Date, format: string, days?: number): string
  getDateString(year: number, month: number, day: number, s: string): string
  getBeforeDay(year: number, month: number, week: number): number
}


export interface DatePickerProps {
  modelValue: string[] | string
  validate?: RuleFunc[]
  label?: string
  placeholder?: string[] | string
  range?: boolean
  separator?: string
  minYear?: number
  maxYear?: number
  block?: boolean
  required?: boolean
  hideMessage?: boolean
  maxRange?: number
  readonly?: boolean
  disabled?: boolean
  blurValidate?: boolean
  defaultDate?: boolean
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: string[] | string): void
  (event: 'update:set', value: string[] | string): void
  (event: 'blur'): void
}