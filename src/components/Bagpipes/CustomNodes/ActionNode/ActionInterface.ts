
export interface ActionData {
  chain: string;
  assetId: number;
  address: string; 
  amount?: number; 
}

export interface SwapAction {
  actionType: 'swap';
  source: ActionData;
  target: ActionData;
}

export interface TeleportAction {
  actionType: 'teleport';
  source: ActionData;
  target: ActionData;
}

export interface TransferAction {
  actionType: 'transfer';
  source: ActionData;
  target: ActionData;
}

export type ActionType = SwapAction | TeleportAction | TransferAction;
