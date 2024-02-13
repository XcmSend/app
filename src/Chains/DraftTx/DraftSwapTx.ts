import { getApiInstance } from "../api/connect";
import endpoints from "../api/WsEndpoints";
import { getHydradxAssetSymbolDecimals } from "../../Chains/Helpers/AssetHelper";
import {
  getHydraDxSpotPrice,
  getHydraDxSellPrice,
} from "../Helpers/PriceHelper";

// Swap functionality
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
  submitamount: number
) {
  const api = await getApiInstance("hydraDx");
  const pinfo = await getHydraDxSellPrice(assetin, assetout, rawamount);
  const aout = pinfo.amountOut;

  //const aout = sellprice.amountOut;
  const resp: any = await getHydradxAssetSymbolDecimals(Number(assetin));

  const tokenDecimals = Number(resp.decimals);
  const minBuyAmount = Math.round(aout * 1e10);
  console.log(
    `[hydradx_omnipool_sell] my input:`,
    assetin,
    assetout,
    rawamount,
    minBuyAmount,
    submitamount
  );
  const tx = await api.tx.omnipool.sell(
    assetin,
    assetout,
    submitamount,
    minBuyAmount
  );
  return tx;
}
