import './assets/styles/main.scss';

import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import Badge from './components/Badge/index.vue';
import router from './router';

const app = createApp(App);

// 전역 컴포넌트 등록
app.component('Badge', Badge);
app.component('Icon', Icon);

app.use(createPinia());
app.use(router);

app.mount('#app');
