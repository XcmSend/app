import { dotToHydraDx, hydraDxToParachain, assethub_to_parachain, dotToParachain } from "../../../../Chains/DraftTx/DraftxTransferTx";
import { getTokenDecimalsByChainName } from "../../../../Chains/Helpers/AssetHelper";
import toast from "react-hot-toast";

// import { hydradx_omnipool_sell } from "../../../Chains/DraftTx/DraftSwapTx";
import { listChains } from "../../../../Chains/ChainsInfo";

export async function extrinsicHandler(actionType, formData) {
    
    switch(actionType) {
        case 'xTransfer':
            console.log("Inside extrinsicHandler for xTransfer formData:", formData);
            return handlexTransfer(formData);
        case 'swap':
            console.log("Inside extrinsicHandler for swap");
            return handleSwap(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};


function handlexTransfer(formData) {
    console.log("handlexTransfer Handling xTransfer...");
    const chains = listChains();
    const source = formData.source;
    const target = formData.target;

    // Retrieve token decimals for the source chain
    const tokenDecimals = getTokenDecimalsByChainName(source.chain);

    // Adjust the source amount according to the token decimals
    const submittableAmount = source.amount * (10 ** tokenDecimals);

    console.log(`handlexTransfer Source chain: ${source.chain}`);
    console.log(`handlexTransfer Target chain: ${target.chain}`);
    console.log(`handlexTransfer Source amount: ${source.amount}`);
    console.log(`handlexTransfer Target address: ${target.address}`);

    // Define a map for each xTransfer action
    const reserverTransferActions = {
        'polkadot:hydraDx': () => {
            console.log("handlexTransfer for Polkadot to HydraDx...");
            return dotToHydraDx(submittableAmount, target.address);
        },
        'hydradx:assetHub': () => {
            console.log("handlexTransfer for HydraDx to AssetHub...");
            const paraid = chains.find(chain => chain.name === 'assetHub').paraid;
            return hydraDxToParachain(submittableAmount, source.assetId, target.chain, paraid);
        },
        'polkadot:assetHub': () => {
            console.log("handlexTransfer for Polkadot to AssetHub...");
            // const paraid = chains.find(chain => chain.name === 'assethub').paraid;
            return dotToParachain(submittableAmount, target.address);
        },
        'hydradx:polkadot': () => {
            console.log("handlexTransfer for HydraDx to Polkadot...");
            const paraid = chains.find(chain => chain.name === 'polkadot').paraid;
            return hydraDxToParachain(submittableAmount, source.assetId, target.chain, paraid);
        },

        'assethub:polkadot': () => {
            console.log("handlexTransfer for AssetHub to Polkadot...");
            const paraid = chains.find(chain => chain.name === 'polkadot').paraid;
            return assethub_to_parachain(formData.assetId.toString(), submittableAmount, target.chain, paraid);
        },
        'assethub:hydradx': () => {
            console.log("handlexTransfer forAssetHub to HydraDx...");
            const paraid = chains.find(chain => chain.name === 'hydraDx').paraid;
            return assethub_to_parachain(formData.assetId.toString(), submittableAmount, target.chain, paraid);
        }
    };

    const action = reserverTransferActions[`${source.chain}:${target.chain}`];

    if (action) {
        return action();
    } else {
        toast("Action data is empty. Did you fetch?")
        // console.error("Unsupported xTransfer direction.");
        // throw new Error("Unsupported xTransfer direction.");
    }
}


 
function handleSwap(formData) {
    const source = formData.source;
    const target = formData.target;

      // Retrieve token decimals for the source chain
      const tokenDecimals = getTokenDecimalsByChainName(source.chain);

      // Adjust the source amount according to the token decimals
      const submittableAmount = source.amount * (10 ** tokenDecimals);


      // TODO: handle swaps
    if (source.chain === 'hydraDx' && target.chain === 'hydraDx') {
        // hydradx_omnipool_sell hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number)
        return true;
    }
    throw new Error("You can only swap from hydradx to hydradx");
}
