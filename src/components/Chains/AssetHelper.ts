import connectToWsEndpoint from './connect';
import { ChainInfo, listChains } from './ChainsInfo'; 
import { adjustBalance, parseBalanceString, formatToFourDecimals, toUnit} from './utils'
import { ApiPromise } from "@polkadot/api";
import { string } from 'slate';

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
async function checkAssetHubBalance(assetid: number, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number, assetDecimals?: number }> {

  let cleanAssetId = parseInt(assetid.toString().replace(/,/g, ''), 10);

  
  console.log(`checkAssetHubBalance accountId`, account_id_32);
  
  if (cleanAssetId === 3) {
      // If assetId is 3, then we need to check assetHubNativeBalance
      const nativeBal = await assetHubNativeBalance(account_id_32);
      console.log(`AssetHub Native Balance:`, nativeBal);

      // Assuming native balance is provided in the same format, return it
      return {
          free: nativeBal.free,
          reserved: nativeBal.reserved,
          total: nativeBal.total,
          
      };
  }

  // For other assetIds, continue checking balance as before
  const api = await connectToWsEndpoint('assetHub', signal);

  const assetDecimals = await api.query.assets.metadata(cleanAssetId).then((meta: { decimals: any; }) => meta.decimals.toNumber());

  const balance = await api.query.assets.account(cleanAssetId, account_id_32);
  const b3 = balance.toHuman();

  console.log(`checkAssetHubBalance balance`, balance);
  
  if (isAssetHubAssetBalance(b3)) {
      const bal_obj: AssetHubAssetBalance = b3;
      console.log(`checkAssetHubBalance balance object`, bal_obj);
      return {
          free: bal_obj.balance,
          reserved: 0,
          total: bal_obj.balance,
          assetDecimals
      };
  } 

  return { free: 0, reserved: 0, total: 0, assetDecimals };
}

