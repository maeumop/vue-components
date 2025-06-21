//================================================================================
// 공통 색상 상수
//================================================================================
export const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  light: 'light',
  dark: 'dark',
} as const;

export type ColorType = (typeof COLORS)[keyof typeof COLORS];

//================================================================================
// 공통 크기 상수
//================================================================================
export const SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

export type SizeType = (typeof SIZES)[keyof typeof SIZES];

//================================================================================
// 공통 위치 상수
//================================================================================
export const POSITIONS = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  topLeft: 'top-left',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
  center: 'center',
} as const;

export type PositionType = (typeof POSITIONS)[keyof typeof POSITIONS];

//================================================================================
// 공통 상태 상수
//================================================================================
export const STATES = {
  default: 'default',
  loading: 'loading',
  disabled: 'disabled',
  error: 'error',
  success: 'success',
} as const;

export type StateType = (typeof STATES)[keyof typeof STATES];

//================================================================================
// 공통 방향 상수
//================================================================================
export const DIRECTIONS = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type DirectionType = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

//================================================================================
// 공통 정렬 상수
//================================================================================
export const ALIGNMENTS = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

export type AlignmentType = (typeof ALIGNMENTS)[keyof typeof ALIGNMENTS];

//================================================================================
// 유틸리티 함수
//================================================================================

/**
 * 색상이 유효한지 확인하는 함수
 */
export const isValidColor = (color: string): color is ColorType => {
  return Object.values(COLORS).includes(color as ColorType);
};

/**
 * 크기가 유효한지 확인하는 함수
 */
export const isValidSize = (size: string): size is SizeType => {
  return Object.values(SIZES).includes(size as SizeType);
};

/**
 * 위치가 유효한지 확인하는 함수
 */
export const isValidPosition = (position: string): position is PositionType => {
  return Object.values(POSITIONS).includes(position as PositionType);
};

/**
 * 상태가 유효한지 확인하는 함수
 */
export const isValidState = (state: string): state is StateType => {
  return Object.values(STATES).includes(state as StateType);
};

/**
 * CSS 클래스명을 생성하는 함수
 */
export const createClassName = (
  baseClass: string,
  modifiers: Record<string, string | boolean> = {},
): string => {
  const classes = [baseClass];

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value === true) {
      classes.push(`${baseClass}--${key}`);
    } else if (value) {
      classes.push(`${baseClass}--${key}-${value}`);
    }
  });

  return classes.join(' ');
};

/**
 * 색상별 CSS 변수명을 생성하는 함수
 */
export const getColorVariable = (
  color: ColorType,
  variant: 'bg' | 'text' | 'border' = 'bg',
): string => {
  return `--color-${variant}-${color}`;
};

/**
 * 크기별 CSS 변수명을 생성하는 함수
 */
export const getSizeVariable = (size: SizeType, property: string): string => {
  return `--size-${property}-${size}`;
};
