import _, { initial } from 'lodash';
import { generatePath, initializeDefaultValues } from './utils';
import { handleChange } from './changeHandler';

export const initializeVariantFields = (selectedVariant, fieldPath, formData, isDefault=true) => {

    
    console.log('initializeVariantFields - variant 1b. check:', { fieldPath, selectedVariant, formData, isDefault });

    const defaultName = selectedVariant.name;
    let updatedParams = {}; // Initialize the structure to hold updated variant data

    console.log('initializeVariantFields - variant 2b. selectedVariant, defaultName:', { defaultName, fieldPath });

    // 1. First we need to change the value of the variant field because we need to replace the existing variant with the selected one
    console.log('initializeVariantFields - variant 2b. selectedVariant:', selectedVariant);

    if (selectedVariant.fields?.[0]?.resolvedType != undefined ){
        console.log('initializeVariantFields - variant 2c. selectedVariant.fields[0].resolvedType:', selectedVariant.fields[0].resolvedType);
        // updatedParams = handleChange(fieldPath, defaultName, false, 'variant', formData, false, selectedVariant.fields?.[0].resolvedType?.type);
        updatedParams = handleChange(fieldPath, defaultName, false, 'variant', formData);

    } else {
        // updatedParams = handleChange(fieldPath, defaultName, false, 'variant', formData, false);
        updatedParams = handleChange(fieldPath, defaultName, false, 'variant', formData);

    }
    console.log('initializeVariantFields - variant 2c. updatedParams:', updatedParams, fieldPath, defaultName);

    // The below is for the fields of the variant that has been selected.

    // Generate a path specific for this variant we need to check if the children of this are all variant. 
    const variantPath = generatePath(fieldPath, defaultName, 'variant', selectedVariant);

    // Initialize the subfields of the selected variant
    selectedVariant.fields.forEach(field => {
        // if the variant field's we need to check if the sublings of this are all variant. 
        const isAllSibilingsVariantThenPassAsParentType = selectedVariant.fields.every(field => field.resolvedType.type === 'variant');
        console.log('initializeVariantFields - variant 2bi. isAllSibilingsVariantThenPassAsParentType:', isAllSibilingsVariantThenPassAsParentType, field.name, variantPath, field.index);

        const subFieldPath = generatePath(variantPath, field.name, 'variant', false, isAllSibilingsVariantThenPassAsParentType, field.index);
        console.log('initializeVariantFields - variant 2bi. pre field:', { selectedVariant, field, subFieldPath, isDefault });

        // const initialValues = isDefault ? initializeDefaultValues(field.resolvedType, subFieldPath, 'fromVariant') : {};
        const initialValues = initializeDefaultValues(field.resolvedType, subFieldPath, 'fromVariant') 


        console.log('initializeVariantFields - variant 2bi. field:', { field, subFieldPath, initialValues });

        // Update the formData with initial values for each subfield
        // updatedParams = handleChange(subFieldPath, initialValues, false, 'variant', formData, false);
        updatedParams = handleChange(subFieldPath, initialValues, false, 'variant', formData);

        // updatedParams[field.name] = initialValues; // Store updated values in the return object
        console.log('initializeVariantFields - variant 2bi. updatedParams:', updatedParams, initialValues, subFieldPath);
    });

    console.log('initializeVariantFields - variant 2c. updatedVariantFields:', updatedParams);

    return updatedParams;

};

export default initializeVariantFields;
