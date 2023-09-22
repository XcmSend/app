import endpoints from "./WsEndpoints";
import { ChainInfo, listChains } from "./ChainsInfo";
import connectToWsEndpoint from "./connect";
import { CHAIN_METADATA } from "./metadata";

const HydraDx = listChains();


export async function listAssetHubAssets(signal: AbortSignal) {
	const api = await connectToWsEndpoint('assetHub', signal);
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
	const api = await connectToWsEndpoint('polkadex', signal);
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
	const api = await connectToWsEndpoint('hydraDx', signal);
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
	console.log(`[listHydraDxAssets] Assets onhydradx`, dictionary);
	// remove asset id in order to be able to parse it
	const valuesArray = Array.from(dictionary.values());
//	console.log(`starting to list..`);
//	console.log(valuesArray);
	return valuesArray;
}
