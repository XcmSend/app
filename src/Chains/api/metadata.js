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
            "wss://rpc-polkadot.luckyfriday.io",
            "wss://polkadot.api.onfinality.io/public-ws",
            "wss://polkadot-rpc.dwellir.com",
            "wss://rpc.polkadot.io",

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
    sora: {
        chain: "Sora",
        endpoints: [
                "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
}
