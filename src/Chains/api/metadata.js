export const CHAIN_METADATA = {
    assetHub: {
        chain: "AssetHub",
        endpoints: [
            "wss://polkadot-asset-hub-rpc.polkadot.io",
            "wss://statemint.api.onfinality.io/public-ws",
        ],
        queryAssetPaths: ["assets.metadata"],  
        queryBalancePaths: ["system.account", "assets.account"],
        nativeAccount: true,

    },
    interlay: {
        chain: "interlay",
        endpoints: [
            "wss://rpc-interlay.luckyfriday.io",
            "wss://interlay-rpc.dwellir.com",
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    mangatax: {
        chain: "mangatax",
        endpoints: [
            "wss://kusama-archive.mangata.online",
            "wss://kusama-rpc.mangata.online",
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    moonriver: {
        chain: "moonriver",
        endpoints: [
            "wss://moonriver-rpc.dwellir.com",
            "wss://wss.api.moonriver.moonbeam.network"
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account" ,"assets.accounts"],
        nativeAccount: true
    },

    turing: {
        chain: "turing",
        endpoints: [
            "wss://rpc.turing.oak.tech"
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account" ,"tokens.accounts"],
        nativeAccount: true
    },
    hydraDx: {
        chain: "HydraDX",
        endpoints: [
            "wss://hydradx-rpc.dwellir.com",
            "wss://hydradx.api.onfinality.io/public-ws",
            "wss://rpc.hydradx.cloud",
        ],
        queryAssetPaths: ["assetRegistry.assets"],  
        queryBalancePaths: ["system.account", "tokens.accounts"],
        transferFunction: "xTokens.transferMultiasset",
        nativeAccount: true,

    },
    polkadot: {
        chain: "Polkadot",
        endpoints: [
            "wss://polkadot-rpc.dwellir.com",
            "wss://rpc.polkadot.io",
            "wss://polkadot.api.onfinality.io/public-ws",


        ],
        queryBalancePaths: ["system.account"],
        transferFunction: "xcmPallet.limitedReserveTransferAssets",
        nativeAccount: true,
    },
    Kusama: {
        chain: "Kusama",
        endpoints: [
              "wss://kusama-rpc.dwellir.com",
            "wss://kusama-rpc.polkadot.io",
            "wss://kusama.api.onfinality.io/public-ws",
        ],
        queryBalancePaths: ["system.account"],
        transferFunction: "xcmPallet.limitedReserveTransferAssets",
        nativeAccount: true,
    },
    rococo: {
        chain: "Rococo",
        endpoints: [
                "wss://rococo-rpc.polkadot.io",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    rococo_assethub: {
        chain: "Rococo Assethub",
        endpoints: [
            "wss://rococo-asset-hub-rpc.polkadot.io"
        ],
    //    queryAssetPaths: ["assets.metadata"],  
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    kusama_assethub: {
        chain: "Kusama Assethub",
        endpoints: ["wss://statemine-rpc.dwellir.com"],
        queryBalancePaths: ["system.account"],
    },
    sora: {
        chain: "Sora",
        endpoints: [
                "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
}
