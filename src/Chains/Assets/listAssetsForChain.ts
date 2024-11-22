// todo reload asset at build time
import endpoints from "../api/WsEndpoints";
import { ChainInfo, listChains } from "../ChainsInfo";
import { getApiInstance } from "../api/connect";
import { CHAIN_METADATA } from "../api/metadata";
import { CHAIN_ASSETS } from "./chainAssets";

const HydraDx = listChains();

export function listAssetHubAssets() {
  const assets = CHAIN_ASSETS.assetHub.assets;

  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function listassetHub_kusamaAssets() {
  const assets = CHAIN_ASSETS.assetHub_kusama.assets;

  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function list_onchainassets(chain: string) {
  switch (chain) {
    case "moonbeam":
      const assets = CHAIN_ASSETS.moonbeam.assets;
      return assets.map(
        (assetData: { asset: any; decimals: any; assetId: any }) => ({
          asset: assetData.asset,
          decimals: assetData.decimals,
          assetId: assetData.assetId.replace(",", ""),
        })
      );
  }
}

export function listTuringAssets() {
  const assets = CHAIN_ASSETS.turing.assets;

  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function listMangataxAssets() {
  const assets = CHAIN_ASSETS.mangatax.assets;

  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function listInterlayAssets() {
  const assets = CHAIN_ASSETS.interlay.assets;

  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

async function listInterlayAssetReal() {
  const api = await getApiInstance("interlay");

  const dictionary = new Map<number, any>();
  const assets = await api.query.assetRegistry.metadata.entries();
  assets.forEach(
    ([
      {
        args: [id],
      },
      asset,
    ]) => {
      const myasset = {
        asset: asset.toHuman(),
        assetId: id.toHuman(),
      };
      dictionary.set(id.toHuman() as number, myasset);
    }
  );
  const valuesArray = Array.from(dictionary.values());
  return valuesArray;
}

export function listMoonRiverAssets() {
  const assets = CHAIN_ASSETS.moonriver.assets;
  console.log(`listing moonriver assets`);
  return assets.map((assetData) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function listHydraDxAssets() {
  const assets = CHAIN_ASSETS.hydraDx.assets;

  return assets.map((assetData) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

// COMMENTING OUT THE BELOW CODE BECAUSE IT IS FETCHING TOO OFTEN AND UNECESSARILY
// export async function listAssetHubAssets(signal: AbortSignal) {
// 	const api = await getApiInstance('assetHub', signal);
// 	console.log(`Connected to assethub`);

// 	const dictionary = new Map<number, any>();
// 	const assets = await api.query.assets.metadata.entries();
//     assets.forEach(([{args: [id] } ,asset]) => {
// 		const myasset = {
// 			asset: asset.toHuman(),
// 			assetId: id.toHuman(),
// 		};
// 		dictionary.set(id.toHuman() as number, myasset);
//       });
// // remove asset id in order to be able to parse it
// 	const valuesArray = Array.from(dictionary.values());
// //	console.log(`starting to list..`);
// //	console.log(valuesArray);
// 	return valuesArray;
// }

// COMMENTING OUT THE BELOW CODE BECAUSE IT IS FETCHING TOO OFTEN AND UNECESSARILY
// export async function listHydraDxAssets(signal: AbortSignal) {
// 	console.log(`[listHydraDxAssets] listing assets on hydradx`);
// 	const api = await getApiInstance('hydraDx', signal);
//     console.log(`[listHydraDxAssets] Assets onhydradx`, api);
// 	const dictionary = new Map<number, any>();

// 	const assets = await api.query.assetRegistry.assets.entries();
// 	assets.forEach(([{args: [id] } ,asset]) => {
// 		const myasset = {
// 			asset: asset.toHuman(),
// 			assetId: id.toHuman(),
// 		};
// 		dictionary.set(id.toHuman() as number, myasset);
//       });
// 	console.log(`[listHydraDxAssets] Assets onhydradx`, dictionary);
// 	// remove asset id in order to be able to parse it
// 	const valuesArray = Array.from(dictionary.values());
// //	console.log(`starting to list..`);
// //	console.log(valuesArray);
// 	return valuesArray;
// }

// export async function listPolkadexAssets(signal: AbortSignal) {
// 	const api = await getApiInstance('polkadex', signal);
// 	console.log(`Connected to Polkadex`);

// 	const dictionary = new Map<number, any>();
// 	const assets = await api.query.assets.metadata.entries();
//     assets.forEach(([{args: [id] } ,asset]) => {
// 		const myasset = {
// 			asset: asset.toHuman(),
// 			assetId: id.toHuman(),
// 		};
// 		dictionary.set(id.toHuman() as number, myasset);
//       });
// 	return dictionary;

// }

/*
async function export_turing_assets() {
  const wsProvider = new WsProvider("wss://rpc.turing.oak.tech");
  const api = await ApiPromise.create({ provider: wsProvider });

  const dictionary = new Map<number, any>();
  const assets = await api.query.assetRegistry.metadata.entries();
  assets.forEach(
    ([
      {
        args: [id],
      },
      asset,
    ]) => {
      //   console.log(`asset is:`, asset);
      const myasset = {
        asset: asset.toHuman(),
        assetId: id.toHuman(),
      };
      dictionary.set(id.toHuman() as number, myasset);
    }
  );
  const valuesArray = Array.from(dictionary.values());
  return valuesArray;
}
*/
