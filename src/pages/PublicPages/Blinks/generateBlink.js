import { getApiInstance } from '../../../Chains/api/connect';
import { signExtrinsicUtil } from '../../../components/Bagpipes/utils/signExtrinsicUtil';
import { broadcastToChain } from '../../../Chains/api/broadcastToChain';
import toast from 'react-hot-toast';

export const signAndSendRemark = async (chainName, walletContext, accountAddress, data, options) => {

    console.log('signAndSendRemark', walletContext, accountAddress, data);
    const api = await getApiInstance('assetHub');

    try {

      const remarkCall = api.tx.system.remarkWithEvent(data);
      const signer = walletContext?.wallet?.signer;
      let signedExtrinsic;
      try {
        signedExtrinsic = await signExtrinsicUtil(api, signer, remarkCall, accountAddress);
        console.log('Signed extrinsic:', signedExtrinsic);
        options.signedExtrinsic('Signed');
        } catch (error) {
          if (error.message.includes('Cancelled')) {
            console.warn('User canceled the signing process.');
            options.signedExtrinsic('Cancelled');
            // Handle cancellation specifically
            throw new Error('SigningCancelled');
          } else {
            console.error('An error occurred during signing:', error);
            throw error;          
          }
      }

      if (options.signedExtrinsic === 'Cancelled') {
        return;
      }
        const transactionHash = signedExtrinsic.hash.toHex();

        const transactionResult = await broadcastToChain('assetHub', signedExtrinsic, {
        onInBlock: async (blockHash) => {
            console.log(`Remark included in block ${blockHash}`);
            toast.success(`Transaction included at blockHash: ${blockHash}`);


            api.rpc.chain.getBlock(blockHash).then(block => {
              const extrinsics = block.block.extrinsics;
              const txIndex = extrinsics.findIndex(ex => ex.hash.toHex() === transactionHash);
              console.log(`Transaction index in block: ${txIndex}`);
              // Assume generateUrl and chainName are defined correctly
              const url = generateUrl(chainName, block.block.header.number.toNumber(), txIndex);
              console.log('here is the Generated URL:', url);
              options.onUrlGenerated && options.onUrlGenerated(url);
              options.onInBlock && options.onInBlock(blockHash);
          }).catch(console.error);           
        },
        onFinalized: (blockHash) => {
          console.log(`Remark transaction finalized at block ${blockHash}`);
          toast.success(`Transaction finalized at blockHash: ${blockHash}`);
          options.onFinalized && options.onFinalized(blockHash);

        },
        onError: (error) => {
          console.error(`Remark transaction failed: ${error.message}`);
          toast.error(`Transaction failed: ${error.message}`);
          options.onError && options.onError(error);

        },
      });
  
      return transactionResult;
    }  catch (error) {
      if (error.message === 'SigningCancelled') {
        console.log('Signing was cancelled by the user.');
        options.onError && options.onError(new Error('Transaction signing was cancelled.'));
        return;
      } else {
        console.error('Error signing or sending remark:', error);
        options.onError && options.onError(error);
        throw error;
      }
    }
  };
  

  export const generateUrl = (chainName, blockNumber, txIndex) => {
    const baseUrl = "https://blink.bagpipes.io/#"; // https://blink.bagpipes.io/ if production or http://localhost:3000/ if local
    const fullUrl = `${baseUrl}/${chainName}:${blockNumber}:${txIndex}`;
    console.log("Generated URL:", fullUrl);
    return fullUrl;
  };