import './assets/styles/main.scss';

import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';

import App from './App.vue';
import Badge from './components/Badge/index.vue';
import MessageBox from './components/MessageBox';
import SpinnerPlugin from './components/Spinner';
import StyledButton from './components/StyledButton/index.vue';
import Toast from './components/Toast';

const app = createApp(App);

// 전역 컴포넌트 등록
app.component('Badge', Badge);
app.component('Icon', Icon);
app.component('StyledButton', StyledButton);

// 플러그인 등록
app.use(SpinnerPlugin);
app.use(MessageBox);
app.use(Toast);

app.use(createPinia()).use(router);

app.mount('#app');
