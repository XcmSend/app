import { ApiPromise, WsProvider } from '@polkadot/api';
import { TradeRouter, CachingPoolService, PoolType } from '@galacticcouncil/sdk';

import connectToWsEndpoint from '../api/connect';
import endpoints from '../api/WsEndpoints';

let tradeRouter: { getAllAssets: () => any; getBestSpotPrice: (arg0: string, arg1: string) => any; getBestSell: (arg0: string, arg1: string, arg2: number) => any; };

async function initializeTradeRouter() {
  const api = await connectToWsEndpoint('hydraDx');

  console.log(`getHydraDx Initializing PoolService...`);
  const poolService = new CachingPoolService(api);

  console.log(`getHydraDx Initializing TradeRouter...`);
  tradeRouter = await new TradeRouter(poolService, { includeOnly: [PoolType.Omni] });
// console.log(`getHydraDx TradeRouter:`, tradeRouter);

  const result = await tradeRouter.getAllAssets();
console.log(`getHydraDx All assets:`, result);
}

export async function getHydraDxSpotPrice(assetIn: string, assetOut: string) {
  if (!tradeRouter) {
    await initializeTradeRouter();
  }
  const spotPrice = await tradeRouter.getBestSpotPrice(assetIn, assetOut);
  console.log(`getHydraDx Spot price for ${assetIn} to ${assetOut}: ${JSON.stringify(spotPrice, null, 2)}`);

  return spotPrice.toString();
}

export async function getHydraDxSellPrice(assetIn: string, assetOut: string, amount: number) {
  console.log(`getHydraDx Getting selling details...`);
  if (!tradeRouter) {
    console.log(`getHydraDx Initializing TradeRouter in teh getHydraDxSell function...`);
    await initializeTradeRouter();
  }

  console.log(`getHydraDx Getting selling details...`);

  const tradeDetails = await tradeRouter.getBestSell(assetIn, assetOut, amount);
  console.log(`getHydraDx trade details:`, tradeDetails.toHuman());

  return tradeDetails.toHuman();
}
