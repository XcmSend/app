export function constructCallData(formData) {
    console.log(`constructCallData - formData:`, { formData });
    // Find the pallet and method
    // const pallet = pallets.find(p => toCamelCase(p.name) === toCamelCase(palletName));
    // the pallet is passed in as Snake case, so we need to convert it to camel case
    const pallet =  toCamelCase(formData.selectedPallet);
    if (!pallet) throw new Error("Pallet not found");
    const camelCaseMethod =  toCamelCase(formData.selectedMethod.name);
    if (!camelCaseMethod) throw new Error("Method not found");

    const fieldsOrder = formData.selectedMethod.fields.map(field => field.name);
    const paramsKey = Object.keys(formData.params).find(key => key.includes(formData.selectedMethod.name));
    if (!paramsKey) throw new Error("Parameters for the method not found in formData");

    const methodParams = formData.params[paramsKey];

    // Map formData to the order specified by metadata and convert keys to camelCase in final mapping
    const callData = fieldsOrder.map(fieldName => {
        const camelCaseFieldName = toCamelCase(fieldName);
        if (methodParams.hasOwnProperty(fieldName)) {
            return { [camelCaseFieldName]: methodParams[fieldName] };
        }
        throw new Error(`Missing expected parameter: ${fieldName}`);
    });

    return {
        method: camelCaseMethod,
        section: pallet,
        arguments: callData
    };
}




export function formatCallData(callDataArray) {
    return {
        method: callDataArray.method, 
        section: callDataArray.section, 
        arguments: callDataArray.arguments.map(item => {
            if (typeof item === 'string' || item === null) {
                return item === "" ? null : item;
            }
            else if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                const key = Object.keys(item)[0];
                if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
                    return { [key]: { ...item[key] } };
                }
                return { [key]: item[key] }; 
            }
            return item; 
        })
    };
}



// export function toCamelCase(str) {
//     return str
//         .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
//         .replace(/[\s_]+/g, '');
// }

export function toCamelCase(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
        .replace(/[\s_]+/g, '');
}



// Example usage:
// const callData = constructCallData(formData, "AutomationTime", "schedule_xcmp_task");
// console.log(callData);
