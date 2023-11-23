// broadcast.ts

import { ApiPromise } from '@polkadot/api';
import { getApiInstance } from "./connect";
import { CHAIN_METADATA } from './metadata';
import toast from 'react-hot-toast';

/**
 * Broadcast a signed extrinsic to the chain.
 * 
 * @param {string} chain - The name of the chain (e.g. 'polkadot').
 * @param {any} signedExtrinsic - The signed extrinsic to broadcast.
 */
export async function broadcastToChain(chain: string, signedExtrinsic: any): Promise<void> {
    let api: ApiPromise;
    
    try {
        api = await getApiInstance(chain);
    } catch (error) {
        toast.error("Failed to connect to the endpoint. Please ensure you're connected and try again.");
        throw error;
    }

    return new Promise((resolve, reject) => {
        try {
            signedExtrinsic.send(({ status, events, error }) => {
                if (error) {
                    toast.error(`Transaction error: ${error.message}`);
                    reject(error);
                    return;
                }

                if (status.isInBlock) {
                    console.log(`Transaction included at blockHash ${status.asInBlock}`);
                    toast.success(`Transaction included at blockHash ${status.asInBlock} `, { id: 'transaction-included' });
                } else if (status.isFinalized) {
                    toast.success(`Transaction finalized at blockHash ${status.asFinalized}`, { id: 'transaction-finalized' });
                    console.log(`Transaction finalized, evets: ${events}`);
                    resolve(); // Only resolve when the transaction is finalized
                } else if (status.isDropped || status.isInvalid || status.isUsurped) {
                    toast.error(`Error with transaction: ${status.type}`, { id: 'transaction-error' });
                    reject(new Error(status.type));
                }
            });
        } catch (error) {
            toast.error(`Error broadcasting transaction from chain${chain}`, error.message || error.toString());
            reject(error);
        }
    });
}
