// decode.ts
// import { ApiPromise, SubmittableResult } from "@polkadot/api";

import { getApiInstance } from "./connect";
import { assert, compactToU8a, isHex, u8aConcat, u8aEq } from '@polkadot/util';


/**
 * Decode encoded call data using the Substrate API.
 * 
 * @param {string} chain - The name of the chain (e.g. 'polkadot').
 * @param {string} encodedData - Hex-encoded call data.
 * @returns {Promise<SubmittableResult | undefined>} - The decoded call data.
 */
export async function decodeCallData(chain, encodedData) {
  let api;
  try {
    console.log(`decodeCallData Decoding call data`);
    api = await getApiInstance(chain);
    console.log('decodeCallData hex data:', encodedData);  
    const result = await decodeTheCallData(api, encodedData);

    console.log('decodeCallData Decoded call:', result.data);
    return result.data;
  
  } catch (error) {
    console.error(`Error decoding data: ${error.message}`);
  }
}



async function decodeTheCallData(api, hexData) {
  try {
    assert(isHex(hexData), 'Provided data is not hex-encoded.');

    let call, method, section;

    try {
      // Attempt to decode as a full extrinsic
      const extrinsic = api.tx(hexData);
      assert(extrinsic.toHex() === hexData, 'Mismatch in decoding extrinsic.');
      call = api.createType('Call', extrinsic.method);
    } catch (error) {
      // Attempt to decode as a standalone call
      call = api.createType('Call', hexData);
    }

    ({ method, section } = api.registry.findMetaCall(call.callIndex));
    
    return {
      success: true,
      data: {
        method,
        section,
        arguments: call.args.map(arg => arg.toHuman()),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
