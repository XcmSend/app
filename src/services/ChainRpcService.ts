import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getApiInstance } from '../Chains/api/connect';
import { signExtrinsicUtil } from '../components/Bagpipes/utils/signExtrinsicUtil';
import { Codec, ISubmittableResult } from '@polkadot/types/types';

interface MethodParams {
  chainKey: string;
  palletName: string;
  methodName: string;
  params: any[];
  atBlock?: string;
  signerAddress?: string; // Include only for transactions that need signing
  signer?: any; // Include only for transactions that need signing
}

class ChainRpcService {


  static async executeChainQueryMethod({ chainKey, palletName, methodName, params, atBlock }: MethodParams): Promise<any> {
    const api = await getApiInstance(chainKey);
    const method = this.resolveMethod(api, palletName, methodName, false);
  console.log('1. executeChainQueryMethod method:', method);
    try {
      const blockHash = atBlock ? await this.getBlockHash(api, atBlock) : undefined;
      let result: Codec;
      if (params && params.length > 0) {
        const formattedParams = this.formatParams(params);
        result = blockHash ? await method.at(blockHash, ...formattedParams) : await method(...formattedParams);
      } else {
        result = blockHash ? await method.at(blockHash) : await method();
      }
      return result.toHuman ? result.toHuman() : result.toString();
    } catch (error) {
      console.error('Error executing chain query method:', error);
      throw error;
    }
  }


  static async executeChainTxMethod({ chainKey, palletName, methodName, params, signerAddress, signer }: MethodParams): Promise<any> {
    const api = await getApiInstance(chainKey);
    const method = this.resolveMethod(api, palletName, methodName, true);
  
    if (!signerAddress) throw new Error("Signer address is required for transaction signing.");
    try {
      const formattedParams = params && params.length > 0 ? this.formatParams(params) : [];
      const extrinsic = formattedParams.length > 0 ? method(...formattedParams) : method();
  
      const signedExtrinsic = await signExtrinsicUtil(api, signer, extrinsic, signerAddress);
      return signedExtrinsic;
    } catch (error) {
      console.error('Error executing chain tx method:', error);
      throw error;
    }
  }
  
  


  // /// Execute a query method on a chain
  // static async executeChainQueryMethod({ chainKey, palletName, methodName, params, atBlock }: MethodParams): Promise<any> {
  //   const api = await getApiInstance(chainKey);
  //   const method = this.resolveMethod(api, palletName, methodName, false);
  //   const formattedParams = this.formatParams(params);
  //   console.log('1. executeChainQueryMethod formattedParams:', formattedParams);
  //   console.log('1. executeChainQueryMethod params:', params);
  //   try {
  //     let result: Codec;
  //     if (atBlock) {
  //       console.log('2. executeChainQueryMethod atBlock:', atBlock);
  //       const blockHash = await this.getBlockHash(api, atBlock);
  //       result = await method.at(blockHash, ...formattedParams);
  //     } else {
  //       result = await method(...formattedParams);
  //     }
  //     // result = await method(...formattedParams);
  //     return result.toHuman();
  //   } catch (error) {
  //     console.error('Error executing chain query method:', error);
  //     throw error;
  //   }
  // }
  

  // /// Execute a transaction method on a chain
  // static async executeChainTxMethod({ chainKey, palletName, methodName, params, signerAddress, signer }: MethodParams): Promise<any> {
  //   console.log(`executeChainTxMethod: chainKey, palletName, methodName, params: `, chainKey, palletName, methodName, params); 
  //   const api = await getApiInstance(chainKey);
  //   const method = this.resolveMethod(api, palletName, methodName, true);
  //   const formattedParams = this.formatParams(params);
  //   if (!signerAddress) throw new Error("Signer address is required for transaction signing.");

  //   try {
  //     let extrinsic: SubmittableExtrinsic<'promise'>;
  //     let signedExtrinsic: SubmittableExtrinsic<'promise'>;
  
  //     extrinsic = method(...formattedParams) as SubmittableExtrinsic<'promise'>;
  //     signedExtrinsic = await signExtrinsicUtil(api, signer, extrinsic, signerAddress);
      
  //     return signedExtrinsic;

  //   } catch (error) {
  //     console.error('Error executing chain tx method:', error);
  //     throw error;
  //   }
  // }

  /// Create a transaction method on a chain
  static async createChainTxMethod({ chainKey, palletName, methodName, params }: MethodParams) {
    const api = await getApiInstance(chainKey);
    const camelPalletName = this.toCamelCase(palletName.toLowerCase());
    const camelMethodName = this.toCamelCase(methodName);

    if (!api.tx[camelPalletName] || !api.tx[camelPalletName][camelMethodName]) {
      throw new Error(`The method ${camelMethodName} is not available on the ${camelPalletName} pallet.`);
    }

    const method = api.tx[camelPalletName][camelMethodName];
    const formattedParams = this.formatParams(params);
console.log('formattedParams:', formattedParams);
    const extrinsic = method(...formattedParams) as SubmittableExtrinsic<'promise', ISubmittableResult>;
    const encodedCallData = extrinsic.method.toHex();

    return { extrinsic, encodedCallData };
  }

  private static resolveMethod(api: ApiPromise, palletName: string, methodName: string, isTx: boolean): any {
    const camelPalletName = this.toCamelCase(palletName);
    const camelMethodName = this.toCamelCase(methodName);
    const namespace = isTx ? api.tx : api.query;

    console.log(`Resolving method: ${methodName} on pallet: ${palletName}`);
    console.log(`Camel Case Pallet Name: ${camelPalletName}, Camel Case Method Name: ${camelMethodName}`);
    console.log(`Namespace details:`, namespace);

    if (!namespace[camelPalletName]) {
      console.error(`Pallet ${camelPalletName} is not available in the namespace.`);
      return null;
    }

    const method = namespace[camelPalletName][camelMethodName];

    if (typeof method === 'function') {
      console.log(`Direct method access successful for: ${camelMethodName}`);
      return method;
    } else {
      console.error(`The method ${camelMethodName} is not available on the pallet ${palletName} as a function, checked as ${camelMethodName}.`);
      return null;
    }
}

  
  

private static formatParams(params: any): any[] {
  // Function to clean a string by removing zero-width spaces and other unwanted characters
  function cleanString(value: string): string {
      return value.split('').filter(char => {
          const code = char.charCodeAt(0);
          return code >= 32 && code <= 126; // Only include printable ASCII characters
      }).join('');
  }

  // Function to recursively clean parameters
  function cleanParams(param: any): any {
      if (typeof param === 'string') {
          return cleanString(param);
      } else if (Array.isArray(param)) {
          return param.map(item => cleanParams(item));
      } else if (param && typeof param === 'object') {
          const cleanedObject = {};
          for (const key in param) {
              if (param.hasOwnProperty(key)) {
                  cleanedObject[key] = cleanParams(param[key]);
              }
          }
          return cleanedObject;
      }
      return param;
  }

  // Ensure params is an array
  const paramsArray = Array.isArray(params) ? params : [params];

  // Clean each parameter
  const cleanedParams = paramsArray.map(param => cleanParams(param));

  console.log('Formatted and cleaned params:', cleanedParams);
  return cleanedParams;
}



  private static async getBlockHash(api: ApiPromise, atBlock: string): Promise<string> {
    if (/^\d+$/.test(atBlock)) { // If it's a numeric string, treat it as a block number
      const blockNumber = parseInt(atBlock, 10);
      return (await api.rpc.chain.getBlockHash(blockNumber)).toString();
    }
    return atBlock; // Otherwise, it's already a block hash
  }

  private static toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
  
}

export default ChainRpcService;
