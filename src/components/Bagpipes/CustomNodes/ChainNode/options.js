import { listAssetHubAssets, listHydraDxAssets, listInterlayAssets } from '../../../../Chains/Assets/listAssetsForChain';

const dotAssets = {
  asset: {
    name: 'polkadotDot',
    symbol: 'DOT',
    description: 'Polkadot',
  },
  assetId: 0,
};

const assetHubAssets = {
    asset: {
        name: 'assetHubDot',
        symbol: 'DOT',
        description: 'AssetHub (Polkadot)',
    },
    assetId: 1000,
};

const interlayAssets = {
    asset: {
        name: 'interlayDot',
        symbol: 'DOT',
        description: 'Interlay (Polkadot)',
    },
    assetId: 1000,
};

const turingAssets = {
    asset: {
        name: 'turingKus',
        symbol: 'TUR',
        description: 'Turing (Kusama)',
    },
    assetId: 2114,
};




const rococoAssets = {
  asset: {
    name: 'rococoRoc',
    symbol: 'ROC',
    description: 'Rococo',
  },
  assetId: 0,
};

export const assetOptions = [
    {
        chain: 'polkadot',
        assets: [dotAssets], 
    },
    {
        chain: 'rococo',
        assets: [rococoAssets], 
    },
    {
        chain: 'hydraDx',
        assets: [],  // We'll fetch and populate this later
    },
    {
        chain: 'assetHub',
        assets: [], 
    },
    {
        chain: 'interlay',
        assets: [], 
    }
];

export const getAssetOptions = async (selectedChain, signal) => {
  console.log("Inside getAssetOptions for chain:", selectedChain);
  
  let assets;
  switch(selectedChain) {
      case 'hydraDx':
            assets = await listHydraDxAssets();
          break;
      case 'assetHub':
            assets = await listAssetHubAssets();
           // Append assetHubAssets to the fetched assets list
            assets.push(assetHubAssets);
          break;
      case 'interlay':
            assets = await listInterlayAssets();
            assets.push(interlayAssets);
          break;

        case 'turing':
          assets = [turingAssets];
          break;

      case 'polkadot':
          assets = [dotAssets];
          break;
      case 'rococo':
          assets = [rococoAssets];
          break;
      default:
          assets = [];
  }

  return {
      chain: selectedChain,
      assets: assets
  };
};

