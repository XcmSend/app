import _ from 'lodash';

export const handleChange = (path, newValue, replace = false, type, formData, initialize = false, subFieldsType) => {
    console.log(`handleChange - ${type} 2d. handleChange path, newValue, replace, type:`,{ path, newValue, replace, type });

   let updatedParams = { ...formData.params }; // Clone the existing params
   let currentValue = _.get(updatedParams, path, {});

    console.log(`handleChange - ${type} 2e. handleChange updatedParams before handleChange:`, updatedParams, currentValue, path);


    if (replace) {
        console.log(`handleChange - ${type} 2f. replace true handleChange updatedParams before handleChange:`, { updatedParams, path });
        // When replacing, particularly for variants, clear the existing structure completely before setting the new value
        if (type === 'variant') {
            // Clear the old structure if needed
            let currentVariantStructure = _.get(updatedParams, path, {});
            if (typeof currentVariantStructure === 'object') {
                console.log(`handleChange - ${type} 2g. handleChange currentVariantStructure:`, currentVariantStructure);
                Object.keys(currentVariantStructure).forEach(key => {
                    _.unset(updatedParams, `${path}.${key}`); // Clear each nested field
                });
            }
        }
        // Set the new value for the path
        _.set(updatedParams, path, newValue);
  
   } else {
       console.log(`handleChange - ${type}2f. handleChange updatedParams before handleChange:`, {  updatedParams, path });
       console.log(`handleChange - ${type}   2g. handleChange currentValue:`, { currentValue, newValue, path });

    //    if (Array.isArray(currentValue)) {
    //         if (initialize) {
    //             // Initialize the array with new values, this typically replaces the entire array
    //             updatedParams[path] = [newValue];
    //         } else {
    //             console.log(`handleChange - ${type} 2h. handleChange we're in array area... currentValue, newValue:`, { currentValue, newValue, path  });
    //             // Append or merge new values into the existing array
    //             updatedParams[path] = [...currentValue, newValue];
    //         }

    //     } 
        
        if (typeof currentValue !== 'object' && typeof newValue === 'object') {
         //   console.log(RecursiveFieldRenderer - ${type}  2h. handleChange currentValue:, currentValue);
        currentValue = {};
        } else {

            if (type === 'composite') {
                console.log(`handleChange - ${type} 2i. handleChange we're in composite area... currentValue, newValue:`, { currentValue, newValue, path  });
                _.set(updatedParams, path, { ...currentValue, ...newValue });

            } else if (type === 'variant') {
                console.log(`handleChange - ${type} 2j. handleChange we're in variant area... currentValue, newValue:`, { currentValue, newValue, path  });

                // if sub field type is a variant then we need to make sure that the new value is the key of an array. and then we set the updated params correctly
                if (subFieldsType === 'variant') {
                    console.log(`handleChange - ${type} 2k. handleChange we're in variant area... currentValue, newValue:`, { currentValue, newValue, path  })
                    // If subfield type is also a variant, manage it as an array directly named by newValue
                    let newArray = { [newValue]: [] }

                    _.set(updatedParams, path, newArray );
                } else {
                    // Standard variant handling, set or replace the value directly
                    _.set(updatedParams, path, newValue);
                }
        
            } else if (type === 'input') {
                console.log(`handleChange - ${type} 2j. handleChange we're in input area... currentValue, newValue:`, { currentValue, newValue, path  });
                // For inputs, you might want to handle the value differently
                _.set(updatedParams, path, newValue);
                console.log(`handleChange - ${type} 2k. handleChange input updatedParams after handleChange:`, updatedParams, newValue, path);
        }
    }
        // _.set(updatedParams, path, { ...currentValue, ...newValue });
   }
   return updatedParams;

};
