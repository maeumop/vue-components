/// <reference types="vite/client" />

// Vue 컴포넌트 타입 선언
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Vite 환경 변수 타입 선언
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 다른 환경 변수들...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
