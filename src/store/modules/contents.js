import firebase from 'firebase/app';

let alreadyCalled = false;

export default {
  namespaced: true,

  state() {
    return [];
  },

  actions: {
    fetch({ commit }) {
      if (alreadyCalled) return;
      alreadyCalled = true;
      const db = firebase.firestore();

      db.collection('contents')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const callCommit = (type) => commit(type, {
              id: change.doc.id,
              payload: change.doc.data(),
            });
            if (change.type === 'added') {
              callCommit('ADD');
            }
            if (change.type === 'modified') {
              callCommit('UPDATE');
            }
            if (change.type === 'removed') {
              callCommit('DELETE');
            }
          });
        });
    },
  },

  mutations: {
    ADD(state, { id, payload }) {
      state.push({ ...payload, id });
    },

    UPDATE(state, { id, payload }) {
      const index = state.findIndex((obj) => obj.id === id);
      if (index >= 0) {
        state.splice(index, 1, {
          ...state[index],
          ...payload,
          id,
        });
      } else {
        throw new Error('Cannot update this');
      }
    },

    DELETE(state, { id }) {
      const index = state.findIndex((obj) => obj.id === id);
      if (index >= 0) {
        state.splice(index, 1);
      } else {
        throw new Error('Cannot delete this');
      }
    },
  },
};
