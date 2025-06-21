/// <reference types="vite/client" />

// 전역 컴포넌트 타입 선언
declare module 'vue' {
  export function createApp(rootComponent: any): any;
  export function computed<T>(getter: () => T): { readonly value: T };
  export interface GlobalComponents {
    Badge: (typeof import('./components/Badge/index.vue'))['default'];
    Icon: (typeof import('@iconify/vue'))['Icon'];
  }
}
