import type { toastColorCase, toastIconCase } from './const';

export type ToastColorCase = (typeof toastColorCase)[keyof typeof toastColorCase];

export type ToastIconCase = (typeof toastIconCase)[keyof typeof toastIconCase];

export interface ToastOptions {
  maxShowMessage?: number;
  delay?: number;
  destroy: () => void;
}

export interface MessageOptions {
  message: string;
  icon?: ToastIconCase;
  color?: ToastColorCase;
}

export interface ToastModel {
  (params: string | MessageOptions): void;
}

export interface ToastListType {
  key: number;
  color: ToastColorCase;
  icon: ToastIconCase;
  message: string;
}

export interface ToastExpose {
  show(): void;
  setMessage(message: string, color?: ToastColorCase, icon?: ToastIconCase): void;
  hide(index?: number): void;
  clear(): void;
}

// Vue 전역 속성 타입 확장
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToastModel;
  }
}
