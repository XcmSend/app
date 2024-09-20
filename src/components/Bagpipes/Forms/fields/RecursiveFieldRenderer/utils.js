
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
                console.log('initializeDefaultValues - initialize initializeDefaultValues variant 1:', field, path);
                const defaultVariant = field.variants[0];
                if (defaultVariant.fields.length === 0) {
                    // No subfields, initialize as a simple string value
                    defaultValue = defaultVariant.name;
                } else {
                    console.log('initializeDefaultValues - initialize initializeDefaultValues variant 2:', field, path);
                    // Check the type of the first subfield to determine structure
                    const firstSubFieldType = defaultVariant.fields[0].resolvedType.type;
                    if (firstSubFieldType === 'composite') {
                        // Initialize as an object with subfields
                        defaultValue = {
                            [defaultVariant.name]: {}
                        };
                        defaultVariant.fields.forEach(subField => {
                            defaultValue[defaultVariant.name][subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'composite');
                        });
                    } else if (firstSubFieldType === 'variant') {
                        // we need to initialize the variant as an array
                        // defaultValue = [];
                        console.log('variant initializeDefaultValues - initialize initializeDefaultValues variant 3:', defaultValue, path);

                        // Initialize as an array with each element being an object representing a variant
                        defaultValue = defaultVariant.fields.map(subField => {
                             console.log('initializeDefaultValues - initialize initializeDefaultValues variant 4:', subField, path);
                            return {
                                [subField.name]: initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'variant')
                            };
                        });
                    }
                }
                break;

            case 'input':
                console.log('initializeDefaultValues - initialize initializeDefaultValues input:', path);
                defaultValue = "0";
                break;

            case 'variantField': 
            
                console.log('initializeDefaultValues - initialize initializeDefaultValues variantField:', path);
            
            case 'composite':
                console.log('initializeDefaultValues - initialize composite 01 initializeDefaultValues composite:', { field, path, fromType });
                defaultValue = {};
                if (field.fields) {
                    console.log('initializeDefaultValues - initialize composite 02 initializeDefaultValues composite field.fields:', field.fields, fromType);
                    field.fields.forEach(subField => {
                        console.log('initializeDefaultValues - initialize composite 02a initializeDefaultValues composite subField:', subField, fromType);
                        // if subfield is a sequence then initialize it as an array
                        if (subField.resolvedType.type === 'sequence') {
                            defaultValue = [];
                            console.log(`initializeDefaultValues - initialize composite ${field.type} 03a sequence initializeDefaultValues composite defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
                        } else if (subField.resolvedType.type === 'composite') {
                        defaultValue[subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'composite');
                        console.log(`initializeDefaultValues - initialize ${field.type} 03b initializeDefaultValues composite defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
                        } else if (subField.resolvedType.type === 'variant') {

                            console.log(`initializeDefaultValues - initialize ${field.type} 03a initializeDefaultValues variant defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
                            defaultValue[subField.name] = initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'variant');
                            // add something here
                            console.log(`initializeDefaultValues - initialize ${field.type} 03b initializeDefaultValues variant defaultValue:`, subField, defaultValue, `${path}.${subField.name}`, fromType);
                        } else if (subField.resolvedType.type === 'input') {
                            defaultValue[subField.name] =  initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, 'input');
                        } else {
                            defaultValue[subField.name] =  initializeDefaultValues(subField.resolvedType, `${path}.${subField.name}`, subField.resolvedType.type);
                        }
                    });
                }
                break;

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


    export const generatePath = (base, segment, type, from, isParentVariantAndAllSiblings, index) => {
        console.log(`generatePath -  ${type} 0. generatePath ${type} base, segment, type:`, base, segment, type, from);
    
        // If the segment is undefined or empty, decide how to handle based on the type
        if (segment === undefined || segment === null || segment === "") {
            console.log('Missing or empty segment', { base, segment, type });
            switch (type) {
                case 'input':
                    // For input, the path should not be modified; return base
                    return base;
                case 'variant':
                    console.log(`generatePath -  ${type} 0a. generatePath variant base, segment, type no segment:`, base, segment, type, isParentVariantAndAllSiblings, index);
                    if (isParentVariantAndAllSiblings) {
                        const r = base?  `${base}[${index}]` : `[${index}]`;
                        console.log(`generatePath -  ${type} 0a. generatePath variant base, segment, type result:`, { r, base, segment, type, isParentVariantAndAllSiblings, index });
                        return r
                    } else {
                        return base;

                    }
                    // return isParentVariantAndAllSiblings ? `${base}[${index}]` : base;
                case 'sequence':
                case 'array':
                    // For sequences and arrays, append empty brackets to suggest possible dynamic addition later
                    return base ? `${base}[]` : "[]";
                case 'initialBase':
                    // For initialBase, if segment is empty, do not modify the base into an array
                    return base;
                default:
                    // For other types where segment is not relevant, return just the base
                    return base;
            }
        }
    
        // For cases where segment is not empty
        switch (type) {
            case 'variant':
                console.log(`generatePath -  ${type} 0a. generatePath variant base, segment, type:`, { base, segment, type, isParentVariantAndAllSiblings, index });
                if (isParentVariantAndAllSiblings) {
                    // If all siblings are variants, include the index in the path
                    if (base) {
                        return `${base}.${segment}[${index}]`;  // Use dot notation to combine base and segment, then append index
                    } else {
                        return `${segment}[${index}]`;  // If no base, start directly with segment and index
                    }
                } else {
                    // If not all siblings are variants, return the standard path without indexing
                    return base ? `${base}.${segment}` : segment;
                }

            case 'composite':
            case 'variantField':
                // Standard handling using dot notation if base is present
                const result = base ? `${base}.${segment}` : segment;
                console.log(`generatePath -  ${type} 0b. generatePath composite result:`, result);
                return result;
            case 'input':
                // Input fields do not need modification of path; return base
                return base;
            case 'sequence':
            case 'array':
            case 'tuple':
                // Handle as an index into an array or tuple
                return `${base}[${segment}]`;
            case 'initialBase':
                // For initialBase, create an array notation only when base is provided
                const r = base ? `${base}[${segment}]` : `[${segment}]`;
                console.log(`RecursiveFieldRenderer -  ${type} 0c. generatePath initialBase r:`, r);
                return r;
            default:
                // Fallback for unexpected types
                return `${base}.${segment}`;
        }
    };




  export   const determineInitialIndex = (existingFieldData, variants) => {
        if (!existingFieldData) {
            const r = variants[0].index;
            console.log('RecursiveFieldRenderer - variant 2a. determineInitialIndex r:', r);
            return r; // default or fallback value

        }
    
        if (typeof existingFieldData === 'string') {
            console.log('RecursiveFieldRenderer - variant 2a. determineInitialIndex existingFieldData:', existingFieldData);
            // Assuming existingFieldData is the name of the variant
            const r = variants?.findIndex(variant => variant.name === existingFieldData);
            const s = variants[r]?.index

            console.log('RecursiveFieldRenderer - variant 2d. determineInitialIndex r string:',s, r, existingFieldData);
            return s;
        } else if (typeof existingFieldData === 'object') {
            // If it's an object, we assume it might have a key that corresponds to a variant name
     
            const firstKeyName = Object.keys(existingFieldData)[0]; // Get the first key

            console.log('RecursiveFieldRenderer - variant 2c. determineInitialIndex firstKeyName:', firstKeyName, existingFieldData, variants );
            // i think we need to convert firstKetName to an integer
            const r = variants.findIndex(variant => variant.name === firstKeyName);
            const s = variants[r]?.index
            
            console.log('RecursiveFieldRenderer - variant 2d. determineInitialIndex r:', s, r, firstKeyName, existingFieldData);
        
            return s;
        }
    
        return ''; // fallback if data type is unexpected
    };