
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
  votedata?: votedata;
  inkdata?: inkdata;
  stake?: stakedata;
  delegate?: delegatedata;
  extra?: string;
}

interface stakedata {
  pool_id: number;
}

interface delegatedata {
  conviction: string;
  to_address: string;
}

interface votedata {
  refnr: number;
  amount: number; 
  lock: number;
  aye_or_nay: boolean;
}

interface inkdata {
  abi: any;
  address: string;
  output?: any;
}

export interface VoteAction {
  actionType: 'vote';
  source: ActionData;
  target: ActionData;
}

export interface StakeAction {
  actionType: 'stake';
  source: ActionData;
  data: stakedata;
}

export interface DelegateAction {
  actionType: 'delegate';
  source: ActionData;
  target: ActionData;
}
export interface InkAction {
  actionType: 'ink';
  source: ActionData;
  target: ActionData;
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


export type ActionType = SwapAction | InkAction | DelegateAction | StakeAction | VoteAction | xTransferAction | RemarkAction | TransferAction;

