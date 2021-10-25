import firebase from 'firebase/app';
import _ from 'lodash';

export default {
  namespaced: true,

  state() {
    return [];
  },

  getters: {
    current(state, getters, rootState) {
      return state.all.find((u) => u.uid === rootState.auth.uid);
    },

    currentHasRoles(state, getters) {
      return (arrayOrString) => {
        let roles;
        if (_.isString(arrayOrString)) roles = [arrayOrString];
        else roles = arrayOrString;
        const { current } = getters;
        if (!current) return false;
        return roles.some((role) => current.roles.includes(role));
      };
    },
  },

  actions: {
    async fetchCurrent({ commit, rootState }) {
      const db = firebase.firestore();

      const { uid } = rootState.auth.user;
      if (!uid) return;
      const docRef = db.collection('users').doc(uid);

      const doc = await docRef.get();
      if (doc.exists) {
        commit('UPDATE_USER', { uid, user: doc.data() });
      }
    },
  },

  mutations: {
    UPDATE_USER(state, { uid, user }) {
      const index = state.findIndex((u) => u.uid === uid);
      if (index === -1) {
        state.push({ ...user, uid });
        return;
      }

      const updatedUser = {
        ...state[index],
        ...user,
        uid,
      };
      state.splice(index, 1, updatedUser);
    },
  },
};
