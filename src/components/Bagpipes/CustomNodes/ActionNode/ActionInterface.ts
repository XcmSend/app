
export interface ActionData {
  target: any;
  source: any;
  actionType: ActionType | null | undefined;
  chain: string;
  display?: string;
  assetId: number;
  address: string; 
  amount?: number; 
  symbol?: string; 
  nodeId?: string;
}

export interface RemarkAction {
  actionType: 'remark';
  source: ActionData;
  target: ActionData;
}

export interface SwapAction {
  actionType: 'swap';
  source: ActionData;
  target: ActionData;
}

export interface xTransferAction {
  actionType: 'xTransfer';
  source: ActionData;
  target: ActionData;
}

export interface TransferAction {
  actionType: 'transfer';
  source: ActionData;
  target: ActionData;
}

export type ActionType = SwapAction | xTransferAction | RemarkAction | TransferAction;
