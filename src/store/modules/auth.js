import firebase from 'firebase/app';

export default {
  namespaced: true,

  state() {
    return {
      resolved: false,
      user: {},
    };
  },

  getters: {
    user: (state) => state.user,
    loggedIn: (state) => 'uid' in state.user,
  },

  actions: {
    logIn(context, payload) {
      return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
    },

    logOut() {
      return firebase.auth().signOut();
    },

    async resolve({ commit, dispatch }, user) {
      commit('setUser', user);
      return dispatch('users/fetchCurrent', null, { root: true });
    },
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
      state.resolved = true;
    },
  },
};
