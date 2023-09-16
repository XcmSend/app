import { connectToWsEndpoint } from './DraftTx';
import { ChainInfo, listChains } from './ChainsInfo'; 
import { adjustBalance, parseBalanceString, formatToFourDecimals, toUnit} from './utils'

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
      total: number;
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

/// convert assethub's asset balance response
interface  AssetHubAssetBalance {
  balance: number;
  status: string;
  reason: string,
  extra: string

}

function  isAssetHubAssetBalance(obj: any): obj is  AssetHubAssetBalance {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'balance' in obj &&
    'status' in obj &&
    'reason' in obj &&
    'extra' in obj
  );
}


// check asset balance on polkadot assethub
async function checkAssetHubAssetBalance(assetid: number, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  const api = await connectToWsEndpoint(endpoints.polkadot.assetHub, signal);
  const balance = await api.query.assets.account(assetid, account_id_32);
  const b3 = balance.toHuman();
  if (isAssetHubAssetBalance(b3)) {
      const bal_obj: AssetHubAssetBalance = b3;
      return {
          free: bal_obj.balance,
          reserved: 0, 
          total: bal_obj.balance 
      };
  } 
  return { free: 0, reserved: 0, total: 0 };
   // console.log(balance.registry.);
//    console.log(`checkAssetHubAssetBalance done`);
}

interface OrmlTokensAccountData {
  free: number;
  reserved: number;
  frozen: number;
}

function isOrmlTokensAccountData(obj: any): obj is OrmlTokensAccountData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'free' in obj &&
    'reserved' in obj &&
    'frozen' in obj
        );
}


// returns the raw asset balance number, if not it returns 0
async function checkHydraDxRawAssetBalance(assetid: number, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  let hdxBalance: any;
  if (account_id_32) {
  const api = await connectToWsEndpoint(endpoints.polkadot.hydraDx, signal);
  hdxBalance = await api.query.system.account(account_id_32);
  }
  const balance = hdxBalance.toHuman();

  if (isAssetResponseObject(balance)) {
      const balance_object: AssetResponseObject = balance;
      if (balance_object !== null && balance_object !== undefined) {
          const free = balance_object.data.free;
          const reserved = balance_object.data.reserved;
          return {
              free,
              reserved,
              total: free + reserved
          };
      }
  }
  return { free: 0, reserved: 0, total: 0 };
}

/// returns the raw balance of the native dot token
async function checkPolkadotDotRawNativeBalance(accountId: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  let bal: any;
  let bal3: any;
  if (accountId) {
    const api = await connectToWsEndpoint(endpoints.polkadot.default, signal);
    bal = await api.query.system.account(accountId);
  }
  bal3 = bal.toHuman();

  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;
      return {
          free: bal2.data.free,
          reserved: bal2.data.reserved,
          total: bal2.data.total
      };
  }
  return { free: 0, reserved: 0, total: 0 };
}

/// returns the raw balance of the native dot token
async function checkRococoRocRawNativeBalance(accountid: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  const api = await connectToWsEndpoint(endpoints.rococo.default, signal);
  const bal = await api.query.system.account(accountid);
  const bal3 = bal.toHuman();
  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;
      return {
          free: bal2.data.free,
          reserved: bal2.data.reserved,
          total: bal2.data.total
      };
  }
  return { free: 0, reserved: 0, total: 0 };
}

/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
async function getHydradxAssetSymbolDecimals(assetid: number){
    const api = await connectToWsEndpoint(endpoints.polkadot.hydraDx);
    const resp = (await api.query.assetRegistry.assetMetadataMap(assetid)).toHuman();
    return resp;
}

function getTokenDecimalsByChainName(chainName: string): number {
  const chainList = listChains();
  const selectedChain = Object.values(chainList).find(chain => chain.name === chainName);
  if (!selectedChain) {
      throw new Error(`Chain not found: ${chainName}`);
  }
  return selectedChain.token_decimals;
}


export async function getAssetBalanceForChain(chain: string, assetId: number, accountId: string, signal?: AbortSignal): Promise<{ free: string, reserved: string, total: string }> {
  let balances: { free: number, reserved: number, total: number };

  if (signal && signal.aborted) {
    throw new Error('Operation was aborted');
  }

    if (chain === "polkadot") {
        balances = await checkPolkadotDotRawNativeBalance(accountId, signal);
    } else if (chain === "hydraDx") {
        balances = await checkHydraDxRawAssetBalance(assetId, accountId, signal);
    } else if (chain === "assetHub") {
        balances = await checkAssetHubAssetBalance(assetId, accountId, signal);
    } else if (chain === "rococo") {
        balances = await checkRococoRocRawNativeBalance(accountId, signal);
    } else {
        throw new Error(`Unsupported chain: ${chain}`);
    }

    const tokenDecimals = getTokenDecimalsByChainName(chain);
    const freeInUnits = toUnit(balances.free, tokenDecimals);
    const reservedInUnits = toUnit(balances.reserved, tokenDecimals);

    console.log(`Free Balance in units: ${freeInUnits}`);
    console.log(`Reserved Balance in units: ${reservedInUnits}`);

    const totalInUnits = freeInUnits + reservedInUnits;
    console.log(`totalInUnits: ${totalInUnits}`);

    const totalRawBalances = Number(balances.free) + Number(balances.reserved);
    console.log(`totalRawBalances: ${JSON.stringify(totalRawBalances)}`);

    console.log(`rawBalances: ${JSON.stringify(balances)}`);
    const adjustedBalances = {
      free: freeInUnits.toString(),
      reserved: reservedInUnits.toString(),
      total:totalInUnits.toString(),
      

  };
    const adjustedTrimmedBalancesIncludingData = {
      free: formatToFourDecimals(adjustedBalances.free),
      reserved: formatToFourDecimals(adjustedBalances.reserved),
      total: formatToFourDecimals(adjustedBalances.total),
      info: {
        chain, accountId, assetId, tokenDecimals
      }

    }
    console.log(`adjustedBalances [raw]: ${JSON.stringify(adjustedBalances)}`);
    return adjustedTrimmedBalancesIncludingData;
}
