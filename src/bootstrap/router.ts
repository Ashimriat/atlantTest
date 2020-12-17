import Vue from "vue";
import VueRouter from "vue-router";
import { ROUTES } from "../constants";
import store from "./store";
import transactions from "./store/modules/transactions";
import workDesk from "./store/modules/workDesk";


Vue.use(VueRouter);

const routes = [
  {
    path: `/${ROUTES.WORKDESK.path}`,
    name: ROUTES.WORKDESK.path,
    component: () => {
      // console.log("STORE STATE", store.state, store);
      // store.registerModule('workDesk', workDesk);
      return import(/* webpackChunkName: 'workdesk' */'../components/workDesk/WorkDesk')
    }
  },
  {
    path: `/${ROUTES.TRANSACTIONS.path}`,
    name: ROUTES.TRANSACTIONS.path,
    component: () => {
      // store.registerModule('transactions', transactions, { preserveState: true });
      return import(/* webpackChunkName: 'transactions' */ '../components/transactions/Transactions')
    }
  }
];

export default new VueRouter({ routes });
