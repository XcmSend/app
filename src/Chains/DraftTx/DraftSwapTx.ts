import { getApiInstance } from "../api/connect";
import endpoints from "../api/WsEndpoints";
import { getHydradxAssetSymbolDecimals } from "../../Chains/Helpers/AssetHelper";
import {
  getHydraDxSpotPrice,
  getHydraDxSellPrice,
  hdx_get_routes,
} from "../Helpers/PriceHelper";

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

// two options for swaps, omnipool sell or router sell
    console.log(`sorting out the route`);
// get the swap routes 
  const route = await hdx_get_routes(assetin, assetout, rawamount);
    var tx: any;

  console.log(`got route back: `, route);
  if (route.length == 1) {
    console.log(`route log`);
    console.log(route[0]);
    if (route[0].pool == 'Omnipool') {
        console.log(`omnipool only detected`);
        tx = await api.tx.omnipool.sell(
          assetin,
          assetout,
          submitamount,
          minBuyAmount
        );
        console.log(`omnipool tx drafted`);
        console.log(tx.toHex());
    }



} else {
    tx = await api.tx.router.sell(
        assetin.toString(),
        assetout.toString(),
        submitamount.toString(),
        minBuyAmount/10000, 
        route
        );
    console.log(`selltx router.sell drafted`);

}
console.log(`final tx:`);
console.log(tx.toHuman())
console.log(tx.toHex());

  return tx;
}
