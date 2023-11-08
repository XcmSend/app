import { getApiInstance } from "../api/connect";
import endpoints from "../api/WsEndpoints";


// Swap functionality 
/// put in a sell order to sell/swap asset A for asset B on omnipool
/// Input:
/// assetin = asset you have on your account
/// assetout = asset you want to swap to
/// amount = amount of assetin you want to swap to assetout
/// minBuyAmount = minimum amount to buy, note: tx will fail if this is set to 0 or to low
export async function hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number) {
	const api = await getApiInstance(endpoints.polkadot.hydraDx);
	const tx = await api.tx.omnipool.sell(
		assetin,
		assetout, 
		amount,
		minBuyAmount
	);
		return tx;
}