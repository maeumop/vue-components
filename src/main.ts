import './assets/styles/main.scss';

import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';

import App from './App.vue';
import Badge from './components/Badge/index.vue';
import ListTable from './components/ListTable/index.vue';
import MessageBox from './components/MessageBox';
import Pagination from './components/Pagination/index.vue';
import SpinnerPlugin from './components/Spinner';
import StyledButton from './components/StyledButton/index.vue';
import Tabs from './components/Tabs/index.vue';
import Toast from './components/Toast';
import Tooltip from './components/Tooltip/index.vue';

const app = createApp(App);
const store = createPinia();

// 전역 컴포넌트 등록
app.component('Icon', Icon);
app.component('Badge', Badge);
app.component('StyledButton', StyledButton);
app.component('Tabs', Tabs);
app.component('Tooltip', Tooltip);
app.component('ListTable', ListTable);
app.component('Pagination', Pagination);

// 플러그인 등록
app.use(SpinnerPlugin);
app.use(MessageBox);
app.use(Toast);
app.use(store);
app.use(router);

app.mount('#app');
