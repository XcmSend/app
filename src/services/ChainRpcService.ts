import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { getApiInstance } from '../Chains/api/connect';
import { signExtrinsicUtil } from '../components/Bagpipes/utils/signExtrinsicUtil';
import { Codec, ISubmittableResult } from '@polkadot/types/types';
import { TypeRegistry } from '@polkadot/types';
const registry = new TypeRegistry();


const createParam = (type, value) => {
  return registry.createType(type, value);
};


interface MethodParams {
  chainKey: string;
  palletName: string;
  methodName: string;
  params: Arguments;
  atBlock?: string;
  signerAddress?: string; // Include only for transactions that need signing
  signer?: any; // Include only for transactions that need signing
}

interface Arguments {
  [key: string]: any;
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


  static async executeChainTxRenderedMethod({ chainKey, palletName, methodName, params, signerAddress, signer }: MethodParams): Promise<any> {
    const api = await getApiInstance(chainKey);
    const method = this.resolveMethod(api, palletName, methodName, true);

    if (!method) throw new Error(`Method ${methodName} is not available on pallet ${palletName}.`);
    if (!signerAddress) throw new Error("Signer address is required for transaction signing.");

    try {
        const formattedParams = this.formatTxParams(api, method, params);
        const extrinsic = method(...formattedParams);
        const signedExtrinsic = await signExtrinsicUtil(api, signer, extrinsic, signerAddress);
        return signedExtrinsic;
    } catch (error) {
        console.error('Error executing chain tx method:', error);
        throw error;
    }
}


static async createChainTxRenderedMethod({ chainKey, palletName, methodName, params }) {
  const api = await getApiInstance(chainKey);
  const method = this.resolveMethod(api, palletName, methodName, true);

  if (!method) {
      throw new Error(`Method ${methodName} is not available on pallet ${palletName}.`);
  }

  try {
      const formattedParams = this.formatTxParams(api, method, params);
      const extrinsic = method(...formattedParams);
      const encodedCallData = extrinsic.method.toHex();

      return {
          extrinsic,
          encodedCallData
      };
  } catch (error) {
      console.error('Error preparing chain tx method:', error);
      throw error;
  }
}



  private static resolveMethod(api: ApiPromise, palletName: string, methodName: string, isTx: boolean): any {
    const camelPalletName = this.toCamelCase(palletName);
    console.log(`executeChainTxRenderedMethod Resolving method: ${methodName} on pallet: ${palletName}`);
    const camelMethodName = this.toCamelCase(methodName);
    const namespace = isTx ? api.tx : api.query;

    console.log(`executeChainTxRenderedMethod Resolving method: ${methodName} on pallet: ${palletName}`);
    console.log(`executeChainTxRenderedMethod Camel Case Pallet Name: ${camelPalletName}, Camel Case Method Name: ${camelMethodName}`);
    console.log(`executeChainTxRenderedMethod Namespace details:`, namespace);

    if (!namespace[camelPalletName]) {
      console.error(`Pallet ${camelPalletName} is not available in the namespace.`);
      return null;
    }

    const method = namespace[camelPalletName][camelMethodName];
    console.log(`executeChainTxRenderedMethod Method details:`, method);

    if (typeof method === 'function') {
      console.log(`executeChainTxRenderedMethod Direct method access successful for: ${camelMethodName}`);
      return method;
    } else {
      console.error(`The method ${camelMethodName} is not available on the pallet ${palletName} as a function, checked as ${camelMethodName}.`);
      return null;
    }
}

  

/**
 * Formats parameters according to their defined types in Substrate metadata.
 */
static formatTxParams(api: ApiPromise, method: any, params: any): any[] {
  return params.arguments.map(arg => {
      const key = Object.keys(arg)[0];
      let value = Object.values(arg)[0];
      const typeInfo = method.meta.args.find(a => a.name.toString() === key);
      const paramType = typeInfo.type.toString();

      // Handle optional types
      if (paramType.startsWith('Option<')) {
          if (value === "None") {
              return null; // Convert "None" to null
          } else if (value && typeof value === 'object' && 'Some' in value) {
              value = value.Some; // Unwrap the value from Some
          }
      }
      // Create the parameter using the appropriate type from the registry
      return api.registry.createType(paramType, value);
  });
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
        .replace(/(_\w)/g, (match) => match[1].toUpperCase())
        .replace(/^([A-Z])/, (match) => match.toLowerCase());
}
}

