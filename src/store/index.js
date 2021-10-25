import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import devices from './modules/devices';
import contents from './modules/contents';
import users from './modules/users';
import pendingActions from './modules/pending-actions';
import tags from './modules/tags';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},

  modules: {
    auth,
    devices,
    contents,
    users,
    pendingActions,
    tags,
  },
});
