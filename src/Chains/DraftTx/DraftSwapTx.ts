import { getApiInstance } from "../api/connect";
import endpoints from "../api/WsEndpoints";
import { getAssetDecimals } from "../../Chains/Helpers/AssetHelper";
import {
  getHydraDxSpotPrice,
  getHydraDxSellPrice,
  hdx_get_routes,
} from "../Helpers/PriceHelper";

interface HydradxAssetSymbolDecimalsResponse {
  name: string;
  assetType: string;
  existentialDeposit: string;
  symbol: string;
  decimals: number;
  xcmRateLimit: null | any; // You can specify a more precise type if known
  isSufficient: boolean;
}

export async function getHydradxAssetSymbolDecimals(
  assetid: number,
): Promise<HydradxAssetSymbolDecimalsResponse> {
  console.log(`getHydradxAssetSymbolDecimals assetid`, assetid);
  const api = await getApiInstance("hydraDx");
  const resp = (await api.query.assetRegistry.assets(assetid)).toHuman() as any;
  const assetInfo: HydradxAssetSymbolDecimalsResponse = {
    name: resp.name,
    assetType: resp.assetType,
    existentialDeposit: resp.existentialDeposit,
    symbol: resp.symbol,
    decimals: parseInt(resp.decimals),
    xcmRateLimit: resp.xcmRateLimit,
    isSufficient: resp.isSufficient,
  };
  return assetInfo;
}
// Swap functionality | THIS SUPPORTS ALL SWAPS ON HYDRA NOT ONLY OMNIPOOL SELL!! // FLIPCHAN
/// put in a sell order to sell/swap asset A for asset B on omnipool
/// Input:
/// assetin = asset you have on your account
/// assetout = asset you want to swap to
/// amount = amount of assetin you want to swap to assetout
/// minBuyAmount = swap price
export async function hydradx_omnipool_sell(
  assetin: string,
  assetout: string,
  rawamount: number,
  submitamount: number,
) {
  const api = await getApiInstance("hydraDx");
  const pinfo = await getHydraDxSellPrice(assetin, assetout, rawamount);

  const aout = pinfo.amountOut;

  //const aout = sellprice.amountOut;
  const resp: any = await getHydradxAssetSymbolDecimals(Number(assetin));

  const tokenDecimals = Number(resp.decimals);
  const minBuyAmount = BigInt(Math.round(aout * 1e10));
  console.log(
    `[hydradx_omnipool_sell] my input:`,
    assetin,
    assetout,
    rawamount,
    minBuyAmount,
    submitamount,
  );

  const route = await hdx_get_routes(assetin, assetout, rawamount);
  var tx: any;
  console.log(`working with: `, assetin, assetout, submitamount);
  console.log(`got route back: `, route);
  if (route.length == 1) {
    console.log(`route log`);
    console.log(route[0]);
    if (route[0].pool == "Omnipool") {
      console.log(`omnipool only detected`);
      tx = api.tx.omnipool.sell(assetin, assetout, submitamount, minBuyAmount);
      console.log(`omnipool tx drafted`);
      console.log(tx.toHex());
    }
  } else {
    tx = await api.tx.omnipool.sell(
      assetin.toString(),
      assetout.toString(),
      submitamount.toString(),
      minBuyAmount / BigInt(10000),
      // TODO: fix router,
    );
    console.log(`selltx router.sell drafted`);
  }
  console.log(`final tx:`);
  console.log(tx.toHuman());
  console.log(tx.toHex());

  return tx;
}
