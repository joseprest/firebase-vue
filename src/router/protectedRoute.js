/*
 * Defines the routes that need a connected user.
 */

import Screens from '@/components/screens/Index.vue';
import Users from '@/components/users/Index.vue';
import Contents from '@/components/contents/Index.vue';
import AppRestrictedArea from '../AppRestrictedArea.vue';

export default {
  path: '/',
  component: AppRestrictedArea,
  meta: { requiresAuth: true },
  children: [
    {
      path: '/screens',
      name: 'Screens',
      component: Screens,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true },
    },
    {
      path: '/contents',
      name: 'Contents',
      component: Contents,
      meta: { requiresAuth: true },
    },
    {
      path: '/', /* default route */
      redirect: 'screens',
    },
  ],
};
