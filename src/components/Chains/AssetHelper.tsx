
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { connectToWsEndpoint } from './DraftTx';
import endpoints  from './WsEndpoints';

interface AssetResponseObject {
    nonce: number;
    consumers: number;
    providers: number;
    sufficients: number;
    data: {
      free: number;
      reserved: number;
      miscFrozen: number;
      feeFrozen: number;
    };
  }
 
function isAssetResponseObject(obj: any): obj is AssetResponseObject {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'nonce' in obj &&
      'consumers' in obj &&
      'providers' in obj &&
      'sufficients' in obj &&
      'data' in obj
    );
  }

// returns the raw asset balance number, if not it returns 0
async function check_hydradx_raw_asset_balance(assetid:number, accountid32: string) {
    await cryptoWaitReady();
    const api = await connectToWsEndpoint(endpoints.polkadot.hydradx);

    const omnipoolAccountId = accountid32;//"7L53bUTBbfuj14UpdCNPwmgzzHSsrsTWBHX5pys32mVWM3C1";
    const hdxBalance = await api.query.system.account(omnipoolAccountId)
//    console.log('hydradx:');
    const fluff = hdxBalance.toHuman();
    if (isAssetResponseObject(fluff)) {
        const balance_object: AssetResponseObject = fluff;
        if (balance_object !== null && balance_object !== undefined) {
            const balance_object2 = balance_object.data;
            const freobj: number  = balance_object2.free; 
  //          console.log(freobj); //.data.free   / 1e12 , get the amount times decimals to get the "normal" balance nr 1.777 for example
            return freobj;
          }
    }
    
   // console.log(`check_hydradx_raw_asset_balance done`);

    return 0;

}

/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
async function get_hydradx_asset_symbol_decimals(assetid: number){
    const api = await connectToWsEndpoint(endpoints.polkadot.hydradx);
    const resp = (await api.query.assetRegistry.assetMetadataMap(assetid)).toHuman();
    return resp;
}
