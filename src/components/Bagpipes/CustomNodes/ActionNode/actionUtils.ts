import { ActionData, SwapAction, xTransferAction, TransferAction, ActionType }  from './ActionInterface';

export function convertFormStateToActionType(formState: any, assetIn: any, assetOut: any): ActionType | null {
  console.log(`convertFormStateToActionType: `, formState);
  if (!formState.action) return null;
  
  const actionDataIn: ActionData = {
    chain: assetIn?.chain,
    display: assetIn?.display,
    assetId: assetIn?.asset?.assetId,
    address: assetIn?.address,
    amount: assetIn?.amount,
    symbol: assetIn?.asset?.symbol,
    target: assetIn?.target,
    source: assetIn?.source,
    votedata: assetIn?.votedata,
    stake: assetIn?.stake,
    delegate: assetIn?.delegate,
    actionType: assetIn?.actionType
  };
  
  const actionDataOut: ActionData = {
    chain: assetOut?.chain,
    assetId: assetOut?.asset?.assetId,
    address: assetOut?.address,
    symbol: assetOut?.asset?.symbol,
    display: assetOut?.display,
    target: assetOut?.target,
    source: assetOut?.source,
    actionType: assetOut?.actionType
  };



  switch(formState.action) {
    case 'swap':
      return {
        actionType: 'swap',
        source: actionDataIn,
        target: actionDataOut
      };
    case 'xTransfer':
      return {
        actionType: 'xTransfer',
        source: actionDataIn,
        target: actionDataOut
      };
      case 'ink':
        return {
          actionType: 'ink',
          source: actionDataIn,
          target: actionDataOut
        };

    case 'delegate': 
      return {
        actionType: 'delegate',
        source: actionDataIn,
        target: actionDataOut
    };
    case 'stake':
      return {
        actionType: 'stake',
        source: actionDataIn,
        data: { pool_id: 0},
      }
    case 'vote':
        return {
          actionType: 'vote',
          source: actionDataIn,
          target: actionDataOut,  
        }
    case 'Remark': 
      return {
        actionType: "remark",
        source: actionDataIn,
        target: actionDataOut
      };
    case 'transfer':
      return {
        actionType: 'transfer',
        source: actionDataIn,
        target: actionDataOut
      };
    default:
      return null;
  }
}


