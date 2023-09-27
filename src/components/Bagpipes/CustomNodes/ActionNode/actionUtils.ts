import { ActionData, SwapAction, ReserveXAction, TransferAction, ActionType }  from './ActionInterface';

export function convertFormStateToActionType(formState: any, assetIn: any, assetOut: any): ActionType | null {
  if (!formState.action) return null;
  
  const actionDataIn: ActionData = {
    chain: assetIn?.chain,
    assetId: assetIn?.asset?.assetId,
    address: assetIn?.address,
    amount: assetIn?.amount
  };
  
  const actionDataOut: ActionData = {
    chain: assetOut?.chain,
    assetId: assetOut?.asset?.assetId,
    address: assetOut?.address,
  };

  switch(formState.action) {
    case 'swap':
      return {
        actionType: 'swap',
        source: actionDataIn,
        target: actionDataOut
      };
    case 'reserveX':
      return {
        actionType: 'reserveX',
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


