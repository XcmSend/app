import _, { initial } from 'lodash';
import { generatePath, initializeDefaultValues } from './utils';
import { handleChange } from './changeHandler';

export const initializeVariantFields = (selectedVariant, fieldPath, formData, isDefault=true) => {

    
    console.log('initializeVariantFields - variant 1b. check:', { fieldPath, selectedVariant, formData, isDefault });

    const variantName = selectedVariant.name;
    let updatedParams = {}; // Initialize the structure to hold updated variant data

    console.log('initializeVariantFields - variant 2b. selectedVariant, variantName:', { variantName, fieldPath });

    // 1. First we need to change the value of the variant field because we need to replace the existing variant with the selected one
    console.log('initializeVariantFields - variant 2b. selectedVariant:', selectedVariant);

    updatedParams = handleChange(fieldPath, variantName, false, 'variant', formData);
    
    console.log('initializeVariantFields - variant 2b. updatedParams:', updatedParams);

    // The below is for the fields of the variant that has been selected.

    // Generate a path specific for this variant
    const variantPath = generatePath(fieldPath, variantName, 'variant', selectedVariant);

    // Initialize the subfields of the selected variant
    selectedVariant.fields.forEach(field => {
        const subFieldPath = generatePath(variantPath, field.name, 'variant', field);
        const initialValues = isDefault ? initializeDefaultValues(field.resolvedType, subFieldPath, 'fromVariant') : {};

        console.log('initializeVariantFields - variant 2bi. field:', { field, subFieldPath, initialValues });

        // Update the formData with initial values for each subfield
        updatedParams = handleChange(subFieldPath, initialValues, false, 'variant', formData, false);
        // updatedParams[field.name] = initialValues; // Store updated values in the return object
        console.log('initializeVariantFields - variant 2bi. updatedParams:', updatedParams, initialValues, subFieldPath);
    });

    console.log('initializeVariantFields - variant 2c. updatedVariantFields:', updatedParams);

    return updatedParams;

};

export default initializeVariantFields;
