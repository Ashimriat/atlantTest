interface IOperationData {
  spent: boolean;
  tx_index: number;
  type: number;
  addr: string;
  value: number;
  n: number;
  script: string;
}

export interface ITransactionFullData {
  op: string;
  x: {
    lock_time: number;
    ver: number;
    size: number;
    inputs: Array<{
      sequence: number;
      prev_out: IOperationData;
      script: string;
    }>;
    time: number;
    tx_index: number;
    vin_sz: number;
    hash: string;
    vout_sz: number;
    relayed_by: string;
    out: IOperationData[]
  }
}

export type ITransactionPanelOperations = 'connect' | 'disconnect' | 'reset';

