import firebase from 'firebase/app';

import actionStates from '../../utils/action-states';

let alreadyCalled = false;

const convertRefs = (object, refs) => {
  const result = { ...object };
  refs.forEach((ref) => {
    result[ref] = { id: object[ref].id };
  });
  return result;
};

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

      db.collection('action-requests')
        .where('state', '<', actionStates.completed) // TODO: query those associated to user account only!
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const callCommit = (type) => commit(type, {
              id: change.doc.id,
              payload: convertRefs(change.doc.data(), ['user', 'device']),
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

    async fire(context, { action, params, deviceId }) {
      const startAction = firebase.functions().httpsCallable('startAction');
      const result = await startAction({ action, params, deviceId });
      if (result.data && result.data.result === 'request-created') {
        return result.data.requestId;
      }
      return null;
    },

    waitForResolution(context, requestId) {
      return new Promise((resolve, reject) => {
        const db = firebase.firestore();
        const unsubscribe = db.collection('action-requests').doc(requestId)
          .onSnapshot((doc) => {
            const data = (doc.data() || {});
            const { state } = data;
            if (state === actionStates.completed) {
              unsubscribe();
              if (data.error) {
                reject(new Error(data.error));
              } else {
                resolve();
              }
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
