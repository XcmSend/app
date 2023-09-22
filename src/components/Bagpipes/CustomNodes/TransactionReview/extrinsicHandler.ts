import { dotToHydraDx, hydraDxToParachain, assethub_to_parachain, dotToParachain } from "../../../Chains/DraftTx/DraftTeleportTx";
import { hydradx_omnipool_sell } from "../../../Chains/DraftTx/DraftSwapTx";
import { listChains } from "../../../Chains/ChainsInfo";

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


/// todo, take the balance times decimals
function handleTeleport(formData: any) {


    const my_chains = listChains();
// polkadot to hydradx and assethub
    if (formData.source === 'polkadot' && formData.target === 'hydraDx') {
        return dotToHydraDx(formData.amount, formData.address);

    } else if (formData.source === 'polkadot' && formData.target === 'assethub') {
        const amount = formData.amount;
        const address = "not set";
        const paraid =  Object.values(my_chains).find(chain => chain.name === 'assethub').paraid;
        ; // get from chain info
        return dotToParachain(amount, address, paraid);
    }

// hydradx to chain(polkadot/assethub)
    else if (formData.source === 'hydradx' && formData.target === 'polkadot') {
        const amount = formData.amount;
        const assetid = formData.assetId;
        const destAccount = "not set";
        const paraid = Object.values(my_chains).find(chain => chain.name === 'polkadot').paraid;
        return hydraDxToParachain(amount, assetid, destAccount, paraid);
    }
    else if (formData.source === 'hydradx' && formData.target === 'assethub') {
        const amount = formData.amount;
        const assetid = formData.assetId;
        const destAccount = "not set";
        const paraid =  Object.values(my_chains).find(chain => chain.name === 'assethub').paraid;
        return hydraDxToParachain(amount, assetid, destAccount, paraid);
    }

// assethub to hydradx and polkadot
    else if (formData.source === 'assethub' && formData.target === 'polkadot') {
        const assetid = formData.assetId.toString(); // assume its a nr
        const amount = formData.amount;
        const accountid = "not set";
        const paraid = Object.values(my_chains).find(chain => chain.name === 'polkadot').paraid;
        return assethub_to_parachain(assetid, amount, accountid, paraid);
    }
    else if (formData.source === 'assethub' && formData.target === 'hydradx') {
        const assetid = formData.assetId.toString(); // assume its a nr
        const amount = formData.amount;
        const accountid = "not set";
        const paraid =  Object.values(my_chains).find(chain => chain.name === 'hydraDx').paraid;
        return assethub_to_parachain(assetid, amount, accountid, paraid);
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
