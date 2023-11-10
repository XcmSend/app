import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export const signExtrinsicUtil = async (api: ApiPromise, signer: any, draftedExtrinsic: SubmittableExtrinsic<'promise'>, address: string, nonce?: number) => {
  console.log("signExtrinsicUtil drafted extrinsic:", draftedExtrinsic);

    // Check if the API instance is connected
    if (!api.isConnected) {
      throw new Error("API is not connected. Cannot sign extrinsic.");
    }

  if (signer && signer.signPayload) {
      try {
        console.log("signExtrinsicUtil Before signing:", draftedExtrinsic.toJSON());


      // If nonce is not provided, retrieve it from the network
      if (nonce === undefined) {
        const accountInfo = await api.query.system.account(address);
        
        // Log the entire accountInfo object to inspect its structure
        console.log(`AccountInfo:`, accountInfo.toString());

        // Assuming the structure includes a data field with a nonce property
        // You need to cast it to any or the appropriate interface that includes the nonce
        const nonce = (accountInfo as any).nonce.toNumber();
        console.log(`Using nonce: ${nonce} for address: ${address}`);
      }

      // Use Polkadot JS API's method to sign the extrinsic
      const signedExtrinsic = await draftedExtrinsic.signAsync(address, { signer, nonce });
      console.log("signExtrinsicUtil After signing:", signedExtrinsic.toJSON());
      return signedExtrinsic;
      } catch (error) {
          console.error("signExtrinsicUtil Signing failed:", error);
          throw error;
      }
  } else {
      throw new Error("The signer provided does not support the signPayload function.");
  }
};

