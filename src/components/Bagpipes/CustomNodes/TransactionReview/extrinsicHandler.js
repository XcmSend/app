import { dotToHydraDx, hydraDxToParachain, assethub_to_parachain, dotToParachain } from "../../../Chains/DraftTx/DraftReserveXTx";
// import { hydradx_omnipool_sell } from "../../../Chains/DraftTx/DraftSwapTx";
import { listChains } from "../../../Chains/ChainsInfo";

export async function extrinsicHandler(actionType, formData) {
    
    switch(actionType) {
        case 'reserveX':
            console.log("Inside extrinsicHandler for reserveX");
            return handleReserveX(formData);
        case 'swap':
            console.log("Inside extrinsicHandler for swap");
            return handleSwap(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};


function handleReserveX(formData) {
    console.log("Handling reserveX...");
    const chains = listChains();
    const source = formData.source;
    const target = formData.target;

    console.log(`Source chain: ${source.chain}`);
    console.log(`Target chain: ${target.chain}`);
    console.log(`Source amount: ${source.amount}`);
    console.log(`Target address: ${target.address}`);

    // Define a map for each reserveX action
    const reserverTransferActions = {
        'polkadot:hydraDx': () => {
            console.log("handleReserveX for Polkadot to HydraDx...");
            return dotToHydraDx(source.amount, target.address);
        },
        'hydradx:assethub': () => {
            console.log("handleReserveX for HydraDx to AssetHub...");
            const paraid = chains.find(chain => chain.name === 'assethub').paraid;
            return hydraDxToParachain(source.amount, source.assetId, "not set", paraid);
        },
        'polkadot:assethub': () => {
            console.log("handleReserveX for Polkadot to AssetHub...");
            const paraid = chains.find(chain => chain.name === 'assethub').paraid;
            return dotToParachain(source.amount, target.address, paraid);
        },
        'hydradx:polkadot': () => {
            console.log("handleReserveX for HydraDx to Polkadot...");
            const paraid = chains.find(chain => chain.name === 'polkadot').paraid;
            return hydraDxToParachain(source.amount, source.assetId, "not set", paraid);
        },

        'assethub:polkadot': () => {
            console.log("handleReserveX for AssetHub to Polkadot...");
            const paraid = chains.find(chain => chain.name === 'polkadot').paraid;
            return assethub_to_parachain(formData.assetId.toString(), source.amount, "not set", paraid);
        },
        'assethub:hydradx': () => {
            console.log("handleReserveX forAssetHub to HydraDx...");
            const paraid = chains.find(chain => chain.name === 'hydraDx').paraid;
            return assethub_to_parachain(formData.assetId.toString(), source.amount, "not set", paraid);
        }
    };

    const action = reserverTransferActions[`${source.chain}:${target.chain}`];

    if (action) {
        return action();
    } else {
        console.error("Unsupported reserveX direction.");
        throw new Error("Unsupported reserveX direction.");
    }
}


 
function handleSwap(formData) {
    const source = formData.source;
    const target = formData.target;
    if (source.chain === 'hydraDx' && target.chain === 'hydraDx') {
        // hydradx_omnipool_sell hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number)
        return true;
    }
    throw new Error("You can only swap from hydradx to hydradx");
}
