import { ApiPromise } from '@polkadot/api';
import { IExtrinsic } from '@polkadot/types/types';
import { u64 } from '@polkadot/types/primitive';
import connectToWsEndpoint from './connect';

let apiInstance: ApiPromise | null = null;

async function initializeApi() {
  if (!apiInstance) {
    apiInstance = await connectToWsEndpoint('polkadot'); 
  }
}

interface PaymentInfo {
  partialFee: string;
  weight: u64;
}

/**
 * Retrieve the payment (weight & fee) information for a given extrinsic
 * @param {IExtrinsic} extrinsic - the extrinsic for which the payment information is needed
 * @param {string} sender - the sender's address
 * @returns {Promise<PaymentInfo>} - Promise that resolves with the payment information
 */
export async function getPaymentInfo(extrinsic: IExtrinsic, sender: string): Promise<PaymentInfo> {
  await initializeApi();
  
  if (!apiInstance) {
    throw new Error('API instance is not initialized');
  }

  // Ensure extrinsic is a valid transaction before calling paymentInfo
  if (typeof (extrinsic as any).paymentInfo === 'function') {
    const { partialFee, weight } = await (extrinsic as any).paymentInfo(sender);
    return {
      partialFee: partialFee.toHuman(),
      weight
    };
  } else {
    throw new Error('Extrinsic does not have a paymentInfo method');
  }
}
