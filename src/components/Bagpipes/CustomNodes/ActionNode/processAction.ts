export function processAction(action: ActionType) {
    switch (action.actionType) {
      case 'swap':
        // Here, TypeScript knows that "action" has the shape of "SwapAction"
        break;
      case 'teleport':
        // Here, TypeScript knows that "action" has the shape of "TeleportAction"
        break;
      case 'transfer':
        // Here, TypeScript knows that "action" has the shape of "TransferAction"
        break;
    }
  }
  