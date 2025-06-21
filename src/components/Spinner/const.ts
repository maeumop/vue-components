import type { SpinnerTheme } from './types';

// 색상 테마 클래스 정의 (assets 색상 테마 클래스 사용)
export const SPINNER_THEME_CLASSES: Record<SpinnerTheme, string> = {
  default: 'spinner-theme-default',
  primary: 'spinner-theme-primary',
  secondary: 'spinner-theme-secondary',
  success: 'spinner-theme-success',
  warning: 'spinner-theme-warning',
  error: 'spinner-theme-error',
  info: 'spinner-theme-info',
};

// 기본 설정
export const DEFAULT_SPINNER_OPTIONS = {
  limitTime: 10,
  theme: 'default' as SpinnerTheme,
};

// CSS 변수 이름 (참조용)
export const SPINNER_CSS_VARS = {
  ICON_COLOR: '--spinner-icon-color',
  TEXT_COLOR: '--spinner-text-color',
  BACKGROUND_COLOR: '--spinner-background-color',
  BACKDROP_COLOR: '--spinner-backdrop-color',
} as const;
