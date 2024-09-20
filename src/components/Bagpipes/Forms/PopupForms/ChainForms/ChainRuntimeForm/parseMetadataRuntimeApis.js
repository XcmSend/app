// src/utils/parseMetadataRuntimeApis.js
export const parseMetadataRuntimeApis = (metadata) => {
    const runtimeApis = metadata?.metadata?.V14?.runtimeApi || []; // Adjust based on metadata version
    return runtimeApis.map(api => ({
        name: api.name,
        methods: api.methods.map(method => ({
            name: method.name,
            args: method.args.map(arg => ({
                name: arg.name,
                type: arg.type
            }))
        }))
    }));
};
