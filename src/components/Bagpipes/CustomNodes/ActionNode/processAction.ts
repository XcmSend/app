import { ActionType } from "./ActionInterface";

export function processAction(action: ActionType) {
    switch (action.actionType) {
      case 'swap':
        // Here, TypeScript knows that "action" has the shape of "SwapAction"
        break;
      case 'reserveX':
        // Here, TypeScript knows that "action" has the shape of "ReserveXAction"
        break;
      case 'transfer':
        // Here, TypeScript knows that "action" has the shape of "TransferAction"
        break;
    }
  }
  