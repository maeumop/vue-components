//================================================================================
// 공통 상수 사용 예시
//================================================================================

import {
  COLORS,
  POSITIONS,
  SIZES,
  STATES,
  createClassName,
  getColorVariable,
  isValidColor,
} from './index';

//================================================================================
// 1. 색상 상수 사용 예시
//================================================================================

// ✅ 올바른 사용법
const primaryButton = {
  color: COLORS.primary,
  backgroundColor: COLORS.success,
  borderColor: COLORS.warning,
};

// ✅ 타입 안전성 확인
const validateColor = (color: string) => {
  if (isValidColor(color)) {
    console.log(`${color}는 유효한 색상입니다.`);
    return true;
  }
  console.error(`${color}는 유효하지 않은 색상입니다.`);
  return false;
};

// ✅ CSS 변수 생성
const cssVariables = {
  primaryBg: getColorVariable(COLORS.primary, 'bg'),
  successText: getColorVariable(COLORS.success, 'text'),
  dangerBorder: getColorVariable(COLORS.danger, 'border'),
};

//================================================================================
// 2. 클래스명 생성 예시
//================================================================================

// ✅ 기본 클래스명
const buttonClass = createClassName('btn'); // "btn"

// ✅ 단일 수정자
const primaryButtonClass = createClassName('btn', { primary: true }); // "btn btn--primary"

// ✅ 값이 있는 수정자
const largeButtonClass = createClassName('btn', { size: 'large' }); // "btn btn--size-large"

// ✅ 복합 수정자
const complexButtonClass = createClassName('btn', {
  primary: true,
  size: 'large',
  disabled: true,
  variant: 'outline',
}); // "btn btn--primary btn--size-large btn--disabled btn--variant-outline"

//================================================================================
// 3. 컴포넌트별 상수 상속 예시
//================================================================================

// Badge 컴포넌트 예시
export const BADGE_EXAMPLE = {
  // 공통 색상 상속
  colors: {
    primary: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
  },

  // 공통 위치 상속
  positions: {
    topRight: POSITIONS.topRight,
    bottomLeft: POSITIONS.bottomLeft,
  },

  // 컴포넌트 특화 설정
  config: {
    defaultSize: 'default',
    largeSize: 'large',
    iconSize: 16,
  },
} as const;

// Button 컴포넌트 예시
export const BUTTON_EXAMPLE = {
  // 공통 색상 상속
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    danger: COLORS.danger,
  },

  // 공통 크기 상속
  sizes: {
    small: SIZES.sm,
    medium: SIZES.md,
    large: SIZES.lg,
  },

  // 공통 상태 상속
  states: {
    default: STATES.default,
    loading: STATES.loading,
    disabled: STATES.disabled,
  },

  // 컴포넌트 특화 설정
  config: {
    borderRadius: '0.375rem',
    transition: '0.2s ease',
  },
} as const;

//================================================================================
// 4. 유틸리티 함수 조합 예시
//================================================================================

// ✅ 동적 클래스명 생성
export const createDynamicClass = (
  baseClass: string,
  color?: string,
  size?: string,
  state?: string,
) => {
  const modifiers: Record<string, string | boolean> = {};

  if (color && isValidColor(color)) {
    modifiers[color] = true;
  }

  if (size) {
    modifiers.size = size;
  }

  if (state) {
    modifiers[state] = true;
  }

  return createClassName(baseClass, modifiers);
};

// ✅ 사용 예시
const dynamicButtonClass = createDynamicClass('btn', COLORS.primary, SIZES.lg, STATES.loading);
// 결과: "btn btn--primary btn--size-lg btn--loading"

//================================================================================
// 5. 타입 안전성 예시
//================================================================================

// ✅ 타입 가드 함수
export const isComponentColor = (value: unknown): value is (typeof COLORS)[keyof typeof COLORS] => {
  return typeof value === 'string' && Object.values(COLORS).includes(value as any);
};

// ✅ 타입 안전한 객체 생성
export const createColorConfig = <T extends Record<string, (typeof COLORS)[keyof typeof COLORS]>>(
  config: T,
): T => {
  // 모든 값이 유효한 색상인지 확인
  Object.values(config).forEach(color => {
    if (!isValidColor(color)) {
      throw new Error(`Invalid color: ${color}`);
    }
  });

  return config;
};

// ✅ 사용 예시
const safeColorConfig = createColorConfig({
  primary: COLORS.primary,
  accent: COLORS.success,
  error: COLORS.danger,
});
