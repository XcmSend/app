//@ts-nocheck
import { getApiInstance } from "../api/connect";
import { ChainInfo, listChains } from "../ChainsInfo";
import {
  listHydraDxAssets,
  list_onchainassets,
  listInterlayAssets,
} from "../Assets/listAssetsForChain";
import {
  adjustBalance,
  parseBalanceString,
  formatToFourDecimals,
  toUnit,
} from "../utils/utils";
import { ApiPromise } from "@polkadot/api";
import { string } from "slate";
import { getRawAddress } from "../DraftTx/DraftxTransferTx";
import { Asset } from "@galacticcouncil/sdk";
import { Outlet } from "react-router-dom";
import { get_hydradx_asset_symbol_decimals } from "../Helpers/AssetHelper";

interface BaseBalance {
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
}

interface AssetResponseBalance extends BaseBalance {
  miscFrozen: number;
  feeFrozen: number;
}

interface AssetMetadata {
  symbol: string;
  decimals: number;
}

// For types with unique properties, extend the base type
interface AssetHubAssetBalance extends BaseBalance {
  status: string;
  reason: string;
  extra: string;
  decimals?: number;
}

interface AssetBalanceInfo extends BaseBalance {
  assetDecimals?: number;
  chain: string;
  accountId: string;
  assetId: number;
}

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
    typeof obj === "object" &&
    obj !== null &&
    "nonce" in obj &&
    "consumers" in obj &&
    "providers" in obj &&
    "sufficients" in obj &&
    "data" in obj
  );
}

/// convert assethub's asset balance response
interface AssetHubAssetBalance {
  balance: number;
  status: string;
  reason: string;
  extra: string;
  decimals?: number;
}

// moonriver assets pallet

function isAssetHubAssetBalance(obj: any): obj is AssetHubAssetBalance {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "balance" in obj &&
    "status" in obj &&
    "reason" in obj &&
    "extra" in obj
  );
}

