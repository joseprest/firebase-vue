import firebase from 'firebase/app';
import store from '../store';

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const { displayName, email, uid } = user;
    const cleanedUser = { displayName, email, uid };
    store.dispatch('auth/resolve', cleanedUser);
  } else {
    // if it was resolved before, it means the user got kicked out and we should reload the page!
    store.dispatch('auth/resolve', {});
  }
});
