
    import _ from 'lodash';
  
    export const initializeFormData = (selectedVariant, variantIndex, formData, fieldPath) => {
        console.log('RecursiveFieldRenderer - variant 2b. Initializing form data for variant at index:', { variantIndex, selectedVariant, formData });
    
        // Convert path to an object structure if needed or use existing structure
        const updatedParams = { ...formData.params };
        console.log('RecursiveFieldRenderer - variant 2bi. Updated params before initialization:', updatedParams);
        let initialValues = {};

        if (selectedVariant.fields && selectedVariant.fields.length > 0) {
            selectedVariant.fields.forEach(field => {

                const fieldPath = `${selectedVariant.name}.${field.name}`;
                const defaultValue = selectedVariant.name
                // const defaultValue = initializeDefaultValues(field.resolvedType, fieldPath);
                console.log('RecursiveFieldRenderer - variant 2bii. fieldPath, defaultValue:', fieldPath, defaultValue);
                // _.set(updatedParams, fieldPath, defaultValue); // Using lodash to handle nested path setting

                initialValues[field.name] = initializeDefaultValues(field, `${fieldPath}.${field.name}`); 
                
            });
            console.log('RecursiveFieldRenderer - variant 2biii. fieldPath, initialValues:', initialValues, fieldPath);

        }
    
        return updatedParams;
    };
    
    


    // const initializeFormData = (selectedVariant, variantPath) => {
    //     console.log('RecursiveFieldRenderer - initialize initializeFormData selectedVariant, variantPath:', selectedVariant, variantPath);
    //     const updatedParams = _.cloneDeep(formData.params); // Clone to prevent direct mutation

    //     // Clear out the old data at this path if necessary
    //     _.set(updatedParams, variantPath, {});

    //     if (selectedVariant.fields && selectedVariant.fields.length > 0) {
    //         selectedVariant.fields.forEach(field => {
    //             console.log('RecursiveFieldRenderer - initialize initializeFormData field:', field);
    //             const fieldPath = generatePath(variantPath, field.name, field.type);
    //             const defaultValue = initializeDefaultValues(field.resolvedType, fieldPath);
    //             _.set(updatedParams, fieldPath, defaultValue); // Set default or existing data
    //         });
    //     }

    //     saveNodeFormData(activeScenarioId, nodeId, {...formData, params: updatedParams});
    // };
    
    

  
    // Utility to recursively initialize default values based on type
    export  const initializeDefaultValues = (field, path, fromType = 'default') => {
        console.log('initializeDefaultValues - initialize initializeDefaultValues, path:', field, path, fromType);
        let defaultValue;
        switch (field.type) {
          case 'variant':
            const defaultVariant = field.variants[0];
            const variantName = defaultVariant.name || `variant${defaultVariant.index}`;
      
            if (defaultVariant.fields.length === 0) {
              defaultValue = variantName;
            } else if (
              defaultVariant.fields.length > 1 &&
              defaultVariant.fields.every(field => !field.name)
            ) {
              defaultValue = [];
              defaultVariant.fields.forEach((subField, index) => {
                const subFieldValue = initializeDefaultValues(
                  subField.resolvedType,
                  `${path}[${index}]`,
                  'variant'
                );
                defaultValue.push(subFieldValue);
              });
              defaultValue = { [variantName]: defaultValue };
            } else if (
              defaultVariant.fields.length === 1 &&
              !defaultVariant.fields[0].name
            ) {
              const subField = defaultVariant.fields[0];
              const subFieldValue = initializeDefaultValues(
                subField.resolvedType,
                path,
                'variant'
              );
              defaultValue = { [variantName]: subFieldValue };
            } else {
              defaultValue = { [variantName]: {} };
              defaultVariant.fields.forEach((subField) => {
                const subFieldName = subField.name || 'value';
                defaultValue[variantName][subFieldName] = initializeDefaultValues(
                  subField.resolvedType,
                  `${path}.${subFieldName}`,
                  'variant'
                );
              });
            }
            break;
              
                  case 'composite':
                    if (
                      field.fields &&
                      field.fields.length === 1 &&
                      field.fields[0].typeId === '1'
                    ) {
                      // Handle Array[32] of U8 specifically
                      defaultValue = '0x'; // Default value for an array of U8
                    } else if (
                      field.fields &&
                      field.fields.length === 1 &&
                      !field.fields[0].name
                    ) {
                      // Composite with single unnamed field, flatten the structure
                      defaultValue = initializeDefaultValues(
                        field.fields[0].resolvedType,
                        path,
                        field.fields[0].resolvedType.type
                      );
                    } else {
                      defaultValue = {};
                      if (field.fields) {
                        field.fields.forEach((subField) => {
                          const subFieldName = subField.name || 'value';
                          defaultValue[subFieldName] = initializeDefaultValues(
                            subField.resolvedType,
                            `${path}.${subFieldName}`,
                            subField.resolvedType.type
                          );
                        });
                      }
                    }
                    break;

            case 'input':
                console.log('initializeDefaultValues - initialize initializeDefaultValues input:', path);
                if (['u8', 'u32', 'u64', 'i32', 'i64', 'u128'].includes(field.typeName)) {
                    defaultValue = '0';
                } else if (field.typeName === 'Bytes') {
                    defaultValue = '0x';
                } else {
                    defaultValue = '0';
                }                
                
                break;


            case 'variantField': 
            
                console.log('initializeDefaultValues - initialize initializeDefaultValues variantField:', path);
            
            // case 'composite':
            //     console.log('initializeDefaultValues - initialize composite 01 initializeDefaultValues composite:', { field, path, fromType });

            //     if (
            //         field.fields &&
            //         field.fields.length > 1 &&
            //         field.fields[0].typeId === '1'
            //     ) {
            //         console.log('initializeDefaultValues - composite with typeId=1 detected');
            //         // Handle Array[32] of U8 specifically
            //         defaultValue = '0x'; // Default value for an array of U8
            //     } else {
            //         defaultValue = {};

            //         if (field.fields) {
            //             console.log('initializeDefaultValues - initialize composite 02 initializeDefaultValues composite field.fields:', field.fields, fromType);
            //             field.fields.forEach(subField => {
            //                 console.log('initializeDefaultValues - initialize composite 02a initializeDefaultValues composite subField:', subField, fromType);
            //                 // if subfield is a sequence then initialize it as an array
            //                 if (subField.resolvedType.type === 'sequence') {
            //                     defaultValue = [];
            //                     console.log(`initializeDefaultValues - initialize composite ${field.type} 03a sequence initializeDefaultValues composite defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
            //                 } else if (subField.resolvedType.type === 'composite') {
            //                 defaultValue[subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'composite');
            //                 console.log(`initializeDefaultValues - initialize ${field.type} 03b initializeDefaultValues composite defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
            //                 } else if (subField.resolvedType.type === 'variant') {

            //                     console.log(`initializeDefaultValues - initialize ${field.type} 03a initializeDefaultValues variant defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
            //                     defaultValue[subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'variant');
            //                     // add something here
            //                     console.log(`initializeDefaultValues - initialize ${field.type} 03b initializeDefaultValues variant defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
            //                 } else if (subField.resolvedType.type === 'input') {
            //                     defaultValue[subField.name] =  initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'input');
            //                 } else {
            //                     defaultValue[subField.name] =  initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, subField.resolvedType.type);
            //                 }
            //             });
            //         }
            //     }
            
            //     break;

            case 'sequence':
                // sequence is an array of objects
                defaultValue = [];
                console.log('initializeDefaultValues - initialize sequence initializeDefaultValues sequence:', path, defaultValue, field, fromType);

            break;
            default:
                // how can we enforce the switch statement to catch all cases?

                if (field.type === null || field.type === undefined || field.type === ""    ) {
                defaultValue = null; // Default fallback
                console.log('initializeDefaultValues - initialize default initializeDefaultValues default:', path, defaultValue, field, fromType);
                } else {
                    console.log('initializeDefaultValues - initialize default initializeDefaultValues should retry default:', field.type, path, field, 'retrying');
                    // initializeDefaultValues(field, path, 'retrying');
                }
        }
        return defaultValue;
    };


    export const generatePath = (base, segment, type, from, shouldFieldsBeArray, index) => {
        console.log(`generatePath -  ${type} 0. generatePath ${type} base, segment, type:`, base, segment, type, from);
    

        let basePath = Array.isArray(base) ? base : base ? [base] : [];


        // If the segment is undefined or empty, decide how to handle based on the type
    // If the segment is undefined or empty, decide how to handle based on the type
    if (!segment) {
      if (type === 'variant' && shouldFieldsBeArray && index !== undefined) {
          // Use index for array elements
          return [...basePath, index];
      } else {
          // Skip adding undefined or empty segment
          return basePath;
      }
  }
    
    console.log('Missing or empty segment', { base, segment, type });
    // For cases where segment is not empty
    switch (type) {
        case 'variant':
            if (shouldFieldsBeArray) {
                console.log(`generatePath - ${type} 1. generatePath ${type} shouldFieldsBeArray:`, base, segment, type, from, shouldFieldsBeArray, index);
                return [...basePath, `${segment}[${index}]`];
            } else {
                console.log(`generatePath - ${type} 2a. generatePath ${type} shouldFieldsBeArray:`, base, segment, type, from, shouldFieldsBeArray, index);
                return [...basePath, segment];
            }
        case 'input':
        case 'composite':
        case 'sequenceField':
        case 'variantField':
            return [...basePath, segment];
        default:
            return [...basePath, segment];
    }
};



