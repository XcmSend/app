
import endpoints from "./WsEndpoints";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ChainInfo, listChains } from "./ChainsInfo";
import { ApiPromise, WsProvider, SubmittableResult } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const HydraDx = listChains();

export async function connectToWsEndpoint(ws_endpoint: string, signal?: AbortSignal) {
    await cryptoWaitReady();
	const provider = new WsProvider(ws_endpoint);
	const api = await ApiPromise.create({
		provider: provider
	  });

	return api;
}

export async function listAssetHubAssets(signal: AbortSignal) {
	const api = await connectToWsEndpoint(endpoints.polkadot.assetHub, signal);
	console.log(`Connected to assethub`);
	
	const dictionary = new Map<number, any>();
	const assets = await api.query.assets.metadata.entries();
    assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			asset: asset.toHuman(),
			assetId: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
// remove asset id in order to be able to parse it
	const valuesArray = Array.from(dictionary.values());
//	console.log(`starting to list..`);
//	console.log(valuesArray);
	return valuesArray;
}


export async function listPolkadexAssets(signal: AbortSignal) {
	const api = await connectToWsEndpoint(endpoints.polkadot.polkadex, signal);
	console.log(`Connected to Polkadex`);
	
	const dictionary = new Map<number, any>();
	const assets = await api.query.assets.metadata.entries();
    assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			asset: asset.toHuman(),
			assetId: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
	return dictionary;

}



export async function listHydraDxAssets(signal: AbortSignal) {
	console.log(`[listHydraDxAssets] listing assets on hydradx`);
	const api = await connectToWsEndpoint(endpoints.polkadot.hydraDx, signal);
    console.log(`[listHydraDxAssets] Assets onhydradx`, api);
	const dictionary = new Map<number, any>();

	const assets = await api.query.assetRegistry.assets.entries();
	assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			asset: asset.toHuman(),
			assetId: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
	
	// remove asset id in order to be able to parse it
	const valuesArray = Array.from(dictionary.values());
//	console.log(`starting to list..`);
//	console.log(valuesArray);
	return valuesArray;
}


/// Send DOT to a parachain
export async function genericPolkadotToParachain(paraid: number, amount: number, address: string) {
	const api = await connectToWsEndpoint(endpoints.polkadot.default);
	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("account_id_32", address).toHex();

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



// working: https://hydradx.subscan.io/xcm_message/polkadot-047344414db62b7c424c8de9037c5a99edd0794c
export async function dotToHydraDx(amount: number,  address: string){
	const paraid = 2034;
	const api = await connectToWsEndpoint(endpoints.polkadot.default);
	console.log(`sending dot to hydradx`);
	// const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("account_id_32", address).toHex();

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
	console.log(`tx created!`);
	console.log(tx.toHex());
	return tx;
}


// ref: https://hydradx.subscan.io/extrinsic/3330338-2?event=3330338-7
// dry run results: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.hydradx.cloud#/extrinsics/decode and input this: 0x640489010300000300a10f00000000002801010200a10f000000
// HYDRADX > parachain
async function hydraDxToParachain(amount: number, assetId: number, destAccount: string, paraId: number) {
	const api = await connectToWsEndpoint(endpoints.polkadot.hydraDx);

	
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
        { V2: destination },
        { Unlimited: 0 },

    );

	return tx;
}

// Swap functionality 