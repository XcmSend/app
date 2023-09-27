import { ApiPromise, WsProvider, SubmittableResult } from "@polkadot/api";
import { CHAIN_METADATA } from "./metadata";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import toast from "react-hot-toast";


/**
 * Connects to an endpoint based on a chain. If connection fails, attempts to connect to the next endpoint.
 * 
 * @param {string} chain - The chain to connect to.
 * @returns {ApiPromise} - The connected API instance.
 * @throws {Error} - Throws an error if all endpoints fail.
 */
export default async function connectToWsEndpoint(chain: string): Promise<ApiPromise> {
    const metadata = CHAIN_METADATA[chain];

    if (!metadata || !metadata.endpoints || metadata.endpoints.length === 0) {
        toast.error(`No endpoints found for chain: ${chain}`);
        throw new Error(`No endpoints found for chain: ${chain}`);
    }

    // Wait for the crypto libraries to be ready
    await cryptoWaitReady();

    let lastError: any;
    for (const endpoint of metadata.endpoints) {
        try {
            const provider = new WsProvider(endpoint);
            const api = await ApiPromise.create({ provider });
            await api.isReady;
            return api;
        } catch (error) {
            lastError = error;
            toast.error(`Failed to connect to endpoint ${endpoint}. Trying next...`);
        }
    }

    toast.error("All endpoints failed. Please check your connection.");
    throw lastError;
}
