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
  symbol: string
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


    const KusamaAssethub: ChainInfo = {
      name: 'assetHub_kusama',
      display: 'Assethub (Kusama)',
      paraid: 1000,
      prefix: 2, 
      token_decimals: 12, //change me
      logo: '/chains/assethub.svg',
      relayParent: 'kusama',
      parachain: true,
      symbol: 'KSM'
    };

  chainList[21000] = KusamaAssethub;//fake paraid

  const Moonriver: ChainInfo = {
    name: 'moonriver',
    display: 'Moonriver (Kusama)',
    paraid: 2023,
    prefix: 42, 
    token_decimals: 18, 
    logo: '/chains/moonriver.svg',
    parachain: true, 
    relayParent: "kusama",
    relay: false,
    symbol: 'MOVR'
  };
  chainList[2023] = Moonriver;

  const MangataX: ChainInfo = {
    name: "mangatax",
    display: "MangataX (Kusama)",
    paraid: 2110,
    prefix: 42,
    token_decimals: 12,
    logo: '/chains/mangata.png',
    parachain: true, 
    relayParent: "kusama",
    relay: false,
    symbol: 'MGX'
  };

  chainList[2110] = MangataX;

  const Turing: ChainInfo = {
    name: 'turing',
    display: 'Turing (Kusama)',
    paraid: 2114,
    prefix: 51,
    token_decimals: 10,
    logo: '/chains/turing.png',
    relayParent: 'kusama',
    parachain: true,
    symbol: 'TUR'
  };
  chainList[2114] = Turing;

      const AssetHub: ChainInfo = {
        name: 'assetHub',
        display: 'Asset Hub (Polkadot)',
        paraid: 1000,
        prefix: 63,
        token_decimals: 10,
        logo: '/chains/assethub.svg',
        relayParent: 'polkadot',
        parachain: true,
        symbol: 'DOT'
      };
      chainList[1000] = AssetHub;

      const HydraDX: ChainInfo = {
        name: 'hydraDx',
        display: 'Hydration',
        paraid: 2034,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/hydradx.svg',
        relayParent: 'polkadot',
        parachain: true,
        symbol: 'HDX'
      };
      chainList[2034] = HydraDX;

      const Ethereum: ChainInfo = {
        name: 'ethereum',
        display: 'Ethereum',
        paraid: 0,
        prefix: 1,
        token_decimals: 12,
        logo: '/chains/ethereum.svg',
        relayParent: 'Ethereum',
        parachain: true,
        symbol: 'ETH'
        
      };
      chainList[100000] = Ethereum;



      const Interlay: ChainInfo = {
        name: 'interlay',
        display: 'Interlay',
        paraid: 2032,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/interlay.svg',
        relayParent: 'polkadot',
        parachain: true,
        symbol: 'INTR'
        
      };
      chainList[2032] = Interlay;

      const Kabocha: ChainInfo = {
        name: 'kabocha',
        display: 'Kabocha',
        paraid: 2113,
        prefix: 27,
        token_decimals: 12,
        logo: '/chains/kabocha.svg',
        parachain: true,
        relay: false,
        relayParent: 'kusama',
        symbol: 'KAB'
      };
      chainList[2113] = Kabocha;



      const Moonbeam: ChainInfo = {
        name: 'moonbeam',
        display: 'Moonbeam (Polkadot)',
        paraid: 2004,
        prefix: 1284,
        token_decimals: 12,
        logo: '/chains/moonbeam.svg',
        relayParent: 'polkadot',
        parachain: true,
        relay: false,
        symbol: 'GLMR'
      };
      chainList[2004] = Moonbeam;

  

      const Polkadot: ChainInfo = {
        name: 'polkadot',
        display: 'Polkadot',
        paraid: 0,
        prefix: 0,
        token_decimals: 10,
        logo: '/chains/polkadot.svg',
        parachain: false,
        relay: true,
        symbol: 'DOT'
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
        symbol: 'KSM'
      };
      chainList[2] = Kusama;
      const RococoContracts: ChainInfo = {
        name: 'rococo_contracts',
        display: 'Contracts (Rococo)',
        paraid: 0,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/rococo.jpeg',
        parachain: false,
        relay: true,
        symbol: 'ROC'

      };
      chainList[101] = RococoContracts;

      const Rococo: ChainInfo = {
        name: 'rococo',
        display: 'Rococo',
        paraid: 0,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/rococo.jpeg',
        parachain: false,
        relay: true,
        symbol: 'ROC'

      };
      chainList[10000] = Rococo;

      const Sora: ChainInfo = {
        name: 'sora',
        display: 'Sora (Rococo)',
        paraid: 2011, // change me
        prefix: 0, //change me
        token_decimals: 10,
        logo: '/chains/sora.svg',
        relayParent: 'rococo',
        parachain: true,
        symbol: 'SORA'
      };
      chainList[2011] = Sora;
      // only rococo > rococo assethub transfers is supported 
      const RococoAssethub: ChainInfo = {
        name: 'rococo_assethub',
        display: 'Assethub (Rococo)',
        paraid: 1000, 
        prefix: 2, 
        token_decimals: 12,
        logo: '/chains/assethub.svg',
        relayParent: 'rococo',
        parachain: true,
        symbol: 'ROC'
      };

      chainList[3000] = RococoAssethub;// fake paraid


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


export type { AssetInfo, ChainInfo };
