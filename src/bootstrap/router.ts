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
    component: async () => {
      const { default: workdeskStoreModule } = await import(
        /* webpackChunkName: 'workdesk'*/
        './store/modules/workdesk'
      );
      store.registerModule(['workDesk'], workdeskStoreModule);
      return import(
        /* webpackChunkName: 'workdesk' */
        '../components/workDesk/WorkDesk'
      );
    }
  },
  {
    path: `/${ROUTES.TRANSACTIONS.path}`,
    name: ROUTES.TRANSACTIONS.path,
    component: async () => {
      const { default: transactionsStoreModule } = await import(
        /* webpackChunkName: 'transactions'*/
        './store/modules/transactions'
      );
      store.registerModule(['transactions'], transactionsStoreModule);
      return import(
        /* webpackChunkName: 'transactions' */
        '../components/transactions/Transactions'
      );
    }
  }
];

export default new VueRouter({ routes });
