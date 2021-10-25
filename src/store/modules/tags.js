import firebase from 'firebase/app';

let alreadyCalled = false;

export default {
  namespaced: true,

  state() {
    return [];
  },

  actions: {
    async create(context, { tag }) {
      const db = firebase.firestore();
      const docRef = await db.collection('tags').add(tag);
      return docRef.id;
    },

    async update(context, { id, value }) {
      const db = firebase.firestore();
      const ref = db.collection('tags').doc(id);
      return ref.update(value);
    },

    fetch({ commit }) {
      if (alreadyCalled) return;
      alreadyCalled = true;
      const db = firebase.firestore();

      db.collection('tags')
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
