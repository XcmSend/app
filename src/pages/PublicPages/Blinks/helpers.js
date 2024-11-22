
import { getApiInstance } from '../../../Chains/api/connect';
import { Buffer } from 'buffer';




  export async function fetchBlinkData(blockNumber, txIndex) {
    if (blockNumber !== null && txIndex !== null) {
      try {
        const api = await getApiInstance('assetHub');

        // Fetch the block hash at the given block number
        const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

        // Fetch the block using the block hash
        const signedBlock = await api.rpc.chain.getBlock(blockHash);

        // Get the extrinsic at the given index
        const extrinsics = signedBlock.block.extrinsics;
        const extrinsic = extrinsics[txIndex];

        if (!extrinsic) {
          console.error(`No extrinsic found at index ${txIndex} in block ${blockNumber}`);
          return;
        }

        if (extrinsic.method.section === 'system' && extrinsic.method.method === 'remarkWithEvent') {
          const remarkData = extrinsic.method.args[0].toString();

            //decode       
            const hexData = remarkData.startsWith('0x') ? remarkData.slice(2) : remarkData;

          const decodedData = Buffer.from(hexData, 'hex').toString('utf-8');

            const parsedData = JSON.parse(decodedData);

            const blinkData = parsedData.Blinks ? parsedData.Blinks : parsedData;

return blinkData

} else {
          console.error('Extrinsic is not a system.remarkWithEvent');
        }
      } catch (error) {
        console.error('Error fetching blink data:', error);
      }
    }
  }
