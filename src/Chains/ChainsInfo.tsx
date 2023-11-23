import endpoints from './api/WsEndpoints';
import { CHAIN_METADATA } from './api/metadata';

interface ChainInfo {
	name: string,
  display: string,
	paraid: number,
  prefix: number,
  token_decimals: number,
  logo?: string,
  relayParent?: string,
  relay?: boolean
  parachain?: boolean,
  }

interface AssetInfo {
    deposit: string;
    name: string;
    symbol: string;
    decimals: string;
    isFrozen: boolean;
    }
  

export function listChains() {
    // dict[paraid] = ChainInfo
    const chainList: Record<number, ChainInfo> = {};

    const Polkadot: ChainInfo = {
        name: 'polkadot',
        display: 'Polkadot',
        paraid: 0,
        prefix: 0,
        token_decimals: 10,
        logo: '/chains/polkadot.svg',
        parachain: false,
        relay: true,
      };
      chainList[0] = Polkadot;

      const Kusama: ChainInfo = {
        name: 'kusama',
        display: 'Kusama',
        paraid: 2,
        prefix: 2,
        token_decimals: 12,
        logo: '/chains/kusama.svg',
        parachain: false,
        relay: true,
      };
      chainList[2] = Kusama;

      const Kabocha: ChainInfo = {
        name: 'kusama',
        display: 'Kusama',
        paraid: 27,
        prefix: 27,
        token_decimals: 12,
        logo: '/chains/kusama.svg',
        parachain: true,
        relay: false,
      };
      chainList[2] = Kabocha;

      const HydraDX: ChainInfo = {
        name: 'hydraDx',
        display: 'Hydra DX',
        paraid: 2034,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/hydradx.svg',
        relayParent: 'polkadot',
        parachain: true
      };
      chainList[2034] = HydraDX;

      const interlay: ChainInfo = {
        name: 'interlay',
        display: 'Interlay',
        paraid: 2032,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/interlay.svg',
        relayParent: 'polkadot',
        parachain: true,
        
      };
      chainList[2032] = interlay;

      const assethub: ChainInfo = {
        name: 'assetHub',
        display: 'Asset Hub (Polkadot)',
        paraid: 1000,
        prefix: 63,
        token_decimals: 10,
        logo: '/chains/assethub.svg',
        relayParent: 'polkadot',
        parachain: true


      };
      chainList[1000] = assethub;

      const rococo: ChainInfo = {
        name: 'rococo',
        display: 'Rococo',
        paraid: 0,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/rococo.jpeg',
        parachain: false,
        relay: true,

      };
      chainList[10000] = rococo;

      const sora_roc: ChainInfo = {
        name: 'sora',
        display: 'Sora (Rococo)',
        paraid: 12011, // change me
        prefix: 0, //change me
        token_decimals: 10,
        logo: '/chains/sora.svg',
        relayParent: 'rococo',
        parachain: true
      };
      chainList[2011] = sora_roc;

    return chainList;
}

export function listRelayChains(): ChainInfo[] {
  const allChains = listChains();
  const relayChains = Object.values(allChains).filter(chain => chain.relay);
  return relayChains;
}



// handle matching chains easier
export enum supported_Polkadot_Chains {
  polkadot,
  hydradx,
  assethub,
}

/// send the 90% of the dot to be converted to USDT, the rest will be sent 
/// directly to assethub 
// in order to cover tx fee's


export { AssetInfo, ChainInfo };
