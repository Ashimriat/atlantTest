import { Commit, Dispatch } from "vuex";
import { ACTIONS, MUTATIONS } from "../actionsMutations";
import { ITransactionFullData } from "../../../interfaces";


const {
  INIT_SOCKET, CHECK_SOCKET, CONNECT_TO_SOCKET, DISCONNECT_FROM_SOCKET,
} = ACTIONS.TRANSACTIONS;
const {
  MARK_SOCKET_INITIALIZED, SET_SOCKET_ERROR, UPDATE_LIST,
  RESET_LIST, CREATE_SOCKET, TOGGLE_CONNECT_STATUS
} = MUTATIONS.TRANSACTIONS;

const TRANSACTIONS_API_SOCKET = 'wss://ws.blockchain.info/inv';
const MESSAGE_OBJS = {
  ping: { op: 'ping' },
  subscribe: { op: 'unconfirmed_sub' },
  unsubscribe: { op: 'unconfirmed_unsub' }
};
const SUCCESS_PING_ANSWER = 'pong';

interface ITransactionData {
  from: string;
  to: string;
  amount: number;
}

export interface ITransactionsState {
  socket: null | WebSocket;
  isSocketInitialized: boolean;
  isSocketActive: boolean;
  error: string;
  transactionsData: ITransactionData[]
}

interface IActionContext {
  state: ITransactionsState;
  commit: Commit;
  dispatch: Dispatch;
}

export default {
  namespaced: true,
  state: (): ITransactionsState => ({
    socket: null,
    isSocketInitialized: false,
    isSocketActive: false,
    error: '',
    transactionsData: []
  }),
  mutations: {
    [CREATE_SOCKET](state: ITransactionsState) {
      state.socket = new WebSocket(TRANSACTIONS_API_SOCKET);
    },
    [MARK_SOCKET_INITIALIZED](state: ITransactionsState) {
      state.isSocketInitialized = true;
      state.error = '';
    },
    [TOGGLE_CONNECT_STATUS](state: ITransactionsState) {
      state.isSocketActive = !state.isSocketActive;
    },
    [UPDATE_LIST](state: ITransactionsState, value: ITransactionFullData) {
      console.log(value);
      state.transactionsData.push({ from: 'asdasdasd', to: 'dasasdasas', amount: 600 });
    },
    [RESET_LIST](state: ITransactionsState) {
      state.transactionsData = [];
    },
    [SET_SOCKET_ERROR](state: ITransactionsState, error: string) {
      state.error = error;
    },
  },
  actions: {
    async [INIT_SOCKET]({ state, commit, dispatch }: IActionContext): Promise<void> {
      if (!state.isSocketInitialized || (state.socket as WebSocket).readyState !== 3) {
        try {
          if (!state.isSocketInitialized) commit(CREATE_SOCKET);
          await dispatch(CHECK_SOCKET);
          commit(MARK_SOCKET_INITIALIZED);
          (state.socket as WebSocket).addEventListener('message', ({ data }: { data: string }) => {
            if (state.isSocketActive) commit(UPDATE_LIST, JSON.parse(data))
          });
          dispatch(CONNECT_TO_SOCKET);
        } catch (e) {
          commit(SET_SOCKET_ERROR, e);
        }
      } else {
        dispatch(CONNECT_TO_SOCKET);
      }
    },
    [CHECK_SOCKET]({ state, commit }: IActionContext): Promise<unknown> {
      const socket = state.socket as WebSocket;
      return Promise.race([
        new Promise<void>(async (resolve, reject) => {
          const pingCheckHandler = (e: { data: string }) => {
            const data = JSON.parse(e.data);
            socket.removeEventListener('message', pingCheckHandler);
            if (data.op === SUCCESS_PING_ANSWER) {
              commit(MARK_SOCKET_INITIALIZED);
              resolve();
            } else {
              reject('Неожиданный ответ от сервера');
            }
          };
          socket.addEventListener('message', pingCheckHandler);
          await new Promise<void>(resolve => {
            let timerId;
            (function tracker() {
              clearTimeout(timerId);
              if (socket.readyState === WebSocket.CONNECTING) {
                timerId = setTimeout(() => {
                  tracker();
                }, 500);
              } else {
                resolve();
              }
            })();
          });
          socket.send(JSON.stringify(MESSAGE_OBJS.ping));
        }),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject('Сокет не ответил за заданный промежуток времени')
          }, 10000);
        })
      ])
    },
    [CONNECT_TO_SOCKET]({ state: { socket }, commit }: IActionContext): void {
      (socket as WebSocket).send(JSON.stringify(MESSAGE_OBJS.subscribe));
      commit(TOGGLE_CONNECT_STATUS);
    },
    [DISCONNECT_FROM_SOCKET]({  state: { socket }, commit }: IActionContext): void {
      (socket as WebSocket).send(JSON.stringify(MESSAGE_OBJS.unsubscribe));
      commit(TOGGLE_CONNECT_STATUS);
    }
  },
  getters: {
    transactionsTotalAmount({ transactionsData }: ITransactionsState): number {
      return transactionsData.reduce((acc, { amount }) => {
        acc += amount;
        return acc;
      }, 0);
    }
  }
}
