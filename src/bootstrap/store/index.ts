import Vue from "vue";
import Vuex from "vuex";
import transactions from "./modules/transactions";
import workDesk from "./modules/workDesk";


Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    transactions,
    workDesk
  }
});
