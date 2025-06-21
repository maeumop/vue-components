import { COLORS, POSITIONS, type ColorType, type PositionType } from '../constants';

// Badge 컴포넌트에서 사용할 색상 (공통 색상 상속)
export const badgeColors: Record<string, ColorType> = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  info: COLORS.info,
  light: COLORS.light,
  dark: COLORS.dark,
} as const;

// Badge 컴포넌트에서 사용할 위치 (공통 위치 상속)
export const badgePosition: Record<string, PositionType> = {
  right: POSITIONS.right,
  left: POSITIONS.left,
  bottomLeft: POSITIONS.bottomLeft,
  bottomRight: POSITIONS.bottomRight,
} as const;

// Badge 컴포넌트 특화 상수
export const BADGE_CONFIG = {
  defaultSize: 'default',
  largeSize: 'large',
  defaultIconSize: 16,
  largeIconSize: 20,
  borderRadius: {
    default: '0.8rem',
    large: '1.1rem',
  },
  dimensions: {
    default: {
      width: '1.6rem',
      height: '1.6rem',
    },
    large: {
      width: '2.2rem',
      height: '2.2rem',
    },
  },
} as const;
