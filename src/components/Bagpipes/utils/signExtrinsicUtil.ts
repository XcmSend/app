import { SubmittableExtrinsic } from '@polkadot/api/types';

export const signExtrinsicUtil = async (signer: any, draftedExtrinsic: SubmittableExtrinsic<'promise'>, address: string) => {
  console.log("signExtrinsicUtil drafted extrinsic:", draftedExtrinsic);

  if (signer && signer.signPayload) {
      try {
        console.log("signExtrinsicUtil Before signing:", draftedExtrinsic.toJSON());

          // Use Polkadot JS API's own method to sign the extrinsic
          await draftedExtrinsic.signAsync(address, { signer });

          console.log("signExtrinsicUtil After signing:", draftedExtrinsic.toJSON());


          console.log("signExtrinsicUtil Signed extrinsic:", draftedExtrinsic);
          return draftedExtrinsic;
      } catch (error) {
          console.error("signExtrinsicUtil Signing failed:", error);
          throw error;
      }
  } else {
      throw new Error("The signer provided does not support the signPayload function.");
  }
};

