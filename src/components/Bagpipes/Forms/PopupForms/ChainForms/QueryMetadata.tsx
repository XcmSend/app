import { getApiInstance } from '../../../../../Chains/api/connect';
import { ApiPromise } from '@polkadot/api';
import { u8aToHex, hexToString, u8aToString } from '@polkadot/util';
import { Metadata } from '@polkadot/types/metadata';
import { TypeRegistry } from '@polkadot/types/create';
import { resolveKeyType } from './resolveKeyType';




async function fetchAndDecodeMetadata(api: ApiPromise) {
    const metadata = await api.rpc.state.getMetadata();
    return metadata.toHuman(); // Convert the metadata to a more readable form
}


export async function queryMetadata(chainKey: string) {
    const api = await getApiInstance(chainKey);
        
    const metadata = await fetchAndDecodeMetadata(api);
    console.log('metadata from queryMetadata:', metadata);
    console.log('runtimeMetadata from queryMetadata:', api.runtimeMetadata.toJSON());

    // console.log('Metadata from queryMetadata:', metadata);
    return metadata;
}


const registry = new TypeRegistry();

const getRuntimeCalls = (api: any, lookupTypes: any) => {
    const runtimeCalls = api.call;

    const calls = Object.entries(runtimeCalls).map(([section, methods]) => {
        return {
            section,
            methods: Object.entries(methods).map(([methodName, method]) => {
                // Access the method to ensure `meta` is available
                if (method && method.meta) {
                    const meta = method.meta;
                    return {
                        methodName,
                        description: meta.documentation.toString(),
                        params: meta.args.map((param: any) => {
                            const paramName = param.name.toString().replace(/([A-Z])/g, '_$1').toLowerCase();
                            const paramType = resolveKeyType(param.type.toString(), lookupTypes);
                            return {
                                name: paramName,
                                type: paramType.displayName,
                            };
                        }),
                    };
                }
                return null;
            }).filter(method => method !== null), // Filter out methods without meta
        };
    });

    return calls;
}





