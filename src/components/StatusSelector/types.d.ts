export interface StatusSelectorItem {
  text: string;
  value: string;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | string;
}

export interface StatusSelectorProps {
  modelValue: string;
  options: StatusSelectorItem[];
  circle?: boolean;
  readOnly?: boolean;
  bgColor?: string;
}
