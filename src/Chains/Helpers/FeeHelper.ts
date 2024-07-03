import { ApiPromise } from "@polkadot/api";
import { IExtrinsic } from "@polkadot/types/types";
import { u64 } from "@polkadot/types/primitive";
import { getApiInstance } from "../api/connect";

async function getApi(chain: string): Promise<ApiPromise> {
  console.log(`getApi chain:`, chain);
  const apiInstance = await getApiInstance(chain);
  if (!apiInstance.isConnected) {
    throw new Error("API instance is not connected");
  }
  return apiInstance;
}
export interface PaymentInfo {
  partialFee: string;
  weight: u64;
}

/**
 * Retrieve the payment (weight & fee) information for a given extrinsic
 * @param {IExtrinsic} extrinsic - the extrinsic for which the payment information is needed
 * @param {string} sender - the sender's address
 * @returns {Promise<PaymentInfo>} - Promise that resolves with the payment information
 */
export async function getPaymentInfo(
  extrinsic: IExtrinsic,
  sender: string,
  chain: string
): Promise<PaymentInfo> {
  console.log(`getPaymentInfo extrinsic:`, extrinsic);

  try {
    let api = await getApiInstance(chain);
    console.log(`getPaymentInfo chain:`, chain);

    // If not connected, try to reconnect before throwing an error
    if (!api.isConnected) {
      console.log("API instance is not connected, attempting to reconnect...");
      api = await getApiInstance(chain); // Attempt to get a fresh instance or reconnect
      if (!api.isConnected) {
        throw new Error(
          "WebSocket is not connected after reconnection attempt"
        );
      }
    }

    // If the extrinsic has the paymentInfo method, we can proceed to get the fee information
    // Check if the extrinsic has the hasPaymentInfo flag set to true
    if ((extrinsic as any).hasPaymentInfo) {
      console.log(`getPaymentInfo extrinsic hasPaymentInfo:`, extrinsic);
      const info = await (extrinsic as any).paymentInfo(sender);
      return {
        partialFee: info.partialFee.toHuman(),
        weight: info.weight,
      };
    } else {
      throw new Error("Extrinsic does not have paymentInfo capability");
    }
  } catch (error) {
    console.error(`Error getting payment info for address ${sender}:`, error);
    throw new Error(
      `Error getting payment info for address ${sender}: ${error.message}`
    );
  }
}
