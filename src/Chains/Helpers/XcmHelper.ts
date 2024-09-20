import { getApiInstance } from "../api/connect";
import { ChainInfo, listChains, listRelayChains } from "../ChainsInfo";
import { ApiPromise } from "@polkadot/api";

/*
returns a list of paraid's
[
  1001, 1002, 2000, 2004,
  2006, 2007, 2011, 2012,
  2013, 2021, 2030, 2031,
  2032, 2034, 2035, 2040,
  2046, 2048, 2051, 2094,
  2101, 2104
]
*/

// This function returns a list of all relay chains' names from the chain list.
function getRelayChains() {
  const chains = listChains();
  const relays = Object.values(chains).filter((chain) => chain.relay);
  return relays.map((chain) => chain.name);
}

// This function finds ingress channels for a given paraid on a specified relay chain.
async function findIngressChannels(
  relayChainName: string,
  paraid: number
): Promise<number[]> {
  const api: ApiPromise = await getApiInstance(relayChainName);
  const result = await api.query.hrmp.hrmpIngressChannelsIndex(paraid);
  // Directly mapping over the result assuming result is Vec<u32>
  // const channels = result.map((item) => item.toNumber());
  const channels = (result as unknown as { toNumber: () => number }[]).map(
    (item) => item.toNumber()
  );

  // console.log(`Ingress channels for ${paraid} on ${relayChainName}:`, channels);
  return channels;
}

// This function finds egress channels for a given paraid on a specified relay chain.
async function findEgressChannels(
  relayChainName: string,
  paraid: number
): Promise<number[]> {
  const api: ApiPromise = await getApiInstance(relayChainName);
  const result = await api.query.hrmp.hrmpEgressChannelsIndex(paraid);
  // Directly mapping over the result assuming result is Vec<u32>
  const channels = (result as unknown as { toNumber: () => number }[]).map(
    (item) => item.toNumber()
  );
  //   console.log(`Egress channels for ${paraid} on ${relayChainName}:`, channels);
  return channels;
}

// Example function that processes all relay chains
async function findAllChannels() {
  const relayChains = getRelayChains();
  for (const relayChainName of relayChains) {
    console.log(`Processing channels for relay chain: ${relayChainName}`);
    const parachains = Object.values(listChains()).filter(
      (chain) => chain.relayParent === relayChainName
    );
    for (const parachain of parachains) {
      const ingressChannels = await findIngressChannels(
        relayChainName,
        parachain.paraid
      );
      const egressChannels = await findEgressChannels(
        relayChainName,
        parachain.paraid
      );
      // Do something with channels
    }
  }
}
export async function findIngressPolkadotChannels(
  paraid: number
): Promise<[number]> {
  //  console.log("findIngressPolkadotChannels for hrmp for  paraid", paraid);
  const api = await getApiInstance("polkadot");
  // console.log("findIngressPolkadotChannels for hrmp for  api", api);
  const Channels = (
    (await api.query.hrmp.hrmpIngressChannelsIndex(paraid)) as any
  ).map((a: { toNumber: () => any }) => a.toNumber());
  console.log(
    "findIngressPolkadotChannels for hrmp for  paraid",
    paraid,
    Channels
  );
  return Channels;
}

export async function findEngressPolkadotChannels(
  paraid: number
): Promise<[number]> {
  const api = await getApiInstance("polkadot");
  const Channels = (
    (await api.query.hrmp.hrmpEgressChannelsIndex(paraid)) as any
  ).map((a: { toNumber: () => any }) => a.toNumber());

  return Channels;
}

// /// take input chain and dest chain and check if they got open hrmp channels
// /// input: source chain paraid, dest chain paraid
// export async function polkadotParachainChannelCheck(
//   sourceparaid: number,
//   destchain: number
// ): Promise<boolean> {
//   const s_ingress = await findIngressPolkadotChannels(sourceparaid);
//   const s_egress = await findEngressPolkadotChannels(sourceparaid);

//   if (s_ingress.includes(destchain) && s_egress.includes(destchain)) {
//     return true;
//   }

//   return false;
// }

// Updated function to process ingress and egress channels across multiple relay chains.
export async function inAndOutChannels(paraid: number): Promise<number[]> {
  try {
    // Fetch all relay chain names from the list of chains
    const relayChains = getRelayChains();
    let paraid_map: number[] = [];

    // Iterate over each relay chain and find ingress and egress channels
    for (const relayChainName of relayChains) {
      const s_ingress = await findIngressChannels(relayChainName, paraid);
      const s_egress = await findEgressChannels(relayChainName, paraid);

      // Filter to find matching channel IDs in both ingress and egress channels
      let matchedChannels = s_ingress.filter((num) => s_egress.includes(num));
      paraid_map = [...new Set([...paraid_map, ...matchedChannels])]; // Combine and remove duplicates
    }

    return paraid_map;
  } catch (error) {
    console.error(`Error in inAndOutChannels for paraid ${paraid}:`, error);
    throw error; // Re-throw the error to ensure it's not silently ignored
  }
}

export function listParachainsConnectedToRelay(
  relayName: string,
  chains: Record<number, ChainInfo>
): ChainInfo[] {
  // console.log("listParachainsConnectedToRelay for hrmp", chains);
  return Object.values(chains).filter(
    (chain) => chain.relayParent === relayName
  );
}

/// <sourceparaid, [openhrmp channels ingoing and outgoing as paraid]>
/// const index_channels: Map<number, number[]> = await build_hrmp();
export async function buildHrmp(): Promise<Record<number, number[]>> {
  //console.log("building hrmp channels");
  const chainlist = listChains();
  //console.log("hrmp Retrieved chain list", chainlist);

  const relayChains = listRelayChains();
  const hrmpChannels: Record<number, number[]> = {};

  for (const relayChain of relayChains) {
    // Assuming relayChain.paraid is the identifier for the relay chain
    // console.log(`buildHrmp processing ${relayChain.name} with paraid ${relayChain.paraid}`);

    const parachains = Object.values(chainlist).filter(
      (chain) => chain.relayParent === relayChain.name
    );
    console.log(`buildHrmp ${relayChain.name} parachains`, parachains);

    for (const parachain of parachains) {
      const paraid = parachain.paraid;
      //   console.log(`hrmp Processing channels for paraid: ${paraid}`);

      try {
        const channels: number[] = await inAndOutChannels(paraid);
        //   console.log(`hrmp Channels for ${paraid}`, channels);
        hrmpChannels[paraid] = channels;
      } catch (error) {
        console.error(`Error fetching channels for paraid ${paraid}`, error);
      }
    }
  }

  // Add all parachains under Polkadot to hrmpChannels[0]
  hrmpChannels[0] = Object.values(chainlist)
    .filter((chain) => chain.relayParent === "polkadot")
    .map((chain) => chain.paraid);

  // Add all parachains under Polkadot to hrmpChannels[0]
  hrmpChannels[10000] = Object.values(chainlist)
    .filter((chain) => chain.relayParent === "rococo")
    .map((chain) => chain.paraid);

  console.log("HRMP channels object to return", hrmpChannels);
  return hrmpChannels;
}

// get the lease time of a polkadot connected chain
export async function polkadotGetLeaseTime(chainname: string) {
  switch (chainname) {
    case "interlay":
      return "16-01-2024";
    case "assetHub":
      return "indefinitely";
    case "hydraDx":
      return "16-01-2024";
  }
}
