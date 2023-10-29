import connectToWsEndpoint from "../api/connect";
import { ChainInfo, listChains } from "../ChainsInfo"

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
export async function findIngressPolkadotChannels(paraid: number): Promise<[number]> {
	const api = await connectToWsEndpoint('polkadot');
	const Channels = (
        (await api.query.hrmp.hrmpIngressChannelsIndex(paraid)) as any
      ).map((a: { toNumber: () => any; }) => a.toNumber());

	return Channels;
}

export async function findEngressPolkadotChannels(paraid: number): Promise<[number]> {
	const api = await connectToWsEndpoint('polkadot');
	const Channels = (
        (await api.query.hrmp.hrmpEgressChannelsIndex(paraid)) as any
      ).map((a: { toNumber: () => any; }) => a.toNumber());

	return Channels;
}

/// take input chain and dest chain and check if they got open hrmp channels 
/// input: source chain paraid, dest chain paraid
export async function polkadotParachainChannelCheck(sourceparaid: number, destchain: number): Promise<boolean> {
    const s_ingress = await findIngressPolkadotChannels(sourceparaid);
    const s_egress = await findEngressPolkadotChannels(sourceparaid);

    if (s_ingress.includes(destchain) && s_egress.includes(destchain)) {
        return true;
    }

    return false;

}

export async function inAndOutChannels(paraid: number): Promise<number[]> {
  const s_ingress = await findIngressPolkadotChannels(paraid);
    const s_egress = await findEngressPolkadotChannels(paraid);
  const paraid_map: number[] = s_ingress.filter((num) => s_egress.includes(num));

  return paraid_map;

}

export function listParachainsConnectedToRelay(relayName: string, chains: Record<number, ChainInfo>): ChainInfo[] {
  return Object.values(chains).filter(chain => chain.relay === relayName);
}


/// <sourceparaid, [openhrmp channels ingoing and outgoing as paraid]>
/// const index_channels: Map<number, number[]> = await build_hrmp();
export async function buildHrmp(): Promise<Record<number, number[]>> { 
  const chainlist: Record<number, ChainInfo> = listChains();
  const polkadotParachains = listParachainsConnectedToRelay('polkadot', chainlist);
  const localHrmpChannels: Record<number, number[]> = {};  // A local version of the hrmpChannels map
  localHrmpChannels[0] = polkadotParachains.map(parachain => parachain.paraid);

   // Remove rococo without mutating original list
   const filteredChainList = {...chainlist};
  //  delete filteredChainList[10000]; 

   const openchannels: Map<number, number[]> = new Map();


   for (const key in filteredChainList) {
       const chainInfo = filteredChainList[key];
       const paraid = chainInfo.paraid;
       
       const channels: number[] = await inAndOutChannels(paraid); 
       
       
       openchannels.set(paraid, channels);
     }
     openchannels.set(0, localHrmpChannels[0]);


   return Object.fromEntries(openchannels);

}


/// get the lease time of a polkadot connected chain
export async function polkadotGetLeaseTime(paraid: number) {
    
}