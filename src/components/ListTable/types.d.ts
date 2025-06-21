import type { ComponentPublicInstance } from 'vue';

export type ListTableCellAlign = 'left' | 'center' | 'right';
export type ListTableFooterItemTag = 'td' | 'th';

export type ListTableListCheckType = 'checkbox' | 'radio';

export type ListTableListCheckIconKeys = 'disabled' | 'checked' | 'blank';
export type ListTableListCheckIconType = { [K in ListTableListCheckIconKeys]: string };

// 목록 최상단 라벨링 Array:[{text: string, width: string, colspan: number, align: 'left' | 'center' | 'right'}] *
export interface ListTableHeader {
  text: string;
  width?: string;
  align?: ListTableCellAlign;
  colspan?: number;
}

export interface ListTableItem<T = any> {
  [K: string]: T;
}

export interface ListTableFooter {
  colspan?: number;
  align?: ListTableCellAlign;

  tag?: ListTableFooterItemTag;
  text: any;
}

export interface ListTableProps<T> {
  header?: ListTableHeader[];
  footer?: ListTableFooter[];
  emptyText?: string;
  width?: string;
  height?: string;
  observer?: boolean;
  loading?: boolean;

  // TODO : 개선 방안
  items: T[];
  checkMode?: ListTableListCheckType;
  disableFilter?: (item: T, index: number) => boolean;
}

export interface ListTableItemSlot<T = ListTableItem> {
  props: T;
  index: number;
  disabled: boolean;
}

export interface ListTableExpose {
  observerStart: () => void;
  observerStop: () => void;

  checkedToggle: (bool?: boolean) => void;
}

// Template Ref 작업시, 조인해주세요.
export type ListTableModel<T> = ComponentPublicInstance<ListTableProps<T>> & ListTableExpose;

export interface ListTableEmits<T> {
  (event: 'checkedAll', value: boolean): void;
  (event: 'checked', value: boolean, index: number, items: T[]): void;
  (event: 'observe'): void;
}

export interface ListTableListCheckProps {
  modelValue?: boolean;
  value?: string;
  disabled?: boolean;
  type?: ListTableListCheckType;
}
