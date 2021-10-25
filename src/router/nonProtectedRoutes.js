/*
 * Defines the routes that do not need a connected user.
 */

import Login from '@/components/login/Index.vue';
import store from '@/store/index';

export default [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      store.dispatch('auth/logOut').then(() => {
        next('/login');
      });
    },
  },
];
