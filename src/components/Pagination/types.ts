export interface PaginationItem {
  num: number;
  isOn: boolean;
}

export interface PaginationProps {
  modelValue: number;
  size?: number; // 한 페이지 당 데이터 수량
  block?: number; // 표시 할 페이지 번호 개수
  total?: number; // 데이터의 총 수량
}

export type PaginationEmits = {
  'update:modelValue': [value: number];
};