// utils.js
export const determineInitialIndex = (existingFieldData, variants) => {
    // Safety Check: Ensure variants is defined and is an array
    if (!Array.isArray(variants) || variants.length === 0) {
        console.warn('determineInitialIndex: variants is undefined or empty', { existingFieldData, variants });
        return undefined;
    }

    if (!existingFieldData) {
        // Prefer a variant that isn't 'null'
        const preferredVariants = variants.filter(variant => variant.name !== 'null');
        const preferredVariant = preferredVariants.length > 0 ? preferredVariants[0] : variants[0];
        const index = preferredVariant.index;
        console.log('determineInitialIndex - default variant index:', index);
        return index; // Default or fallback value
    }

    if (typeof existingFieldData === 'string') {
        console.log('determineInitialIndex - existingFieldData (string):', existingFieldData);
        // Assuming existingFieldData is the name of the variant
        const r = variants.findIndex(variant => variant.name === existingFieldData);
        if (r === -1) {
            console.warn(`determineInitialIndex: Variant with name "${existingFieldData}" not found. Falling back to default.`);
            return variants[0].index;
        }
        const s = variants[r].index;
        console.log('determineInitialIndex - found variant index (string):', s);
        return s;
    } else if (typeof existingFieldData === 'object') {
        const keys = Object.keys(existingFieldData);
        if (keys.length === 0) {
            console.warn('determineInitialIndex: existingFieldData is an empty object', { existingFieldData });
            return variants[0].index;
        }
        const firstKeyName = keys[0]; // Get the first key
        console.log('determineInitialIndex - firstKeyName:', firstKeyName);

        const r = variants.findIndex(variant => variant.name === firstKeyName);
        if (r === -1) {
            console.warn(`determineInitialIndex: Variant with name "${firstKeyName}" not found. Falling back to default.`);
            return variants[0].index;
        }
        const s = variants[r].index;
        console.log('determineInitialIndex - found variant index (object):', s);
        return s;
    }

    console.warn('determineInitialIndex: Unexpected type for existingFieldData:', typeof existingFieldData);
    return ''; // Fallback for unexpected data types
};
