import { getApiInstance } from '../../../../../../Chains/api/connect';
import { ApiPromise } from '@polkadot/api';

async function fetchAndDecodeMetadata(api: ApiPromise) {
    const metadata = await api.rpc.state.getMetadata();
    return metadata.toHuman(); // Convert the metadata to a more readable form
}

export async function queryMetadata(chainKey: string) {
    const api = await getApiInstance(chainKey);
    console.log('API from queryMetadata:', api);
    const metadata = await fetchAndDecodeMetadata(api);
    console.log('Metadata from queryMetadata:', metadata);
    return metadata;
}

// import { ApiPromise, WsProvider } from '@polkadot/api';

// // This is the predefined chain metadata you mentioned
// import { CHAIN_METADATA } from '../../../../../Chains/api/metadata';


// async function connectChain(chainKey: string) {
//     const chainInfo = CHAIN_METADATA[chainKey];
//     if (!chainInfo) throw new Error(`No chain found with key: ${chainKey}`);
//     const provider = new WsProvider(chainInfo.endpoints[0]);
//     const api = await ApiPromise.create({ provider });
//     return api;
// }

// async function fetchAndDecodeMetadata(api: ApiPromise) {
//     const metadata = await api.rpc.state.getMetadata();
//     return metadata.toHuman(); // Convert the metadata to a more readable form
// }

// export async function queryMetadata(chainKey: string) {
//     const api = await connectChain(chainKey);
//     console.log('api from queryMetdata',api);
//     const metadata = await fetchAndDecodeMetadata(api);
//     console.log('metadata from queryMetdata',metadata);
//     return metadata;
// }


