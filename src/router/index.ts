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
  ],
});

export default router;
