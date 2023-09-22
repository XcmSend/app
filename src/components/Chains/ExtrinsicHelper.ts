import { IExtrinsic } from "@polkadot/types/types/extrinsic";
import { dotToHydraDx } from "./DraftTx/DraftTeleportTx";

export function createExtrinsicForAction(action: 'swap' | 'teleport', 
                                  assetInFormData: AssetInFormData, 
                                  assetOutFormData: AssetOutFormData): IExtrinsic {
  switch (action) {
    case 'swap':
      // Implement logic to generate swap extrinsic for HydraDx
      // This will be dependent on the specific function calls and parameters required by HydraDx.
      // You might need more details or to further specify the required function for HydraDx swaps.
      return; // return the swap extrinsic here

    case 'teleport':
      if (assetInFormData.chain === 'polkadot' && assetOutFormData.chain === 'hydradx') {
        return dotToHydraDx(assetInFormData.amount, assetInFormData.address);
      } 
      // You can add more conditions to handle other teleport scenarios
      // such as hydraDxToParachain or genericPolkadotToParachain.
      
      return; // return the teleport extrinsic or throw an error if conditions aren't met
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

