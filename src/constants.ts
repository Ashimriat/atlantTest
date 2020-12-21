export const ROUTES = {
  WORKDESK: {
    path: 'workDesk',
    name: 'Рабочий стол',
  },
  TRANSACTIONS: {
    path: 'transactions',
    name: 'Транзакции'
  }
};
export const TRANSACTIONS_API_SOCKET = 'wss://ws.blockchain.info/inv';
export const MESSAGE_OBJS = {
  ping: { op: 'ping' },
  subscribe: { op: 'unconfirmed_sub' },
  unsubscribe: { op: 'unconfirmed_unsub' }
};
export const SUCCESS_PING_ANSWER = 'pong';


