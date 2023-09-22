export const CHAIN_METADATA = {
    polkadot: {
        chain: "Polkadot",
        endpoints: [
            "wss://polkadot.api.onfinality.io/public-ws",
            "wss://rpc.polkadot.io",
        ],
        queryBalancePaths: ["system.account"],
        transferFunction: "xcmPallet.reserveTransferAssets",
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
    assetHub: {
        chain: "AssetHub",
        endpoints: [
            "wss://polkadot-asset-hub-rpc.polkadot.io",
            "wss://statemint.api.onfinality.io/public-ws",
        ],
        queryAssetPaths: ["assets.metadata"],  
        queryBalancePaths: ["system.account", "assets.account"],
        nativeAccount: true,

    }
}
