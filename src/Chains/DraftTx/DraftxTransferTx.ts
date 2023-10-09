
import { decodeAddress } from '@polkadot/util-crypto';
import endpoints from "../api/WsEndpoints";
import { ChainInfo, listChains } from "../ChainsInfo";
import connectToWsEndpoint from "../api/connect";
import { CHAIN_METADATA } from "../api/metadata";
import toast, { Toaster } from 'react-hot-toast';
import { ApiPromise } from '@polkadot/api';


function getRawAddress(ss58Address: string): Uint8Array {
    try {
        return decodeAddress(ss58Address);
    } catch (e) {
        throw new Error("Invalid SS58 address format.");
    }
}

/// Send DOT to a parachain
export async function genericPolkadotToParachain(paraid: number, amount: number, address: string) {
  let api: ApiPromise;

  try {
	api = await connectToWsEndpoint('polkadot');
  	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("AccountId32", address).toHex();
  

	

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: accountId} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];


	const tx = api.tx.xcmPallet.reserveTransferAssets(
        { V3: destination },
        { V3: account },
        { V3: asset },
        0,
      );
  
  return tx;

  } catch (error) {
    console.error('Error connecting to WS endpoint:', error.message);
  }
}

// working: https://hydradx.subscan.io/xcm_message/polkadot-047344414db62b7c424c8de9037c5a99edd0794c
export async function dotToHydraDx(amount: number, targetAddress: string){
    const paraid = 2034; // TODO: call from ChainInfo
	let api: any;
	try {
        api = await connectToWsEndpoint('polkadot');
    } catch (error) {
        // If there's an error connecting, send a toast message and terminate the function
        toast.error("Failed to connect to the endpoint. Please ensure you're connected and try again.");
        return; 
    }
    console.log(`drafting dot to hydradx`);

	const rawTargetAddress = getRawAddress(targetAddress);


    const destination = {
        parents: 0,
        interior: { 
            X1: { 
                Parachain: paraid 
            } 
        },
    };

    const targetAccount = {
        parents: 0,
        interior: { 
            X1: { 
                AccountId32: { 
                    id: rawTargetAddress 
                } 
            } 
        }
    };

    const asset = [
        {
            id: { Concrete: { parents: 0, interior: "Here" } },
            fun: { Fungible: amount },
        }
    ];

    const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
        { V3: destination },
        { V3: targetAccount },
        { V3: asset },
        0,
		{ Unlimited: null }  // weight_limit

    );
    console.log(`[dotTohydraDx] tx created!`);
    console.log("[dotTohydraDx] tx to hex", tx.toHex());
    console.log("[dotTohydraDx] tx to human", tx.toHuman());
    console.log("[dotTohydraDx] tx", tx);

    return tx;
}



export async function dotToParachain(amount: number,  targetAddress: string){
  const paraid = 1000;
	const api = await connectToWsEndpoint('polkadot');
	console.log(`sending dot to parachain`);

  const rawTargetAddress = getRawAddress(targetAddress);

	// const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	// const accountId = api.createType("account_id_32", address).toHex(); // convert account to public key

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const targetAccount = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: rawTargetAddress} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];

  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
    { V3: destination },
    { V3: targetAccount },
    { V3: asset },
    0,
{ Unlimited: null }  // weight_limit
  );
//	console.log(`tx created!`);
//	console.log(tx.toHex());
	return tx;
}

export async function dotToAssetHub(amount: number,  targetAddress: string){
  const paraid = 1000;
	const api = await connectToWsEndpoint('polkadot');
	console.log(`sending dot to parachain`);

  const rawTargetAddress = getRawAddress(targetAddress);

	// const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	// const accountId = api.createType("account_id_32", address).toHex(); // convert account to public key

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const targetAccount = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: rawTargetAddress} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];

  const tx = api.tx.xcmPallet.limitedTeleportAssets(
    { V3: destination },
    { V3: targetAccount },
    { V3: asset },
    0,
{ Unlimited: null }  // weight_limit
  );
//	console.log(`tx created!`);
//	console.log(tx.toHex());
	return tx;
}


