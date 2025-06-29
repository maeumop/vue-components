import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/components.vue'),
    },
    {
      path: '/components/badge',
      name: 'badge',
      component: () => import('../components/Badge/ex.vue'),
    },
    {
      path: '/components/buttons',
      name: 'buttons',
      component: () => import('../components/StyledButton/ex.vue'),
    },
    {
      path: '/components/dropmenu',
      name: 'dropmenu',
      component: () => import('../components/DropMenu/ex.vue'),
    },
    {
      path: '/components/spinner',
      name: 'spinner',
      component: () => import('../components/Spinner/ex.vue'),
    },
    {
      path: '/components/tooltip',
      name: 'tooltip',
      component: () => import('../components/Tooltip/ex.vue'),
    },
    {
      path: '/components/messagebox',
      name: 'messagebox',
      component: () => import('../components/MessageBox/ex.vue'),
    },
    {
      path: '/components/toast',
      name: 'toast',
      component: () => import('../components/Toast/ex.vue'),
    },
    {
      path: '/components/tabs',
      name: 'tabs',
      component: () => import('../components/Tabs/ex.vue'),
    },
    {
      path: '/components/statusselector',
      name: 'statusselector',
      component: () => import('../components/StatusSelector/ex.vue'),
    },
    {
      path: '/components/listtable',
      name: 'listtable',
      component: () => import('../components/ListTable/ex.vue'),
    },
    {
      path: '/components/pagination',
      name: 'pagination',
      component: () => import('../components/Pagination/ex.vue'),
    },
    {
      path: '/components/modal',
      name: 'modal',
      component: () => import('../components/Modal/ex.vue'),
    },
    {
      path: '/components/checkbutton',
      name: 'checkbutton',
      component: () => import('../components/Form/CheckButton/ex.vue'),
    },
    {
      path: '/components/switchbutton',
      name: 'switchbutton',
      component: () => import('../components/Form/SwitchButton/ex.vue'),
    },
    {
      path: '/components/textfield',
      name: 'textfield',
      component: () => import('../components/Form/TextField/ex.vue'),
    },
    {
      path: '/components/numberformat',
      name: 'numberformat',
      component: () => import('../components/Form/NumberFormat/ex.vue'),
    },
  ],
});

export default router;
