// Badge 컴포넌트에서 사용할 색상 (공통 색상 상속)
export const badgeColor: Record<string, string> = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  light: 'light',
  dark: 'dark',
} as const;

// Badge 컴포넌트에서 사용할 위치 (공통 위치 상속)
export const badgePosition: Record<string, string> = {
  right: 'right',
  left: 'left',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
} as const;

// Badge 컴포넌트 특화 상수
export const badgeConfig = {
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
