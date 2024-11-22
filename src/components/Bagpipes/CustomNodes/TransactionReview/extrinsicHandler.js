import { delegate_polkadot, stake_to_dot_pool, schedule_task, dotToHydraDx, polkadot_vote, moon2polkadot,  generic_system_remark, moon2parachain, moon2hydra2, hydra2moonbeam, interlay2moonbeam, polkadot2moonbeam, assethub2moonbeam, turing2moonriver, moonriver2turing, mangata2turing, polkadot_assethub_to_assetHub_kusama, turing2mangata, generic_kusama_to_parachain, assethub2ethereum, assethub_to_hydra, hydradx_to_polkadot, hydradx_to_assethub, roc2assethub, polkadot_to_assethub, interlay2assethub, assethub2interlay, assethub_to_polkadot } from "../../../../Chains/DraftTx/DraftxTransferTx";
import { getTokenDecimalsByAssetName, get_moonbeam_asset_decimals, getTokenDecimalsByChainName, get_hydradx_asset_symbol_decimals } from "../../../../Chains/Helpers/AssetHelper";
import toast from "react-hot-toast";
import { isEthereumAddress } from '@polkadot/util-crypto';

import { hydradx_omnipool_sell } from "../../../../Chains/DraftTx/DraftSwapTx";
import { listChains } from "../../../../Chains/ChainsInfo";
import { account } from "@polkadot/api-derive/balances";
import { evm } from "@polkadot/types/interfaces/definitions";


