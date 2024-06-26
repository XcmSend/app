import { ApiPromise } from '@polkadot/api';
import { getApiInstance } from '../../../../../../Chains/api/connect';

interface TransactionParams {
    chainKey: string;
    palletName: string;
    methodName: string;
    params: any[];
}

async function executeTransaction({ chainKey, palletName, methodName, params }: TransactionParams) {
    const api = await getApiInstance(chainKey);
    const camelPalletName = toCamelCase(palletName);
    const camelMethodName = toCamelCase(methodName);

    if (!api.tx[camelPalletName] || !api.tx[camelPalletName][camelMethodName]) {
        throw new Error(`The transaction method ${camelMethodName} is not available on the ${camelPalletName} pallet.`);
    }

    const transaction = api.tx[camelPalletName][camelMethodName](...params);

    // Change this for our central signer...
    // const injector = await api.signer.getInjector();  // Assuming you have a signer configured
    // const hash = await transaction.signAndSend(api.wallet.address, { signer: injector });
    // return hash;
}

function toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export { executeTransaction };