export async function checkmangataxAssetBalance(
  assetid: number | string,
  account_id: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
  assetDecimals?: number;
}> {
  // If assetId is 0, fetch the native balance.
  //if (assetid === 0 || assetid === "0") {
  // return hydraDxNativeBalance(account_id_32);
  // }

  let api: any;
  let hdxBalance: any;
  let assetDecimals: number;

  const account_id_32 = getRawAddress(account_id);
  try {
    const asset = {
      foreignasset: assetid,
    };
    api = await getApiInstance("mangatax", signal);
    hdxBalance = await api.query.tokens.accounts(account_id_32, asset);
  } catch (error) {
    console.error(
      `Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`,
      error
    );
    return { free: 0, reserved: 0, total: 0 };
  }

  const stringBalance = hdxBalance.toHuman();
  //  console.log(`checkHydraDxAssetBalance Raw HDX Balance:`, stringBalance);

  try {
    const assetlist = listInterlayAssets();

    const assetWithAssetId2 = assetlist.find(
      (asset) => asset.assetId === assetid.toString()
    );
    const decimals = parseInt(assetWithAssetId2.asset.decimals, 10);

    assetDecimals = decimals;

    //    console.log(`checkHydraDxAssetBalance metadata`, metadata);
    //   console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
    console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
    // You might want to set a default or throw an error here
    assetDecimals = 12;
  }

  if (isOrmlTokensAccountData(hdxBalance)) {
    const bal_obj: OrmlTokensAccountData = hdxBalance;
    //  console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
    return {
      free: bal_obj.free,
      reserved: bal_obj.reserved,
      frozen: bal_obj.frozen,
      total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

/// check the balance of an asset on interlay
/// returns { free: '304', reserved: '0', frozen: '0' }
export async function checkInterlayAssetBalance(
  assetid: number | string,
  account_id: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
  assetDecimals?: number;
}> {
  // If assetId is 0, fetch the native balance.
  //if (assetid === 0 || assetid === "0") {
  // return hydraDxNativeBalance(account_id_32);
  // }

  let api: any;
  let hdxBalance: any;
  let assetDecimals: number;

  const account_id_32 = getRawAddress(account_id);
  try {
    const asset = {
      foreignasset: assetid,
    };
    api = await getApiInstance("interlay", signal);
    hdxBalance = await api.query.tokens.accounts(account_id_32, asset);
  } catch (error) {
    console.error(
      `Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`,
      error
    );
    return { free: 0, reserved: 0, total: 0 };
  }

  const stringBalance = hdxBalance.toHuman();
  //  console.log(`checkHydraDxAssetBalance Raw HDX Balance:`, stringBalance);

  try {
    const assetlist = listInterlayAssets();

    const assetWithAssetId2 = assetlist.find(
      (asset) => asset.assetId === assetid.toString()
    );
    const decimals = parseInt(assetWithAssetId2.asset.decimals, 10);

    assetDecimals = decimals;

    //    console.log(`checkHydraDxAssetBalance metadata`, metadata);
    //    console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
    console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
    // You might want to set a default or throw an error here
    assetDecimals = 12;
  }

  if (isOrmlTokensAccountData(hdxBalance)) {
    const bal_obj: OrmlTokensAccountData = hdxBalance;
    //  console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
    return {
      free: bal_obj.free,
      reserved: bal_obj.reserved,
      frozen: bal_obj.frozen,
      total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

// check asset balance on polkadot assethub
export async function checkAssetHubBalance(
  assetid: number,
  account_id_32: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  assetDecimals?: number;
}> {
  let cleanAssetId = parseInt(assetid.toString().replace(/,/g, ""), 10);
  // console.log(`checkAssetHubBalance accountId`, account_id_32);
  if (cleanAssetId === 1000) {
    // If assetId is 3, then we need to check assetHubNativeBalance
    const nativeBal = await assetHubNativeBalance(account_id_32);
    //  console.log(`AssetHub Native Balance:`, nativeBal);
    // Assuming native balance is provided in the same format, return it
    return {
      free: nativeBal.free,
      reserved: nativeBal.reserved,
      total: nativeBal.total,
    };
  }

  // For other assetIds, continue checking balance as before
  const api = await getApiInstance("assetHub", signal);
  const assetDecimals = await api.query.assets
    .metadata(cleanAssetId)
    .then((meta: { decimals: any }) => meta.decimals.toNumber());
  const balance = await api.query.assets.account(cleanAssetId, account_id_32);
  const b3 = balance.toHuman();

  //console.log(`checkAssetHubBalance balance`, balance);

  if (isAssetHubAssetBalance(b3)) {
    const bal_obj: AssetHubAssetBalance = b3;
    // console.log(`checkAssetHubBalance balance object`, bal_obj);
    return {
      free: bal_obj.balance,
      reserved: 0,
      total: bal_obj.balance,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0, assetDecimals };
}

export async function assetHubNativeBalance(
  accountid: string
): Promise<{ free: number; reserved: number; total: number }> {
  const api = await getApiInstance("assetHub");
  const result = await generic_check_native_balance(api, accountid);
  // Compute total by aggregating all balance types
  const total =
    result.free + result.reserved + result.miscFrozen + result.feeFrozen;
  // Assuming generic_check_native_balance returns the balance object as { free, reserved, total }
  // console.log(`assetHubNativeBalance:`, result);

  return {
    free: result.free,
    reserved: result.reserved,
    total: total,
  };
}

interface OrmlTokensAccountData {
  free: number;
  reserved: number;
  frozen: number;
}

function isOrmlTokensAccountData(obj: any): obj is OrmlTokensAccountData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "free" in obj &&
    "reserved" in obj &&
    "frozen" in obj
  );
}
export async function checkBalance(
  chain: string,
  assetid: number | string,
  account_id_32: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
  assetDecimals?: number;
}> {
  // If assetId is 0, fetch the native balance.
  if (assetid === null || assetid === 0 || assetid === "0") {
    const api7 = await getApiInstance(chain);

    const result = await generic_check_native_balance(api7, account_id_32);
    const total =
      result.free +
      result.reserved +
      (result.miscFrozen || 0) +
      (result.feeFrozen || 0);

    return {
      free: result.free,
      reserved: result.reserved,
      total: total,
      // can include miscFrozen and feeFrozen if they are relevant for hydraDx
    };
  }

  let api: any;
  let chainBalance: any;
  let assetDecimals: number;

  // console.log(`checkBalance trying to connect`);

  try {
    api = await getApiInstance(chain, signal);
    console.log(`checkBalance api`, api);
    chainBalance = await api.query.tokens.accounts(account_id_32, assetid);
  } catch (error) {
    console.error(
      `Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`,
      error
    );
    return { free: 0, reserved: 0, total: 0 };
  }

  const stringBalance = chainBalance.toHuman();
  console.log(`checkBalance Raw Balance:`, stringBalance);

  try {
    // Get the asset's metadata
    const metadataRaw = await api.query.assetRegistry.metadata(assetid);
    console.log(`checkBalance metadataRaw`, metadataRaw);
    const metadata = metadataRaw.toString();
    console.log(`checkBalance metadata`, metadata);

    if (
      metadata &&
      metadata.__internal__raw &&
      metadata.__internal__raw.decimals
    ) {
      assetDecimals = metadata.__internal__raw.decimals;
    } else {
      throw new Error("Decimals not found in metadata");
    }
    //    console.log(`checkHydraDxAssetBalance metadata`, metadata);
    //   console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
    console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
    // You might want to set a default or throw an error here
    assetDecimals = 12;
  }

  if (isOrmlTokensAccountData(chainBalance)) {
    const bal_obj: OrmlTokensAccountData = chainBalance;
    //  console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
    return {
      free: bal_obj.free,
      reserved: bal_obj.reserved,
      frozen: bal_obj.frozen,
      total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

export async function checkTuringAssetBalance(
  assetid: number | string,
  account_id_32: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
  assetDecimals?: number;
}> {
  // If assetId is 0, fetch the native balance.
  if (assetid === 0 || assetid === "0") {
    const api7 = await getApiInstance("turing");

    const result = await generic_check_native_balance(api7, account_id_32);
    const total =
      result.free +
      result.reserved +
      (result.miscFrozen || 0) +
      (result.feeFrozen || 0);

    return {
      free: result.free,
      reserved: result.reserved,
      total: total,
      // can include miscFrozen and feeFrozen if they are relevant for hydraDx
    };
  }

  let api: any;
  let turingBalance: any;
  let assetDecimals: number;

  // console.log(`checkTuringAssetBalance trying to connect`);

  try {
    api = await getApiInstance("turing", signal);
    turingBalance = await api.query.tokens.accounts(account_id_32, assetid);
  } catch (error) {
    console.error(
      `Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`,
      error
    );
    return { free: 0, reserved: 0, total: 0 };
  }

  const stringBalance = turingBalance.toHuman();
  console.log(`checkTuringAssetBalance Raw TUR Balance:`, stringBalance);

  try {
    // Get the asset's metadata
    const metadata = await api.query.assetRegistry.metadata(assetid);

    if (
      metadata &&
      metadata.__internal__raw &&
      metadata.__internal__raw.decimals
    ) {
      assetDecimals = metadata.__internal__raw.decimals;
    } else {
      throw new Error("Decimals not found in metadata");
    }
    //    console.log(`checkHydraDxAssetBalance metadata`, metadata);
    //   console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
    console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
    // You might want to set a default or throw an error here
    assetDecimals = 12;
  }

  if (isOrmlTokensAccountData(turingBalance)) {
    const bal_obj: OrmlTokensAccountData = turingBalance;
    //  console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
    return {
      free: bal_obj.free,
      reserved: bal_obj.reserved,
      frozen: bal_obj.frozen,
      total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

export async function checkDOT_assetHub_kusama(account_id_32: string): {
  balance: number;
  free: number;
  total: number;
  status: string;
  assetDecimals?: number;
  reason?: string;
  extra?: string;
} {
  const api = await getApiInstance("assetHub_kusama");

  const accountid = getRawAddress(account_id_32);
  const foreignAssetAccount = await api.query.foreignAssets.account(
    { parents: 2, interior: { X1: { GlobalConsensus: "Polkadot" } } },
    accountid
  );
  const resp = foreignAssetAccount.toHuman();
  return {
    balance: resp.balance,
    free: resp.balance,
    total: resp.balance,
    status: resp.status,
    assetDecimals: 12,
  };
}

export async function checkHydraDxAssetBalance(
  assetid: number | string,
  account_id_32: string,
  signal?: AbortSignal
): Promise<{
  free: number;
  reserved: number;
  total: number;
  frozen?: number;
  assetDecimals?: number;
}> {
  // console.log(`checkHydraDxAssetBalance accountId`, account_id_32);
  // console.log(`checkHydraDxAssetBalance assetId`, assetid);
  // console.log('checkHydraDxAssetBalance typeof asset id',typeof assetid);

  // If assetId is 0, fetch the native balance.
  if (assetid === 0 || assetid === "0") {
    return hydraDxNativeBalance(account_id_32);
  }

  let api: any;
  let hdxBalance: any;
  let assetDecimals: number;

  // console.log(`checkHydraDxAssetBalance trying to connect`);

  try {
    api = await getApiInstance("hydraDx", signal);
    hdxBalance = await api.query.tokens.accounts(account_id_32, assetid);
  } catch (error) {
    console.error(
      `Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`,
      error
    );
    return { free: 0, reserved: 0, total: 0 };
  }

  const stringBalance = hdxBalance.toHuman();
  //  console.log(`checkHydraDxAssetBalance Raw HDX Balance:`, stringBalance);

  try {
    // Get the asset's metadata
    const metadata = await api.query.assetRegistry.assets(assetid);

    if (
      metadata &&
      metadata.__internal__raw &&
      metadata.__internal__raw.decimals
    ) {
      assetDecimals = metadata.__internal__raw.decimals;
    } else {
      throw new Error("Decimals not found in metadata");
    }
    //    console.log(`checkHydraDxAssetBalance metadata`, metadata);
    //   console.log(`checkHydraDxAssetBalance assetDecimals`, assetDecimals);
  } catch (error) {
    console.error(`Error retrieving metadata for asset ID ${assetid}:`, error);
    // You might want to set a default or throw an error here
    assetDecimals = 12;
  }

  if (isOrmlTokensAccountData(hdxBalance)) {
    const bal_obj: OrmlTokensAccountData = hdxBalance;
    //  console.log(`checkHydraDxAssetBalance bal obj`, bal_obj.toString());
    return {
      free: bal_obj.free,
      reserved: bal_obj.reserved,
      frozen: bal_obj.frozen,
      total: bal_obj.free + bal_obj.reserved + bal_obj.frozen,
      assetDecimals,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

export function get_moonbeam_asset_decimals(assetid: string) {
  const assetobj = list_onchainassets("moonbeam");
  var decimals = 0;
  for (const x of assetobj) {
    if (x.assetId === assetid) {
      console.log(`assetobj| found asset: `, x);
      decimals = parseInt(x.asset.decimals, 10);
    }
  }
  return decimals;
}

// input 0x eth account
export async function check_moonbeam(accounteth: string, dassetid: string) {
  const api = await getApiInstance("moonbeam");
  const assetobj = list_onchainassets("moonbeam");
  console.log(`assetobj: `, assetobj);
  var decimals = 0;
  for (const x of assetobj) {
    if (x.assetId === dassetid) {
      console.log(`assetobj| found asset: `, x);
      decimals = parseInt(x.asset.decimals, 10);
    }
  }
  //const decimals = assetobj.find(assetobj => assetobj.assetId == assetid).asset.decimals;
  const assetid = dassetid.replace(/,/g, "");
  console.log(`moonbeam balance check: `, accounteth, assetid, decimals);
  const balance = await api.query.assets.account(assetid, accounteth);
  const b3 = balance.toHuman();
  console.log(`checking moonbeam: `, b3);
  if (isAssetHubAssetBalance(b3)) {
    const bal_obj: AssetHubAssetBalance = b3;
    return {
      free: bal_obj.balance,
      decimals: parseInt(decimals, 10),
      reserved: 0,
    };
  }
  console.log(`moonbeam returning 0`);
  return {
    free: 0,
    reserved: 0,
    decimals: 0,
  };
}

// input 0x eth account
export async function check_tur_on_moonriver(accounteth: string) {
  const tur_assetid = "133300872918374599700079037156071917454";
  const api = await getApiInstance("moonriver");
  const balance = await api.query.assets.account(tur_assetid, accounteth);
  const b3 = balance.toHuman();

  // console.log(`check moonriver Balance balance`, balance);

  if (isAssetHubAssetBalance(b3)) {
    const bal_obj: AssetHubAssetBalance = b3;
    //  console.log(`check moonriver Balance balance object`, bal_obj);
    return {
      free: bal_obj.balance,
      reserved: 0,
    };
  }
  console.log(`moonriver returning 0`);
  return {
    free: 0,
    reserved: 0,
  };
}

/// returns the raw balance of the native dot token
export async function checkRelayRawNativeBalance(
  chain: string,
  accountId: string,
  signal?: AbortSignal
): Promise<{ free: number; reserved: number; total: number }> {
  let bal: any;
  let bal3: any;
  if (accountId) {
    const api = await getApiInstance(chain, signal);
    bal = await api.query.system.account(accountId);
  }
  bal3 = bal.toHuman();

  if (isAssetResponseObject(bal3)) {
    const bal2: AssetResponseObject = bal3;
    return {
      free: bal2.data.free,
      reserved: bal2.data.reserved,
      total: bal2.data.total,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}

/// returns the raw balance of the native dot token
async function checkRococoRocRawNativeBalance(
  accountid: string,
  signal?: AbortSignal
): Promise<{ free: number; reserved: number; total: number }> {
  const api = await getApiInstance("rococo", signal);
  const bal = await api.query.system.account(accountid);
  const bal3 = bal.toHuman();
  if (isAssetResponseObject(bal3)) {
    const bal2: AssetResponseObject = bal3;
    return {
      free: bal2.data.free,
      reserved: bal2.data.reserved,
      total: bal2.data.total,
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
export async function getAssetDecimals(chain: string, assetid: number) {
  console.log(`getAssetDecimals assetid`, assetid);
  const api = await getApiInstance(chain);
  const resp = (await api.query.assetRegistry.assets(assetid)).toHuman();
  return resp;
}

export function getTokenDecimalsByChainName(chainName: string): number {
  const chainList = listChains();
  const selectedChain = Object.values(chainList).find(
    (chain) => chain.name === chainName
  );
  if (!selectedChain) {
    throw new Error(`Chain not found: ${chainName}`);
  }
  return selectedChain.token_decimals;
}

export async function getTokenDecimalsByAssetName(assetId: string): number {
  // const chainList = listHydraDxAssets();
  // nd(
  //   (asset) => asset.id === assetName
  // );
  // if (!selectedAsset) {
  //   throw new Error(`Chain not found: ${assetName}`);
  // }
  const asset = await get_hydradx_asset_symbol_decimals(assetId);
  console.log(" getTokenDecimalsByAssetName Asset Decimals", asset);
  // const selectedAsset = Object.values(chainList).fi
  return Number(asset.decimals);
}

// generic function to check native account balance
async function generic_check_native_balance(api: ApiPromise, address: string) {
  // convert address to pubkey
  // const accountId = api.createType("account_id_32", address).toHex();
  const bal = await api.query.system.account(address); // Codec type
  const bal3 = bal.toHuman();
  if (isAssetResponseObject(bal3)) {
    return {
      free: bal3.data.free,
      reserved: bal3.data.reserved,
      miscFrozen: bal3.data.miscFrozen,
      feeFrozen: bal3.data.feeFrozen,
    };
  }
  return { free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0 };
}

async function hydraDxNativeBalance(
  address: string
): Promise<{ free: number; reserved: number; total: number; frozen?: number }> {
  const api = await getApiInstance("hydraDx");
  const result = await generic_check_native_balance(api, address);

  // assuming generic_check_native_balance returns an object like:
  // { free: number, reserved: number, miscFrozen: number, feeFrozen: number }
  const total =
    result.free +
    result.reserved +
    (result.miscFrozen || 0) +
    (result.feeFrozen || 0);

  return {
    free: result.free,
    reserved: result.reserved,
    total: total,
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
    typeof obj === "object" &&
    obj !== null &&
    "deposit" in obj &&
    "name" in obj &&
    "decimals" in obj &&
    "isFrozen" in obj
  );
}

// get asset metadata
// output:  {"deposit":"u128","name":"Bytes","symbol":"Bytes","decimals":"u8","isFrozen":"bool"}
async function get_assethub_asset_metadata(assetid: number) {
  const api = await getApiInstance("assetHub");
  const quuery = await api.query.asset.metadat(assetid);

  if (isAssethubAssetMetadata(quuery)) {
    const data: AssethubAssetMetadata = quuery;
    return {
      deposit: data.deposit,
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      isFrozen: data.isFrozen,
    };
  }

  return {
    deposit: 0,
    name: "not found",
    symbol: "NOT FOUND",
    decimals: 0,
    isFrozen: false,
  };
}

/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
export async function get_hydradx_asset_symbol_decimals(assetid: number) {
  const api = await getApiInstance("hydraDx");
  const resp: any = (await api.query.assetRegistry.assets(assetid)).toHuman();
  return resp;
}

// Utility function to format balance
function formatBalance(balance: number, decimals: number = 4): string {
  return balance.toFixed(decimals);
}

export async function getAssetBalanceForChain(
  chain: string,
  assetId?: number,
  accountId: string,
  signal?: AbortSignal
): Promise<AssetBalanceInfo> {
  console.log(`getAssetBalanceForChain chain`, chain);
  let assetDecimals: number | undefined;
  console.log(
    `getAssetBalanceForChain assetId, accountId: `,
    chain,
    assetId,
    accountId
  );
  var sanitizedAssetId: number;
  if (chain == "moonriver" || chain == "moonbeam") {
    sanitizedAssetId = assetId;
  } else {
    sanitizedAssetId = parseInt(assetId.toString().replace(/,/g, ""), 10);
  }

  let balances:
    | { free: number; reserved: number; total?: number; frozen?: number }
    | undefined;

  if (signal && signal.aborted) {
    throw new Error("Operation was aborted");
  }

  console.log(
    `Fetching asset balance for chain: ${chain}, assetId: ${assetId}, accountId: ${accountId}`
  );

  switch (chain) {
    case "polkadot":
      balances = await checkRelayRawNativeBalance(
        "polkadot",
        accountId,
        signal
      );
      break;

    case "kusama":
      balances = await checkRelayRawNativeBalance("kusama", accountId, signal);
      break;

    case "hydraDx":
      const hydraBalanceInfo = await checkHydraDxAssetBalance(
        assetId,
        accountId,
        signal
      );
      balances = hydraBalanceInfo;
      console.log(
        `getAssetBalanceForChain hydra balanceInfo`,
        hydraBalanceInfo
      );
      assetDecimals = hydraBalanceInfo.assetDecimals;
      console.log(`getAssetBalanceForChain hydra assetDecimals`, assetDecimals);
      break;

    case "interlay":
      balances = await checkInterlayAssetBalance(assetId, accountId);
      assetDecimals = balances.assetDecimals;
      break;

    case "turing":
      console.log(`checkBalance turing check tur!`, assetId);
      balances = await checkBalance(chain, assetId, accountId);
      assetDecimals = balances.assetDecimals;
      break;

    case "assetHub_kusama":
      console.log(`assetHub_kusama detected`);
      balances = await checkDOT_assetHub_kusama(accountId);
      //  console.log(`returning:`, balances);
      break;

    case "moonbeam":
      console.log(`moonbeam checking`);
      balances = await check_moonbeam(accountId, assetId);
      console.log(`moonbeam balances: `, balances);
      assetDecimals = balances.decimals;
      break;

    case "moonriver":
      console.log(`moonriver check tur!`);
      balances = await check_tur_on_moonriver(accountId);
      assetDecimals = 10;
      break;

    case "assetHub":
      const assetHubBalanceInfo = await checkAssetHubBalance(
        assetId,
        accountId,
        signal
      );
      balances = assetHubBalanceInfo;
      //     console.log(`getAssetBalanceForChain balanceInfo`, assetHubBalanceInfo);
      assetDecimals = assetHubBalanceInfo.assetDecimals;
      //     console.log(`getAssetBalanceForChain assetDecimals`, assetDecimals, balances);
      break;

    case "rococo":
      balances = await checkRococoRocRawNativeBalance(accountId, signal);
      break;

    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }

  const processedBalances: BaseBalance = processChainSpecificBalances(
    chain,
    balances,
    assetDecimals
  );

  const tokenDecimals = getTokenDecimalsByChainName(chain);
  const adjustedTrimmedBalances = {
    free: formatToFourDecimals(processedBalances.free),
    reserved: formatToFourDecimals(processedBalances.reserved),
    total: formatToFourDecimals(processedBalances.total),
    info: {
      chain,
      accountId,
      assetId: sanitizedAssetId,
      tokenDecimals,
    },
  };

  return adjustedTrimmedBalances;
}

function processChainSpecificBalances(
  chain: string,
  balances: BaseBalance,
  assetDecimals?: number
): { free: string; reserved: string; total: string } {
  const tokenDecimals = assetDecimals || getTokenDecimalsByChainName(chain);
  console.log(`processChainSpecificBalances tokenDecimals`, tokenDecimals);
  let freeInUnits: number;
  let reservedInUnits: number;
  let totalInUnits: number;
  let balanceInfo: any;

  console.log(`going to switch`);
  switch (chain) {
    case "polkadot":
      // Processing logic specific to Polkadot (if different from default)
      freeInUnits = toUnit(balances.free, tokenDecimals);
      reservedInUnits = toUnit(balances.reserved, tokenDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    case "moonbeam":
      console.log(`moonbeam checker: `, balances);
      // Process balances for HydraDx

      freeInUnits = toUnit(balances.free, assetDecimals);
      reservedInUnits = toUnit(balances.reserved, assetDecimals);
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    case "hydraDx":
      // Process balances for HydraDx
      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(
        balances.reserved,
        assetDecimals || tokenDecimals
      );
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    case "interlay":
      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(
        balances.reserved,
        assetDecimals || tokenDecimals
      );
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    case "assetHub_kusama":
      // console.log(`kusama assethub assethelper`);
      freeInUnits = toUnit(balances.free, 10);
      reservedInUnits = 0;
      totalInUnits = freeInUnits;
      break;

    case "assetHub":
      // Process balances for assetHub

      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(
        balances.reserved,
        assetDecimals || tokenDecimals
      );
      totalInUnits = freeInUnits + reservedInUnits;
      break;

    default:
      freeInUnits = toUnit(balances.free, assetDecimals || tokenDecimals);
      reservedInUnits = toUnit(
        balances.reserved,
        assetDecimals || tokenDecimals
      );
      totalInUnits = freeInUnits + reservedInUnits;
  }
  console.log(`okayy`);
  const adjustedBalances = {
    free: formatToFourDecimals(freeInUnits.toString()),
    reserved: formatToFourDecimals(reservedInUnits.toString()),
    total: formatToFourDecimals(totalInUnits.toString()),
  };

  return adjustedBalances;
}

// get the system account balance in a generic way
export async function genericRawNativeBalance(
  api: ApiPromise,
  accountId: string,
  signal?: AbortSignal
): Promise<{ free: number; reserved: number; total: number }> {
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
      total: bal2.data.total,
    };
  }
  return { free: 0, reserved: 0, total: 0 };
}
