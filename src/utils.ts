import { ITransactionData, ITransactionFullData } from "./interfaces/iTransactions";

export const isInRange = (val: number, fromVal: number, toVal: number, mode: string = 'easy'): boolean => {
  if (mode === 'easy') {
    return val >= fromVal && val <= toVal;
  } else {
    return val > fromVal && val < toVal;
  }
};
const generateUid = (): string => (
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
);
const generateNum = (): number => {
  let res = '';
  do {
    res += Math.round(Math.random() * 9);
  } while (res.length < 6);
  return +res / 1000000;
};
export const processTransactionData = (transactionData: ITransactionFullData): ITransactionData => {
  // Здесь должна быть реализация обработки данных по транзакции
  return {
    from: generateUid(),
    to: generateUid(),
    amount: generateNum()
  };
};