async function assetHubNativeBalance(accountid: string): Promise<{ free: number, reserved: number, total: number }> {
  const api = await connectToWsEndpoint('assetHub');
  const result = await generic_check_native_balance(api, accountid);

      // Compute total by aggregating all balance types
      const total = result.free + result.reserved + result.miscFrozen + result.feeFrozen;
    

  // Assuming generic_check_native_balance returns the balance object as { free, reserved, total }
  console.log(`assetHubNativeBalance:`, result);
  
  return {
    free: result.free,
    reserved: result.reserved,
    total: total
  };
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


async function checkHydraDxAssetBalance(assetid: number | string, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number, frozen?: number, assetDecimals?: number }> {
  console.log(`checkHydraDxAssetBalance accountId`, account_id_32);
  console.log(`checkHydraDxAssetBalance assetId`, assetid);
  console.log('checkHydraDxAssetBalance typeof asset id',typeof assetid);


  // If assetId is 0, fetch the native balance.
  if (assetid === 0 || assetid === "0") {
    return hydraDxNativeBalance(account_id_32);
  }

  let api: any;
  let hdxBalance: any;
  let assetDecimals: number;

  console.log(`checkHydraDxAssetBalance trying to connect`);

  try {
      api = await connectToWsEndpoint('hydraDx', signal);
      hdxBalance = await api.query.tokens.accounts(account_id_32, assetid);
  } catch (error) {
      console.error(`Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`, error);
      return { free: 0, reserved: 0, total: 0 };
  }
  
  const stringBalance = hdxBalance.toHuman();
  console.log(`checkHydraDxAssetBalance Raw HDX Balance:`, stringBalance);

  try {
      // Get the asset's metadata
      const metadata = await api.query.assetRegistry.assetMetadataMap(assetid);

      if (metadata && metadata.__internal__raw && metadata.__internal__raw.decimals) {
        assetDecimals = metadata.__internal__raw.decimals;
      } else {
        throw new Error('Decimals not found in metadata');
      }

      console.log(`checkHydraDxAssetBalance metadata`, metadata);
      console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
      console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
      // You might want to set a default or throw an error here
      assetDecimals = 12; 
  }

  if (isOrmlTokensAccountData(hdxBalance)) {
      const bal_obj: OrmlTokensAccountData = hdxBalance;
      console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
      return {
          free: bal_obj.free,
          reserved: bal_obj.reserved,
          frozen: bal_obj.frozen,
          total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
          assetDecimals
      };
  }

  return { free: 0, reserved: 0, total: 0 };
}


/// returns the raw balance of the native dot token
async function checkPolkadotDotRawNativeBalance(accountId: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  let bal: any;
  let bal3: any;
  if (accountId) {
    const api = await connectToWsEndpoint('polkadot', signal);
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
  const api = await connectToWsEndpoint('rococo', signal);
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
    const api = await connectToWsEndpoint('hydraDx');
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




// generic function to check native account balance
async function generic_check_native_balance(api: ApiPromise, address: string) {
  // convert address to pubkey
 // const accountId = api.createType("account_id_32", address).toHex();
  const bal= await api.query.system.account(address); // Codec type
  const bal3 = await bal.toHuman();
  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;

      return { free: bal3.data.free, reserved: bal3.data.reserved, miscFrozen:  bal3.data.miscFrozen , feeFrozen: bal3.data.feeFrozen} 
        }
    return {free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0};
}

async function hydraDxNativeBalance(address: string): Promise<{ free: number, reserved: number, total: number, frozen?: number }> {
  const api = await connectToWsEndpoint('hydraDx');
  const result = await generic_check_native_balance(api, address);

  // assuming generic_check_native_balance returns an object like:
  // { free: number, reserved: number, miscFrozen: number, feeFrozen: number }
  const total = result.free + result.reserved + (result.miscFrozen || 0) + (result.feeFrozen || 0);

  return {
      free: result.free,
      reserved: result.reserved,
      total: total
      // can include miscFrozen and feeFrozen if they are relevant for hydraDx
  };
}






/// check asset decimals and metadata
interface AssethubAssetMetadata {
  deposit: number;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: boolean;
}

function isAssethubAssetMetadata(obj: any): obj is AssethubAssetMetadata {
return (
  typeof obj === 'object' &&
  obj !== null &&
  'deposit' in obj &&
  'name' in obj &&
  'decimals' in obj &&
  'isFrozen' in obj
      );
}

// get asset metadata 
// output:  {"deposit":"u128","name":"Bytes","symbol":"Bytes","decimals":"u8","isFrozen":"bool"}
async function get_assethub_asset_metadata(assetid: number) {
const api = await connectToWsEndpoint('assetHub');
const quuery = await api.query.asset.metadat(assetid);

if (isAssethubAssetMetadata(quuery)){
  const data: AssethubAssetMetadata = quuery
  return { "deposit": data.deposit, "name": data.name, "symbol": data.symbol, "decimals": data.decimals, "isFrozen": data.isFrozen};
}

return  {"deposit":0 ,"name":"not found","symbol":"NOT FOUND","decimals":0,"isFrozen":false}
}


/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
async function get_hydradx_asset_symbol_decimals(assetid: number){
  const api = await connectToWsEndpoint('hydraDx');
  const resp = (await api.query.assetRegistry.assetMetadataMap(assetid)).toHuman();
  return resp;
}


export async function getAssetBalanceForChain(chain: string, assetId: number, accountId: string, signal?: AbortSignal): Promise<{ free: string, reserved: string, total: string, info: { chain: string, accountId: string, assetId: number, tokenDecimals: number } }> {
  console.log(`getAssetBalanceForChain chain`, chain);
  let assetDecimals: number | undefined;


  const sanitizedAssetId = parseInt(assetId.toString().replace(/,/g, ''), 10);
  let balances: { free: number, reserved: number, total?: number, frozen?: number } | undefined;

  if (signal && signal.aborted) {
    throw new Error('Operation was aborted');
  }

  console.log(`Fetching asset balance for chain: ${chain}, assetId: ${assetId}, accountId: ${accountId}`);

  switch (chain) {
    case "polkadot":
      balances = await checkPolkadotDotRawNativeBalance(accountId, signal);
      break;

    case "hydraDx":
      const hydraBalanceInfo = await checkHydraDxAssetBalance(assetId, accountId, signal);
      balances = hydraBalanceInfo;
      console.log(`getAssetBalanceForChain hydra balanceInfo`, hydraBalanceInfo);
      assetDecimals = hydraBalanceInfo.assetDecimals;  
      console.log(`getAssetBalanceForChain hydra assetDecimals`, assetDecimals);    
    break;

    case "assetHub":
      const assetHubBalanceInfo = await checkAssetHubBalance(assetId, accountId, signal);
      balances = assetHubBalanceInfo;
      console.log(`getAssetBalanceForChain balanceInfo`, assetHubBalanceInfo);
      assetDecimals = assetHubBalanceInfo.assetDecimals;  
      console.log(`getAssetBalanceForChain assetDecimals`, assetDecimals);    
    break;

    case "rococo":
      balances = await checkRococoRocRawNativeBalance(accountId, signal);
      break;

    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }

  const processedBalances = processChainSpecificBalances(chain, balances, assetDecimals);

  const tokenDecimals = getTokenDecimalsByChainName(chain);
  const adjustedTrimmedBalances = {
    free: formatToFourDecimals(processedBalances.free),
    reserved: formatToFourDecimals(processedBalances.reserved),
    total: formatToFourDecimals(processedBalances.total),
    info: {
      chain,
      accountId,
      assetId: sanitizedAssetId,
      tokenDecimals
    }
  };

  return adjustedTrimmedBalances;
}

function processChainSpecificBalances(chain: string, balances: { free: number, reserved: number, total?: number, frozen?: number }, assetDecimals?: number): { free: string, reserved: string, total: string } {
  
  const tokenDecimals = assetDecimals || getTokenDecimalsByChainName(chain);
console.log(`processChainSpecificBalances tokenDecimals`, tokenDecimals);
  let freeInUnits: number;
  let reservedInUnits: number;
  let totalInUnits: number;
  let balanceInfo: any;


  switch (chain) {
    case "polkadot":
      // Processing logic specific to Polkadot (if different from default)
      freeInUnits = toUnit(balances.free, tokenDecimals);
      reservedInUnits = toUnit(balances.reserved, tokenDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    case "hydraDx":
      // Process balances for HydraDx
      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(balances.reserved, assetDecimals || tokenDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
      break;
      
    case "assetHub":
      // Process balances for assetHub

      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(balances.reserved, assetDecimals || tokenDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    default:
      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(balances.reserved, assetDecimals || tokenDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
  }

  const adjustedBalances = {
    free: formatToFourDecimals(freeInUnits.toString()),
    reserved: formatToFourDecimals(reservedInUnits.toString()),
    total: formatToFourDecimals(totalInUnits.toString()),
  };

 
  return adjustedBalances;
}



// get the system account balance in a generic way
export async function genericRawNativeBalance(api: ApiPromise,accountId: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  let bal: any;
  let bal3: any;
  if (accountId) {
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