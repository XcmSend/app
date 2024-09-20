import { getApiInstance } from '../../../../../Chains/api/connect';

interface MethodParams {
    chainKey: string;
    palletName: string;
    methodName: string;
    params: any[];
    atBlock?: string; // Could be a block number or hash
}

async function executeMethod({ chainKey, palletName, methodName, params, atBlock }: MethodParams) {
    console.log('Executing method:', methodName, 'on pallet:', palletName, 'with params:', params, 'at block:', atBlock);
    const api = await getApiInstance(chainKey);
    const camelPalletName = toCamelCase(palletName);
    const camelMethodName = toCamelCase(methodName);

    if (!api.query[camelPalletName] || !api.query[camelPalletName][camelMethodName]) {
        throw new Error(`The method ${camelMethodName} is not available on the ${camelPalletName} pallet.`);
    }

    const method = api.query[camelPalletName][camelMethodName];
    const inputParams = Array.isArray(params) ? params : [params];

    try {
        let blockHash = atBlock;

        // Check if atBlock is a numeric string, indicating it's a block number
        if (atBlock && /^\d+$/.test(atBlock)) {
            console.log('Converting block number to block hash:', atBlock);
            // Convert block number to block hash
            const blockNumber = parseInt(atBlock, 10);
            const hashResult = await api.rpc.chain.getBlockHash(blockNumber);
            blockHash = hashResult.toString();
        }

        let result: any;
        result = JSON.stringify(result, null, 2)
        if (blockHash) {
            // Execute the query at a specific block hash
            result = await method.at(blockHash, ...inputParams);
        } else {
            // Execute the query at the latest state
            result = await method(...inputParams);
        }

        // Assuming the result has a `toHuman()` method if needed, or return the raw result
        return result;
    } catch (error) {
        console.error('Error executing method:', error);
        throw error;
    }
}

function toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}



export { executeMethod };

