import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  TradeRouter,
  CachingPoolService,
  PoolType,
} from "@galacticcouncil/sdk";

import { getApiInstance } from "../api/connect";
import endpoints from "../api/WsEndpoints";

///let tradeRouter: { getAllAssets: () => any; getBestSpotPrice: (tokenIn: string, tokenOut: string) => any; getBestSell: (tokenIn: string, tokenOut: string, amountIn:  number | string) => any; };

let tradeRouter: any;

async function initializeTradeRouter() {
  const api = await getApiInstance("hydraDx");

  console.log(`getHydraDx Initializing PoolService...`);
  const poolService = new CachingPoolService(api);

  console.log(`getHydraDx Initializing TradeRouter...`);
  tradeRouter = await new TradeRouter(poolService, {
    includeOnly: [PoolType.Omni],
  });
  console.log(`getHydraDx TradeRouter:`, tradeRouter);
  console.log(`getting results..`);
  const result = await tradeRouter.getAllAssets();
  console.log(`getHydraDx All assets:`, result);
}

export async function getHydraDxSpotPrice(assetIn: string, assetOut: string) {
  if (!tradeRouter) {
    await initializeTradeRouter();
  }
  console.log(`got trade router`);
  console.log(`calling getBestSpotPrice`);
  const spotPrice = await tradeRouter.getBestSpotPrice(assetIn, assetOut);
  console.log(
    `getHydraDx Spot price for ${assetIn} to ${assetOut}: ${JSON.stringify(
      spotPrice,
      null,
      2
    )}`
  );
  console.log(`got spot price`);
  return spotPrice.toString();
}

export async function getHydraDxSellPrice(
  assetIn: string,
  assetOut: string,
  amount: number
) {
  console.log(`getHydraDx Getting selling details...`);
  if (!tradeRouter) {
    console.log(
      `getHydraDx Initializing TradeRouter in teh getHydraDxSell function...`
    );
    await initializeTradeRouter();
  }

  console.log(`getHydraDx Getting selling details...`);
  console.log(`assetIn, assetOut, amount:`, assetIn, assetOut, amount);
  const tradeDetails = await tradeRouter.getBestSell(assetIn, assetOut, amount);
  console.log(`i got trade details!`);
  console.log(`getHydraDx trade details:`, tradeDetails.toHuman());

  return tradeDetails.toHuman();
}