export default ChainRpcService;


  // static async executeChainTxRenderedMethod({ chainKey, palletName, methodName, params, signerAddress, signer }: MethodParams): Promise<any> {
  //   console.log(`executeChainTxRenderedMethod: chainKey, palletName, methodName, params: `, chainKey, palletName, methodName, params);
  //   const api = await getApiInstance(chainKey);
  //   console.log(`executeChainTxRenderedMethod: now about to resole method:...`);
  //   const method = this.resolveMethod(api, palletName, methodName, true);
  //   console.log(`executeChainTxRenderedMethod: method resolved:...`, method);

  //   if (!signerAddress) throw new Error("Signer address is required for transaction signing.");

  //   try {

  //     // lets find conviction with the params arguments which is an array of objects inside each object is the key where conviction is what we are looking for
  //     const conviction = params.arguments.find(arg => Object.keys(arg)[0] === 'conviction');
  //     console.log('executeChainTxRenderedMethod conviction:', conviction);

  //     const convictionParam = params.arguments ? createParam('Option<AccountId32>', params.arguments.conviction) : createParam('Option<AccountId32>', null);
  //     console.log('executeChainTxRenderedMethod scheduleAs:', params, params.arguments.conviction, convictionParam.toHuman());

     
  //     const formattedParams = params && params.arguments ? params.arguments.map(arg => {
  //       const key = Object.keys(arg)[0];
  //       let value = Object.values(arg)[0];
  //       const typeInfo = method.meta.args.find(a => a.name.toString() === key);
  //       const paramType = typeInfo.type.toString();
  //       // Handle optional types specifically
  //       if (paramType.startsWith('Option<')) {
  //         if (value === "None") {
  //             value = null; // Convert "None" to null for optional types
  //         } else if (value && typeof value === 'object' && 'Some' in value) {
  //             value = value.Some; // Extract the value from Some object
  //         }
  //     }

  //     // Create the parameter using the appropriate type from the registry
  //     return api.registry.createType(paramType, value);
  //   }) : [];   
//         console.log('executeChainTxRenderedMethod formattedParams:', formattedParams);
//       console.log('executeChainTxRenderedMethod now about to create extrinsic...')

//       const extrinsic = formattedParams.length > 0 ? method(...formattedParams) : method();
//       console.log('executeChainTxRenderedMethod extrinsic:', extrinsic);

//       const signedExtrinsic = await signExtrinsicUtil(api, signer, extrinsic, signerAddress);
//       return signedExtrinsic;
//     } catch (error) {
//       console.error('Error executing chain tx method:', error);
//       throw error;
//     }
// }

  




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

  
  // static async createChainTxMethod({ chainKey, palletName, methodName, params }: MethodParams) {
  //   const api = await getApiInstance(chainKey);
  //   const camelPalletName = this.toCamelCase(palletName.toLowerCase());
  //   const camelMethodName = this.toCamelCase(methodName);

  //   if (!api.tx[camelPalletName] || !api.tx[camelPalletName][camelMethodName]) {
  //     throw new Error(`The method ${camelMethodName} is not available on the ${camelPalletName} pallet.`);
  //   }

  //   const method = api.tx[camelPalletName][camelMethodName];
  //   const formattedParams = this.formatParams(params);
  //   console.log('formattedParams:', formattedParams);
  //   const extrinsic = method(...formattedParams) as SubmittableExtrinsic<'promise', ISubmittableResult>;
  //   const encodedCallData = extrinsic.method.toHex();

  //   return { extrinsic, encodedCallData };
  // }


   // private static toCamelCase(str: string): string {
  //   return str
  //     .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
  //       return index == 0 ? word.toLowerCase() : word.toUpperCase();
  //     })
  //     .replace(/\s+/g, '');
  // }
