import { ApiPromise, WsProvider, SubmittableResult } from "@polkadot/api";
import { CHAIN_METADATA } from "./metadata";
import { cryptoWaitReady } from "@polkadot/util-crypto";

async function connectToWsEndpoint(chain: string, signal?: AbortSignal): Promise<any> {
    await cryptoWaitReady();
    
    let api: { isConnected: any; };
    for (let endpoint of CHAIN_METADATA[chain].endpoints) {
        try {
            console.log(`[connectToWsEndpoint] Trying to connect to ${endpoint}...`);
            const provider = new WsProvider(endpoint);
            api = await ApiPromise.create({ provider });
            if (api.isConnected) {
                console.log(`Connected to ${endpoint}`);
                return api;
            } else {
                provider.disconnect(); 
            }
        } catch (error) {
            console.error(`Failed to connect to ${endpoint}. Trying next one...`);
        }
    }

    throw new Error(`All endpoints for ${chain} failed. Cannot establish connection.`);
}

export default connectToWsEndpoint;