import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import router from './router';
import store from './store';
import './bootstraps';

import './assets/app.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import 'buefy/dist/buefy.css';

Vue.use(Buefy, {
  defaultProgrammaticPromise: true,
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
