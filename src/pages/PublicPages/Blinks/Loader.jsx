import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getApiInstance } from '../../../Chains/api/connect';

const BlinkLoader = () => {
  const location = useLocation();
  const [blockNumber, setBlockNumber] = useState(null);
  const [txIndex, setTxIndex] = useState(null);
  const [blinkData, setBlinkData] = useState(null);

  useEffect(() => {
    // Assuming the path is like /<chainName>:<blockNumber>:<txIndex>
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const [chainName, blockNumStr, txIndexStr] = lastSegment.split(':');

    if (blockNumStr && txIndexStr) {
      setBlockNumber(parseInt(blockNumStr));
      setTxIndex(parseInt(txIndexStr));
    } else {
      console.error('Invalid URL format. Expected /<chainName>:<blockNumber>:<txIndex>');
    }
  }, [location]);

  useEffect(() => {
    async function fetchBlinkData() {
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

          // Check if the method is 'system.remarkWithEvent'
          if (extrinsic.method.section === 'system' && extrinsic.method.method === 'remarkWithEvent') {
            // Extract the remark data
            const remarkData = extrinsic.method.args[0].toString();

            // Decode the hex data to UTF-8
            const hexData = remarkData.startsWith('0x') ? remarkData.slice(2) : remarkData;
            const decodedData = Buffer.from(hexData, 'hex').toString('utf-8');

            // Update state with the blink data
            setBlinkData(decodedData);
          } else {
            console.error('Extrinsic is not a system.remarkWithEvent');
          }
        } catch (error) {
          console.error('Error fetching blink data:', error);
        }
      }
    }

    fetchBlinkData();
  }, [blockNumber, txIndex]);

  return (
    <div>
      {blinkData ? (
        <div>
          <h2>Blink Data</h2>
          <pre>{blinkData}</pre>
        </div>
      ) : (
        <p>Loading blink data...</p>
      )}
    </div>
  );
};

export default BlinkLoader;
