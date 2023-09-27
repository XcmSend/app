import { listAssetHubAssets, listHydraDxAssets } from '../../../../Chains/Assets/listAssetsForChain';

const dotAssets = {
  asset: {
    name: 'polkadotDot',
    symbol: 'DOT',
    description: 'Polkadot',
  },
  assetId: 0,
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
        assets: [],  // We'll fetch and populate this later
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

