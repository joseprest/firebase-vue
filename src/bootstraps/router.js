import firebase from 'firebase/app';
import store from '../store';
import router from '../router/index';

const authResolve = () => new Promise((resolve) => {
  if (store.state.auth.resolved) return resolve();
  const unwatch = store.watch((state) => state.auth.resolved, () => {
    unwatch();
    resolve();
  });
  return null;
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    await authResolve();
    const isAuthenticated = firebase.auth().currentUser;
    if (!isAuthenticated) return next({ name: 'Login' });
  }
  return next();
});