export async function parachainToPolkadot(amount: number, targetAddress: string, chainEndpoint: string) {
  console.log(`[parachainToPolkadot] Sending ${amount} DOT from assetHub to Polkadot`);

  const api = await connectToWsEndpoint(chainEndpoint);

  const rawTargetAddress = getRawAddress(targetAddress);


     // Destination is Polkadot relay chain
     const destination = {
      parents: 1, // Polkadot relay chain is one level up from any parachain
      interior: { Here: null }
  };

  console.log(`[parachainToPolkadot] targetAddress`, targetAddress);


  // The target account on Polkadot relay chain to receive the DOT
  const targetAccount = {
      parents: 1,  // Address is on the relay chain
      interior: { X1: { AccountId32: { id: rawTargetAddress } } }
  };

  // The asset to transfer, in this case, DOT from the relay chain
  const dotAssetLocation = { 
      Concrete: destination
  };

  const asset = {
      id: dotAssetLocation,
      fun: { Fungible: amount }
  };

  console.log(`[parachainToPolkadot] targetAccount`, targetAccount);
  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
      { V3: destination },
      { V3: targetAccount },
      { V3: [asset] },
      0,
      { Unlimited: null }  // weight_limit
  );

  return tx;
}


export async function parachainToAssetHub(amount: number, targetAddress: string, chainEndpoint: string) {
  console.log(`[parachainToPolkadot] Sending ${amount} DOT from assetHub to Polkadot`);

  const api = await connectToWsEndpoint(chainEndpoint);

  const rawTargetAddress = getRawAddress(targetAddress);


     // Destination is Polkadot relay chain
     const destination = {
      parents: 1, // Polkadot relay chain is one level up from any parachain
      interior: { Here: null }
  };

  console.log(`[parachainToPolkadot] targetAddress`, targetAddress);


  // The target account on Polkadot relay chain to receive the DOT
  const targetAccount = {
      parents: 1,  // Address is on the relay chain
      interior: { X1: { AccountId32: { id: rawTargetAddress } } }
  };

  // The asset to transfer, in this case, DOT from the relay chain
  const dotAssetLocation = { 
      Concrete: destination
  };

  const asset = {
      id: dotAssetLocation,
      fun: { Fungible: amount }
  };

  console.log(`[parachainToPolkadot] targetAccount`, targetAccount);
  const tx = api.tx.xcmPallet.limitedTeleportAssets(
      { V3: destination },
      { V3: targetAccount },
      { V3: [asset] },
      0,
      { Unlimited: null }  // weight_limit
  );

  return tx;
}



// ref: https://hydradx.subscan.io/extrinsic/3330338-2?event=3330338-7
// dry run results: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.hydradx.cloud#/extrinsics/decode and input this: 0x640489010300000300a10f00000000002801010200a10f000000
// HYDRADX > parachain
export async function hydraDxToParachain(amount: number, assetId: number, destAccount: string, paraId: number) {
	const api = await connectToWsEndpoint('hydraDx');

    const asset = {
        fun: {
            Fungible: amount, 
        },
        id: {
            Concrete: {
            interior: {
                X3: [
                { Parachain: paraId, PalletInstance: 50, GeneralIndex: assetId }],
                parents: 1, 
            },
            },
        },
    };

    const destination = {
        parents: 1,
        interior: { X2: [{ Parachain: paraId, AccountId32: destAccount, network: null }] },
    };

    const tx = api.tx.xTokens.transferMultiasset(
        { V3: asset },
        { V3: destination },
        { Unlimited: 0 },

    );

	return tx;
}

/// tested on assethub > hydradx
/// assethub > parachain, send an asset on assethub to receiving parachain
export async function assetHubToParachain(assetid: string, amount: number, accountid: string, paraid: number) {
  console.log(`[assethubToParachain]`);

  const api = await connectToWsEndpoint('assetHub');

  const destination = {
      parents: 0,
      interior: { X1: { Parachain: paraid } }
  };

  const targetAccount = {
      parents: 0,
      interior: { X1: { AccountId32: { id: accountid } } }
  };

  const asset = {
      id: {
          Concrete: {
              parents: 0,
              interior: {
                  X2: [
                      { PalletInstance: 50 },
                      { GeneralIndex: assetid }
                  ]
              }
          }
      },
      fun: { Fungible: amount }
  };

  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(  // Note: changed to xcmPallet
      { V3: destination },
      { V3: targetAccount },
      { V3: [asset] },
      0,
      { Unlimited: null }  // weight_limit
  );

  return tx;
}


// rococo to parachain
// sends native ROC to parachain

// rococo to parachain
// sends native ROC to parachain
export async function genericRococoToParachain(paraid: number, amount: number, accountId: string) {
	const api = await connectToWsEndpoint('rococo');
	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	//const accountId = api.createType("account_id_32", address).toHex();

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { account_id_32: { id: accountId} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];


	const tx = api.tx.xcmPallet.reserveTransferAssets(
        { V3: destination },
        { V3: account },
        { V3: asset },
        0,
      );

	return tx;
}