export async function extrinsicHandler(actionType, formData) {
    console.log(`extrinsicHandler:`, actionType, formData);
    switch(actionType) {
        case 'xTransfer':
            console.log("Inside extrinsicHandler for xTransfer formData:", formData);
            return handlexTransfer(formData);
        case 'swap':
            console.log("Inside extrinsicHandler for swap");
            return await handleSwap(formData);
        case 'ScheduleTransfer':
            console.log(`schedule transfer`);
            return await handleScheduleTransfer(formData);
        case 'stake':
            console.log(`stake handling`);
            return handleStake(formData);
        case 'delegate':
            console.log(`delegate handling`);
            return handleDelegate(formData);                    
        case 'vote':
            console.log(`vote handling`);
            return handleVote(formData);
        case 'remark':
            console.log(`handling remark`);
            return handleRemark(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};


async function handleScheduleTransfer(formdata) {
    const source = formdata.source;
    const target = formdata.target;

    console.log(`[handleScheduleTransfer] formdata:`, formdata);
    if (!source.chain == "turing") {
        throw new Error("You can only schedule xcm transfers from Turing");
    }

    const tokenDecimals = getTokenDecimalsByChainName(source.chain);

    // Adjust the source amount according to the token decimals
    const submittableAmount = source.amount * (10 ** tokenDecimals);

      // Define a map for each xTransfer action
      const ScheduleTransferActions = {
       
        'turing:moonriver': () => {
             if (!isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Only allowed to send to ethereum addresses when sending to moonriver");
            };
            return turing2moonriver(target.address, submittableAmount);
        },

        'turing:mangatax': () => {
            return  turing2mangata(submittableAmount, target.address) ;
        }
    };

    const action = ScheduleTransferActions[`${source.chain}:${target.chain}`];
    console.log(`action is: `, action);

    if (action) {
        console.log(`action got!`);
        const datumstring = formdata.extra + ':00Z'; // example input: 2024-10-22T16:20
        console.log(`schedule_task with datumstring: `, datumstring);
       const tx  = await action();
        return schedule_task(tx, datumstring);
    } else {
        console.log("Unsupported ScheduleTransfer direction.");
        toast("Action data is empty. Did you fetch?");
        
        throw new Error("Unsupported ScheduleTransfer direction.");
    }

}

function handleStake(formdata) {
    console.log(`handlestake: `, formdata);
    const source = formdata.source;
    if (!source.chain == "polkadot") {
        throw new Error("Staking only support on Polkadot");
    }
    const tokenDecimals = getTokenDecimalsByChainName(source.chain);
    const stake = formdata.stake;
    const pool_id = stake.pool_id;
    const amount = source.amount * (10 ** tokenDecimals);
    return stake_to_dot_pool(amount, pool_id);
}

function handleDelegate(formdata) {
    const source = formdata.source;
    if (!source.chain == "polkadot") {
        throw new Error("Delegate Voting only support on Polkadot");
    }
    const delegate = formdata.delegate;
    const tokenDecimals = getTokenDecimalsByChainName(source.chain);
    const conviction = delegate.conviction; // string number
    const dest = delegate.to_address;
 
    const amount = source.amount * (10 ** tokenDecimals);
    return delegate_polkadot(dest, amount, conviction);
}

function handleVote(formData) {
//    console.log(`handleVote input: `, formData);
    const source = formData.source;
    if (!source.chain == "polkadot") {
        throw new Error("Voting only support on Polkadot");
    }
    const tokenDecimals = getTokenDecimalsByChainName(source.chain);
    const votedata = formData.votedata;
    const lock = votedata.lock;
    const refnr = votedata.refnr;
    const aye_or_nay = votedata.aye_or_nay;
    const amount = Number(source.amount) * (10 ** tokenDecimals);
    return polkadot_vote(amount, lock, refnr, aye_or_nay);
}


function handleRemark(formData) {
    const source = formData.source;
    const msg = formData.extra;
    const chain = source.chain;
       if (!msg) {
        throw new Error("Set remark message");
    }
    console.log(`source: `, source);
    console.log(`handle Remark form data:`, formData);
    return generic_system_remark(chain, msg);
   
   // throw new Error("You can only swap from hydradx to hydradx");
}


function handlexTransfer(formData) {
    console.log("handlexTransfer Handling xTransfer...");
    const chains = listChains();
    const source = formData.source;
    const target = formData.target;
    const delay = formData.source.delay;

    // check if the asset is native or on-chain asset. 
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
            if(delay) {
                const numberValue = Number(delay);
                if (numberValue >= 1){
                    return dotToHydraDx(submittableAmount, target.address, numberValue);
                };
            };
            console.log("handlexTransfer for Polkadot to HydraDx...");
            return dotToHydraDx(submittableAmount, target.address);
        },
        'hydraDx:assetHub': () => {
            console.log("handlexTransfer for HydraDx to AssetHub...");

            return hydradx_to_assethub(source.amount, target.assetId, source.assetId, target.address);
        },
///hydra2moonbeam, interlay2moonbeam, polkadot2moonbeam, assethubassethub2moonbeam
        'polkadot:moonbeam': () => {
            if (!isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Invalid address, select your evm account");
            };
            return polkadot2moonbeam(submittableAmount, target.address);
        },


        'assetHub:ethereum': () => {

            if (source.assetId != "100"){
                throw new Error("only WETH with assetid 100 is supported");
            }
            if (!isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Invalid address, select your evm account");
            };
            console.log(`ethereum source.assetId: `, source.assetId);
            return assethub2ethereum(target.address, submittableAmount)
        },



        'moonbeam:polkadot': () => {
            // todo check dot address
            console.log(`moonbeam2polkadot!!`);
            if (source.assetId != "42259,045,809,535,163,221,576,417,993,425,387,648"){
                toast("You can only send DOT to the Polkadot relay chain");
                
                throw new Error("Wrong asset");
            };
            if (isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Invalid address, select a polkadot address not evm");
            };
            console.log(`source:`, source);
            console.log(`source amount:`, source.amount);
            const correct_dot_amount = source.amount * (10**10);
            return moon2polkadot(target.address, correct_dot_amount);
        },
        'moonbeam:assetHub': () => {
            console.log(`moon2assethub`);
            const mdecimals = get_moonbeam_asset_decimals(source.assetId);
            const correct_amount = source.amount * (10 ** mdecimals);
          
            return moon2parachain(source.assetId, correct_amount, target.address, 1000);
        },

        'moonbeam:hydraDx': () => {
            console.log(`assetid`, source.assetId);
            const mdecimals = get_moonbeam_asset_decimals(source.assetId);
            const correct_amount = source.amount * (10 ** mdecimals);
            console.log(`moon2hydra decimals:`, mdecimals);
            console.log(`moon2hydra correct_amount:`, correct_amount);
            return moon2hydra2(source.assetId, correct_amount, target.address);
         
//            return moon2hydra(target.address, correct_amount);
        },
        'moonbeam:interlay': () => {
            const mdecimals = get_moonbeam_asset_decimals(source.assetId);
            const correct_amount = source.amount * (10 ** mdecimals);
            
            return moon2parachain(source.assetId, correct_amount, target.address, 2032);

        },


        'interlay:moonbeam': () => {
            return interlay2moonbeam(source.amount, source.assetId, target.address);
        },
        'hydraDx:moonbeam': () => {
            return hydra2moonbeam(target.address, source.assetId, source.amount);
        },
        'assetHub:moonbeam': () => {
            return assethub2moonbeam(source.amount, source.assetId, target.address);
        },

        'polkadot:assetHub': () => {
            if(delay) {
                const numberValue = Number(delay);
                if (numberValue >= 1){
                    return polkadot_to_assethub(submittableAmount, target.address, numberValue);
                };
            };
            console.log("handlexTransfer for Polkadot to AssetHub...");
            return polkadot_to_assethub(submittableAmount, target.address);
        }, 
        'assetHub:polkadot': () => {
            console.log("handlexTransfer for AssetHub to Polkadot...");
            return assethub_to_polkadot(submittableAmount, target.address);
        },
        'hydraDx:polkadot': () => {
            console.log("handlexTransfer for HydraDx to Polkadot...");
            const paraid = 0;
            const hamount = source.amount * (10 ** 10); // DOT asset on hydra has 10 decimals
            return hydradx_to_polkadot(hamount, target.address);
            //return hydraDxToParachain(submittableAmount, source.assetId, target.chain, paraid);
        },

        'assetHub:interlay': () => {
            const tetherAmount = submittableAmount / 1000;
            console.log("handlexTransfer forAssetHub to Interlay...", tetherAmount);
            return assethub2interlay(source.assetId, tetherAmount, target.address);
        },
/**/
        'moonriver:turing': () => {
        //    if not address is evm, break 
        //    {moonbeam_address_eth_warn && <p>invalid address</p>}
                return moonriver2turing(target.address, submittableAmount/100000000);
        },

       
        'turing:moonriver': () => {
             if (!isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Only allowed to send to ethereum addresses when sending to moonriver");
            };
            return turing2moonriver(target.address, submittableAmount);
        },

        'assetHub:assetHub_kusama': () => {
            console.log(`Polkadot assethub to kusama assethub`);
            console.log(`input: `, submittableAmount, target.address);
           return polkadot_assethub_to_assetHub_kusama(submittableAmount, target.address);
        },


        'turing:mangatax': () => {
            return  turing2mangata(submittableAmount, target.address) ;
        },

        /* mangata has some weird signing ... not working atm
        'mangatax:turing': () => {
            return mangata2turing(submittableAmount, target.address, source.assetId);
        },
*/
/*  
not ready yet      
    

        'kusama:turing': () => {
            return generic_kusama_to_parachain(2114, submittableAmount, target.address);
        },
  */     
            // not supported
                // 'interlay:assethub': () => {
                //     return interlay2assethub(source.assetId, submittableAmount, target.address);
                //    },

        // ROC transfer, todo add transfer logo
        'rococo:rococo_assethub': () => {
            console.log(`rococo to rococo assethub transfer`);
            const amount = submittableAmount;
            const dest = target.address;
            return roc2assethub(amount, dest);
        },

        'assetHub:hydraDx': () => {
            console.log("handlexTransfer forAssetHub to HydraDx...");
            const paraid = 2034;
            return assethub_to_hydra(source.assetId, submittableAmount, target.address);
        }
    };

    const action = reserverTransferActions[`${source.chain}:${target.chain}`];

    if (action) {
        console.log(`action got!`);
        return action();
    } else {
        console.log("Unsupported xTransfer direction.");
        toast("Action data is empty. Did you fetch?");
        
        throw new Error("Unsupported xTransfer direction.");
    }
}


 
async function handleSwap(formData) {
    const source = formData.source;
    const target = formData.target;
    console.log(`handle swap form data:`, formData);
      // Retrieve token decimals for the source chain
    //   const tokenDecimals = getTokenDecimalsByChainName(source.chain);
      const tokenDecimals =  await getTokenDecimalsByAssetName(source.assetId);
console.log(`tokenDecimals: `, tokenDecimals);
           // Adjust the source amount according to the token decimals
      const submittableAmount = source.amount * (10 ** tokenDecimals);
        const assetin = source.assetId;
        const assetout = target.assetId;
        const amount = submittableAmount;
        //const minBuyAmount = set as recieve amount ;
      /// assetin = asset you have on your account
/// assetout = asset you want to swap to
/// amount = amount of assetin you want to swap to assetout
/// minBuyAmount = minimum amount to buy, note: tx will fail if this is set to 0 or to low
      // TODO: handle swaps
    if (source.chain === 'hydraDx' && target.chain === 'hydraDx') {

        
        return hydradx_omnipool_sell(assetin, assetout, source.amount, submittableAmount);  //hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number)
       //  true;
    }
    throw new Error("You can only swap from hydradx to hydradx");
}
