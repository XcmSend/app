const endpoints = {
  rococo: {
    default: "wss://rococo-rpc.polkadot.io",
    assetHub: "wss://Frococo-asset-hub-rpc.polkadot.io",
    basilisk: "wss://basilisk-rococo-rpc.play.hydration.cloud",
    hydradx: "wss://hydradx-rococo-rpc.play.hydration.cloud",
    sora: "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
    sora2: "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
  },
  polkadot: {
    default: "wss://polkadot.api.onfinality.io/public-ws",
    assetHub: "wss://statemint.api.onfinality.io/public-ws",
    hydraDx: "wss://hydradx-rpc.dwellir.com",
    polkadex: "wss://polkadex-parachain.public.curie.radiumblock.co/ws",
    interlay: "wss://interlay-rpc.dwellir.com",
  },
  kusama: {
    default: "wss://kusama-rpc.dwellir.com",
    assetHub: "wss://statemine.api.onfinality.io/public-ws",
    hydraDx: "wss://hydradx-rpc.dwellir.com",
    turing: "wss://turing-rpc.dwellir.com",
    kabocha: "wss://kabocha.jelliedowl.net",
    mangata: "wss://kusama-rpc.mangata.online",
  },
  hydradx: {},
  assetHub: {},
};

// Function to update endpoints if needed (placeholder for now)
export const updateEndpoints = (newEndpoints: any) => {
  Object.assign(endpoints, newEndpoints);
};

export default endpoints;
