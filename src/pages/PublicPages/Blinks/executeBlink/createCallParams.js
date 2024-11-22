
import { chain } from 'lodash';
import { actionSubmittableStructure } from '../actions'; 


export const createCallParams = (formData, chainDecimals) => {
    console.log("createCallParams formData", formData, chainDecimals);
    const actionData = formData.links.actions[0]; // TODO one action per blink i believe TODO: review this.

    if (!actionData) throw new Error("No action data available.");

    // Construct the parameters object from formData
    const params = actionData.parameters.reduce((acc, param) => {
        let value = param.value;
        if (param.type === 'u128' && value) {
            value = `${BigInt(value) * BigInt(10 ** chainDecimals)}`; // TODO get chainDecimals for chain. 
        }
        acc[param.name] = value;
        return acc;
    }, {});

    const methodData = actionSubmittableStructure(formData.actionType, params);

    console.log("createCallParams methodData", methodData);

    if (!methodData) throw new Error("Action type is not supported or incorrectly defined.");

    const callParams = methodData?.arguments?.map(arg => params[arg?.name]);
    console.log("createCallParams callParams", callParams);

    return methodData;
};