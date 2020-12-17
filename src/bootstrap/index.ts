import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import App from "../components/App";
import store from "./store";

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
