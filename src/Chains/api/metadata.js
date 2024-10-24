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
        chain: "Interlay",
        endpoints: [
            "wss://rpc-interlay.luckyfriday.io",
            "wss://interlay-rpc.dwellir.com",
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    paseo: {
        chain: "paseo",
        endpoints: [
            "wss://paseo-rpc.dwellir.com",
            "wss://rpc.ibp.network/paseo"
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true
    },

    paseo_pop: {
        chain: "paseo_pop",
        endpoints: [
            "wss://rpc3.paseo.popnetwork.xyz"
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true
    },
    
    paseo_assethub: {
        chain: "paseo_assethub",
        endpoints: [
            "wss://asset-hub-paseo-rpc.dwellir.com",
            "wss://sys.dotters.network/asset-hub-paseo"
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true
    },
    hydraDx: {
        chain: "HydraDX" || "hydradx",
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
    hydradx: {
        chain: "HydraDX" || "hydradx",
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
            "wss://rpc.polkadot.io",
            "wss://polkadot-rpc.dwellir.com",
            "wss://polkadot.api.onfinality.io/public-ws",


        ],
        queryBalancePaths: ["system.account"],
        transferFunction: "xcmPallet.limitedReserveTransferAssets",
        nativeAccount: true,
    },
    kusama: {
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
    moonbeam: {
        chain: "Moonbeam",
        endpoints: [
            "wss://wss.api.moonbeam.network",
              "wss://moonbeam-rpc.dwellir.com",


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
    rococo_contracts: {
        chain:"Contracts Rococo",
        endpoints: [
            "wss://rococo-contracts-rpc.polkadot.io",
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


    assetHub_kusama: {
        chain: "Kusama Assethub",
        endpoints: ["wss://statemine-rpc.dwellir.com"],
        queryBalancePaths: ["system.account"],
    },
    turing: {
        chain: "turing",
        endpoints: [
            "wss://turing-rpc.dwellir.com",
      //      "wss://rpc.turing.oak.tech"
        ],
        queryAssetPaths: ["assetRegistry.metadata"],  
        queryBalancePaths: ["system.account" ,"tokens.accounts"],
        nativeAccount: true
    },
    turing: {
        chain: "turing",
        endpoints: [
            "wss://turing-rpc.dwellir.com",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
}
