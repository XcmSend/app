import { ApiPromise, WsProvider } from "@polkadot/api";
import { CHAIN_METADATA } from "./metadata";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import toast from "react-hot-toast";

// Store the API connections in a global map
const apiConnections = new Map<string, ApiPromise>();
// Constant to set max reconnection attempts
const MAX_RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_TIMEOUT = 5000; // milliseconds

export async function getApiInstance(chain: string): Promise<ApiPromise> {
  if (apiConnections.has(chain)) {
    const api = apiConnections.get(chain);
    if (api && api.isConnected) {
      return api;
    } else {
      console.log(`Connection to ${chain} lost. Attempting to reconnect...`);
      // Attempt to reconnect a few times
      for (let i = 0; i < 3; i++) {
        try {
          await api.connect();
          console.log(`Reconnected to ${chain} successfully.`);
          return api;
        } catch (error) {
          console.error(
            `Attempt ${i + 1} failed to reconnect to ${chain}:`,
            error,
          );
        }
      }
      apiConnections.delete(chain); // Cleanup after failed reconnection attempts
      throw new Error(
        `Failed to reconnect to ${chain} after several attempts.`,
      );
    }
  }

  // Establish a new connection if we don't have one already
  console.log(`Establishing new connection to ${chain}...`);
  const api = await connectToWsEndpoint(chain);
  apiConnections.set(chain, api);
  return api;
}

export async function connectToWsEndpoint(chain: string): Promise<ApiPromise> {
  console.log("connectToWsEndpoint chain", chain);
  await cryptoWaitReady();

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

      api.on("disconnected", async () => {
        console.log(
          `Disconnected from ${endpoint}. Attempting to reconnect...`,
        );
        apiConnections.delete(chain); // Delete the existing connection instance

        // Try to create a new connection
        try {
          const newApi = await connectToWsEndpoint(chain);
          apiConnections.set(chain, newApi);
          console.log(`Reconnected to ${chain} successfully.`);
        } catch (reconnectError) {
          console.error(`Failed to reconnect to ${chain}:`, reconnectError);
        }
      });

      apiConnections.set(chain, api);
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
        toast.error(
          `Failed to connect to endpoint ${endpoint}. Trying next...`,
        );
      }
    }
  }

  toast.error(
    "All endpoints failed. Please check your connection and try again.",
  );
  throw lastError;
}
