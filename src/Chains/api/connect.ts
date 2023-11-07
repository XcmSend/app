import { ApiPromise, WsProvider } from "@polkadot/api";
import { CHAIN_METADATA } from "./metadata";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import toast from "react-hot-toast";

// Store the connections in a Map
const connections = new Map();

export default async function connectToWsEndpoint(chain: string): Promise<ApiPromise> {
  console.log("connectToWsEndpoint chain", chain);
  await cryptoWaitReady();

  // Use existing connection if it's already established
  if (connections.has(chain)) {
    const api = connections.get(chain);
    if (api.isConnected) {
      console.log(`Using existing connection for chain: ${chain}`);
      return api;
    } else {
      // Clean up the disconnected API instance
      connections.delete(chain);
      console.log(`Cleaned up disconnected API instance for chain: ${chain}`);
    }
  }

  // Get chain metadata
  const metadata = CHAIN_METADATA[chain];
  if (!metadata || !metadata.endpoints || metadata.endpoints.length === 0) {
    toast.error(`No endpoints found for chain: ${chain}`);
    throw new Error(`No endpoints found for chain: ${chain}`);
  }

  let lastError: any;
  for (const endpoint of metadata.endpoints) {
    try {
      console.log("Attempting to connect to endpoint", endpoint);
      const provider = new WsProvider(endpoint);
      const api = await ApiPromise.create({ provider });
      await api.isReady;
      connections.set(chain, api); // Store the ApiPromise instance
      console.log("Connected to endpoint", endpoint);
      return api;
    } catch (error) {
      lastError = error;
      console.error(`Failed to connect to endpoint ${endpoint}:`, error);

      if (error.message.includes("Insufficient resources")) {
        toast.error(`Endpoint ${endpoint} has insufficient resources.`);
      } else if (error.message.includes("abnormal closure")) {
        toast.error(`Endpoint ${endpoint} closed the connection abnormally.`);
      } else {
        toast.error(`Failed to connect to endpoint ${endpoint}. Trying next...`);
      }
    }
  }

  toast.error("All endpoints failed. Please check your connection and try again.");
  throw lastError;
}
