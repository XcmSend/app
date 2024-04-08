// broadcast.ts

import { ApiPromise } from "@polkadot/api";
import { getApiInstance } from "./connect";
import { CHAIN_METADATA } from "./metadata";
import toast from "react-hot-toast";

/**
 * Broadcast a signed extrinsic to the chain.
 *
 * @param {string} chain - The name of the chain (e.g. 'polkadot').
 * @param {any} signedExtrinsic - The signed extrinsic to broadcast.
 */
export async function broadcastToChain(
  chain: string,
  signedExtrinsic: any,
  { onInBlock, onFinalized, onError } // Add callback parameters
): Promise<void> {
  let api: ApiPromise;
  console.log(`broadcasting`);
  try {
    api = await getApiInstance(chain);
  } catch (error) {
    onError?.(`Failed to connect to the endpoint: ${error.message}`);
    return;
  }

  return new Promise((resolve, reject) => {
    signedExtrinsic
      .send(({ status, events, dispatchError }) => {
        if (dispatchError) {
          const errorMessage = `Transaction error: ${
            dispatchError.message || dispatchError.toString()
          }`;
          onError?.(errorMessage);
          console.log(`mega error:`);
          console.log(errorMessage);
          reject(new Error(errorMessage));
          return;
        }

        if (status.isInBlock) {
          console.log(
            `Transaction included at blockHash ${status.asInBlock.toString()}`
          );
          onInBlock?.(status.asInBlock.toString());
        } else if (status.isFinalized) {
          console.log(
            `Transaction finalized at blockHash ${status.asFinalized.toString()}`
          );
          onFinalized?.(status.asFinalized.toString());
          resolve();
        } else if (status.isDropped || status.isInvalid || status.isUsurped) {
          const errorMessage = `Error with transaction: ${status.type}`;
          onError?.(errorMessage);
          console.log(`mega error 2:`);
          console.log(errorMessage);
          reject(new Error(errorMessage));
        }
      })
      .catch((error) => {
        const errorMessage = `Error broadcasting transaction: ${
          error.message || error.toString()
        }`;
        onError?.(errorMessage);
        console.log(`mega error 3:`);

        console.log(errorMessage);
        reject(new Error(errorMessage));
      });
  });
}
