import firebase from 'firebase/app';
import _ from 'lodash';

export default {
  namespaced: true,

  state() {
    return [];
  },

  actions: {
    async attachTags({ state }, { tags, deviceIds }) {
      const update = firebase.functions().httpsCallable('update');
      return Promise.all(deviceIds.map((deviceId) => {
        const device = state.devices.find((d) => d.id === deviceId);
        const currentTags = device.tags || [];
        const updatedTags = _.unionBy(tags, currentTags, 'id');
        return update({
          collection: 'devices',
          payload: { tags: updatedTags },
          id: deviceId,
        });
      }));
    },

    async detachTags({ state }, { tagIds, deviceIds }) {
      const update = firebase.functions().httpsCallable('update');
      return Promise.all(deviceIds.map((deviceId) => {
        const device = state.devices.find((d) => d.id === deviceId);
        const currentTags = device.tags || [];
        const updatedTags = currentTags.filter(tag => !tagIds.includes(tag.id));
        return update({
          collection: 'devices',
          payload: { tags: updatedTags },
          id: deviceId,
        });
      }));
    },

    async fetch({ commit }, { filter, sort }) {
      commit('CLEAR');

      const limit = 10;
      const db = firebase.firestore();
      let query = db.collection('devices');

      if (filter.state !== null && filter.state !== 'all') {
        query = query.where('shadow.online', '==', filter.state === 'online');
      }

      if (filter.txt !== null && filter.txt !== '') {
        query = query.where('name', '>=', filter.txt);
      }

      if (sort.field !== null) {
        const sortable = {
          name: 'name',
          location: 'location',
          temperature: 'shadow.temperature',
          lastSeen: 'lastSeen',
        };

        query = query.orderBy(sortable[sort.field], sort.order);
      }

      query.limit(limit).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const device = change.doc.data();
          const match = true;
          // if (filter.txt !== null && filter.txt !== '') {
          //   const regex = new RegExp(filter.txt, 'i');
          //   const n = _.get(device, 'name', '');
          //   const l = _.get(device, 'location', '');

          //   const reducedTags = (device.tags || []).map((deviceTag) => {
          //     if (!deviceTag.id) return null;

          //     const tag = rootState.tags.find(t => t.id === deviceTag.id);

          //     if (!tag) return null;

          //     if (tag.isAssociative) {
          //       const choice = tag.possibleValues[deviceTag.choiceIndex];

          //       return `${tag.main}: ${choice}`;
          //     }

          //     return tag.main;
          //   }).filter(x => !!x).join(', ');

          //   if (!n.match(regex) && !l.match(regex) && !reducedTags.match(regex)) {
          //     match = false;
          //   }
          // }

          if (match) {
            const callCommit = (type) => commit(type, {
              id: change.doc.id,
              payload: device,
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

    CLEAR(state) {
      state.splice(0, state.length);
    },
  },
};
