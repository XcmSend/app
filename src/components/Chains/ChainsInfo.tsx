import endpoints from './WsEndpoints';

interface ChainInfo {
	name: string,
  display: string,
	ws_endpoint: string,
	paraid: number,
  prefix: number,
  token_decimals: number,
  logo?: string,
  }

interface AssetInfo {
    deposit: string;
    name: string;
    symbol: string;
    decimals: string;
    isFrozen: boolean;
    }
  
    export enum supported_Polkadot_Chains {
      polkadot,
      hydradx,
      assethub,
    }
    

export function listChains() {
    // dict[paraid] = ChainInfo
    const chainList: Record<number, ChainInfo> = {};

    const Polkadot: ChainInfo = {
        name: 'polkadot',
        display: 'Polkadot',
        ws_endpoint: endpoints.polkadot.default,
        paraid: 0,
        prefix: 0,
        token_decimals: 10,
        logo: '/chains/polkadot.svg'
      };
      chainList[0] = Polkadot;

      const HydraDX: ChainInfo = {
        name: 'hydraDx',
        display: 'Hydra DX',
        ws_endpoint: endpoints.polkadot.hydraDx,
        paraid: 2034,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/hydradx.svg'
      };
      chainList[2034] = HydraDX;

      const assethub: ChainInfo = {
        name: 'assetHub',
        display: 'Asset Hub (Polkadot)',
        ws_endpoint: endpoints.polkadot.assetHub,
        paraid: 2034,
        prefix: 63,
        token_decimals: 10,
        logo: '/chains/assethub.svg'
      };
      chainList[1000] = assethub;

      const rococo: ChainInfo = {
        name: 'rococo',
        display: 'Rococo',
        ws_endpoint: endpoints.polkadot.assetHub,
        paraid: 0,
        prefix: 0,
        token_decimals: 12,
        logo: '/chains/rococo.jpeg'
      };
      chainList[10000] = rococo;

    return chainList;
}



/// place a hydradx omnipool order


/// send the 90% of the dot to be converted to USDT, the rest will be sent 
/// directly to assethub 
// in order to cover tx fee's


export { AssetInfo, ChainInfo };
