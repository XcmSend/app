import { dotToHydraDx, hydraDxToParachain } from "../../../Chains/DraftTx/DraftTeleportTx";
import { hydradx_omnipool_sell } from "../../../Chains/DraftTx/DraftSwapTx";

export async function extrinsicHandler(actionType: any, formData: any) {
    
    switch(actionType) {
        case 'teleport':
            return handleTeleport(formData);
        case 'swap':
            return handleSwap(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};

function handleTeleport(formData: any) {
// polkadot to hydradx and assethub
    if (formData.source === 'polkadot' && formData.target === 'hydraDx') {
        return dotToHydraDx(formData.amount, formData.address);

    } else if (formData.source === 'polkadot' && formData.target === 'assethub') {
        return true;
    }

// hydradx to chain(polkadot/assethub)
    else if (formData.source === 'hydradx' && formData.target === 'polkadot') {
        return true;
    }
    else if (formData.source === 'hydradx' && formData.target === 'assethub') {
        return hydraDxToParachain(amount, assetidm destAccount, paraid);
    }

// assethub to hydradx and polkadot
    else if (formData.source === 'assethub' && formData.target === 'polkadot') {
        return true;
    }
    else if (formData.source === 'assethub' && formData.target === 'hydradx') {
        return true;
    }

    throw new Error("Unsupported teleport direction.");
}
 
function handleSwap(formData: any) {
    if (formData.source === 'hydraDx' && formData.target === 'hydraDx') {
        // hydradx_omnipool_sell hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number)
        return true;
    }
    throw new Error("You can only swap from hydradx to hydradx");
}
