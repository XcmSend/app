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


  const Paseo: ChainInfo = {
    name: 'paseo',
    display: 'Paseo (Testnet Relay Chain)',
    paraid: 0,
    symbol: 'PAS',
    prefix: 1,
    token_decimals: 10,
    logo: '/chains/paseo.png',
    relayParent: 'paseo',
    parachain: false
  };
  chainList[999] = Paseo;

 const PaseoAssethub: ChainInfo = {
    name: 'paseo_assethub',
    display: 'Paseo Assethub(Testnet)',
    paraid: 1000,
    prefix: 1,
    symbol: 'PAS',
    token_decimals: 10,
    logo: '/chains/assethub.svg',
    relayParent: 'paseo',
    parachain: true
  };
  chainList[9990] = PaseoAssethub;

// 4001 paraid
  const PaseoPop: ChainInfo = {
    name: 'paseo_pop',
    display: 'Pop Testnet (paseo)',
    paraid: 4001,
    prefix: 51,
    token_decimals: 10,
    logo: '/chains/pop.svg',
    relayParent: 'paseo',
    parachain: true,
    symbol: 'POP'
  };
  chainList[9991] = PaseoPop;

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
        display: 'Hydra DX',
        paraid: 2034,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/hydradx.svg',
        relayParent: 'polkadot',
        parachain: true,
        symbol: 'HDX'
      };
      chainList[2034] = HydraDX;

      const Turing: ChainInfo = {
        name: 'turing',
        display: 'Turing (Kusama)',
        paraid: 2114,
        prefix: 51,
        token_decimals: 10,
        symbol: 'TUR',
        logo: '/chains/turing.png',
        relayParent: 'kusama',
        parachain: true
      };
      chainList[2114] = Turing;

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
        display: 'Contracts (Rococo| (EOL soon))',
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
        display: 'Rococo(EOL soon)',
        paraid: 0,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/rococo.jpeg',
        parachain: false,
        relay: true,
        symbol: 'ROC'

      };
      chainList[10000] = Rococo;


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
