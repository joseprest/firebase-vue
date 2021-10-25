import Vue from 'vue';
import Router from 'vue-router';

import nonProtectedRoutes from './nonProtectedRoutes';
import protectedRoute from './protectedRoute';

Vue.use(Router);

const hydrateRoutes = routes => routes.map((route) => {
  if (route.children) {
    return {
      ...route,
      children: hydrateRoutes(route.children),
      meta: { requiresAuth: true },
    };
  }
  return { ...route, meta: { requiresAuth: true } };
});

const routesThatRequireAuth = hydrateRoutes([protectedRoute]);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'is-active',
  scrollBehavior(/* to, from, savedPosition */) {
    return { x: 0, y: 0 };
  },
  routes: [
    ...nonProtectedRoutes,
    ...routesThatRequireAuth,
  ],
});

export default router;
