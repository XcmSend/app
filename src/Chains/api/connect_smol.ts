import { get_polkadot_client } from "./light-client/get_client";

const apiConnections = new Map<string, any>();

export async function getSmoldotApiInstance(chain: string): Promise<any> {
  console.log("getApiInstance chain", chain);
  if (chain.toLowerCase() != "polkadot") {
    throw new Error("only polkadot with smoldot is currently supported");
  }
  if (apiConnections.has(chain)) {
    const api = apiConnections.get(chain);
    if (api) {
      console.log(`returning smoldot api`);
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
            error
          );
        }
      }
      console.log(`deleting chain from cache`);
      apiConnections.delete(chain); // Cleanup after failed reconnection attempts
      throw new Error(
        `Failed to reconnect to ${chain} after several attempts.`
      );
    }
  }

  // Establish a new connection if we don't have one already
  console.log(`Establishing new connection to ${chain}...`);
  const api = await get_polkadot_client();
  apiConnections.set(chain, api);
  console.log(`api connections.`, apiConnections);
  return api;
}
