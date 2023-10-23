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
export async function find_ingress_polkadot_channels(paraid: number): Promise<[number]> {
	const api = await connectToWsEndpoint('polkadot');
	const Channels = (
        (await api.query.hrmp.hrmpIngressChannelsIndex(paraid)) as any
      ).map((a) => a.toNumber());

	return Channels;
}

export async function find_engress_polkadot_channels(paraid: number): Promise<[number]> {
	const api = await connectToWsEndpoint('polkadot');
	const Channels = (
        (await api.query.hrmp.hrmpEgressChannelsIndex(paraid)) as any
      ).map((a) => a.toNumber());

	return Channels;
}

/// take input chain and dest chain and check if they got open hrmp channels 
/// input: source chain paraid, dest chain paraid
export async function polkadot_parachain_channel_check(sourceparaid: number, destchain: number): Promise<boolean> {
    const s_ingress = await find_ingress_polkadot_channels(sourceparaid);
    const s_egress = await find_engress_polkadot_channels(sourceparaid);

    if (s_ingress.includes(destchain) && s_egress.includes(destchain)) {
        return true;
    }

    return false;

}

export async function inandoutchannels(paraid: number): Promise<number[]> {
  const s_ingress = await find_ingress_polkadot_channels(paraid);
    const s_egress = await find_engress_polkadot_channels(paraid);
  const paraid_map: number[] = s_ingress.filter((num) => s_egress.includes(num));

  return paraid_map;

}

/// <sourceparaid, [openhrmp channels ingoing and outgoing as paraid]>
/// const index_channels: Map<number, number[]> = await build_hrmp();
export async function build_hrmp(): Promise<Map<number, number[]>> { // Promise<Map<ParaId, ParaId[]>> 
  const chainlist: Record<number, ChainInfo> = listChains();
   /// remove rococo
   for (const key in chainlist) {
    if (chainlist[key].name === "rococo") {
      delete chainlist[key];
    }
  }

    // const mylist: Vec<ParaId, Vec<ParaId>> = 
   const openchannels: Map<number, number[]> = new Map();
  // console.log(`Building hrmp dicts`);

   for (const key in chainlist) {
       const chainInfo = chainlist[key];
       const paraid = chainInfo.paraid;
//       const name = chainInfo.name;
       const channels: number[] = await inandoutchannels(paraid); 
       openchannels.set(paraid, channels);
//       console.log(`Paraid: ${paraid}, Name: ${name}`);
     }
   return openchannels;
}


/// get the lease time of a polkadot connected chain
export async function polkadot_get_lease_time(paraid: number) {
    
}