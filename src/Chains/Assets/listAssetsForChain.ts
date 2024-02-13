import endpoints from "../api/WsEndpoints";
import { ChainInfo, listChains } from "../ChainsInfo";
import { getApiInstance } from "../api/connect";
import { CHAIN_METADATA } from "../api/metadata";
import { CHAIN_ASSETS } from "./chainAssets";

const HydraDx = listChains();

export function listAssetHubAssets() {
  const assets = CHAIN_ASSETS.assetHub.assets;
  // Transform the assets data to match your previous structure
  return assets.map((assetData: { asset: any; assetId: any }) => ({
    asset: assetData.asset,
    assetId: assetData.assetId,
  }));
}

export function listInterlayAssets() {
  const assets = CHAIN_ASSETS.interlay.assets;
  // Transform the assets data to match your previous structure
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
export function listHydraDxAssets() {
  const assets = CHAIN_ASSETS.hydraDx.assets;
  // Transform the assets data to match your previous structure
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
