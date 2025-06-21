import './assets/styles/main.scss';

import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';

import App from './App.vue';
import Badge from './components/Badge/index.vue';
import SpinnerPlugin from './components/Spinner';
import StyledButton from './components/StyledButton/index.vue';

const app = createApp(App);

// 전역 컴포넌트 등록
app.component('Badge', Badge);
app.component('Icon', Icon);
app.component('StyledButton', StyledButton);

// Spinner 플러그인 등록 (기본 설정 사용)
app.use(SpinnerPlugin);

app.use(createPinia()).use(router);

app.mount('#app');
