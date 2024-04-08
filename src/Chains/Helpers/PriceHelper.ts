import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  TradeRouter,
  Router,
  CachingPoolService,
  PoolType,
  StableSwap,
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
  tradeRouter = await new TradeRouter(poolService);
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
      2,
    )}`,
  );
  console.log(`got spot price`);
  return spotPrice.toString();
}

export async function getHydraDxSellPrice(
  assetIn: string,
  assetOut: string,
  amount: number,
) {
  console.log(`getHydraDx Getting selling details...`);
  if (!tradeRouter) {
    console.log(
      `getHydraDx Initializing TradeRouter in teh getHydraDxSell function...`,
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

// simplified route interface for hydradx
interface MyRoute {
  pool: PoolType | { Stableswap: number };
  assetIn: string;
  assetOut: string;
}

/// get the swap routes for hdx
export async function hdx_get_routes(
  assetin: string,
  assetout: string,
  amountin: number,
): Promise<MyRoute[]> {
  const routes: MyRoute[] = [];
  if (!tradeRouter) {
    await initializeTradeRouter();
  }
  console.log(`got trade router`);
  console.log(`calling getBestBuy`);
  const bestBuy = await tradeRouter.getBestBuy(assetin, assetout, amountin);

  for (const swap of bestBuy.swaps) {
    const routeObject: MyRoute = {
      pool:
        swap.pool === PoolType.Stable
          ? { Stableswap: swap.assetIn }
          : swap.pool,
      assetIn: swap.assetIn,
      assetOut: swap.assetOut,
    };
    routes.push(routeObject);
  }
  return routes;
}
