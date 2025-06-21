export interface SpinnerModel {
  timeout: (limit: number) => this;
  show: (msg?: string) => void;
  delay: (sec: number) => this;
  hide: () => void;
  close: () => void;
  setTheme: (theme: SpinnerTheme) => this;
  setColors: (colors: SpinnerColors) => this;
}

export interface SpinnerProps {
  limitTime?: number;
  destroy: () => void;
  theme?: SpinnerTheme;
  colors?: SpinnerColors;
}

export interface SpinnerExpose {
  show: (msg: string) => void;
  hide: () => void;
  close: () => void;
  delay: Ref<number>;
  setTheme: (theme: SpinnerTheme) => void;
  setColors: (colors: SpinnerColors) => void;
}

// 색상 테마 타입
export type SpinnerTheme =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// 색상 커스터마이징 타입
export interface SpinnerColors {
  icon?: string;
  text?: string;
  background?: string;
  backdrop?: string;
}

// 플러그인 옵션 타입
export interface SpinnerOptions {
  limitTime?: number;
  theme?: SpinnerTheme;
  colors?: SpinnerColors;
}
