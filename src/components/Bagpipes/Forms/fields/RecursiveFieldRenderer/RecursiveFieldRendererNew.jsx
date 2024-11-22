import React, { useState, useEffect, useRef } from 'react';
import CustomInput from '../CustomInput';
import { Select } from 'antd';
import useAppStore from '../../../../../store/useAppStore';
import {  initializeDefaultValues, generatePath, determineInitialIndex } from './utils';
import { handleChange } from './changeHandler';
import _, { set, update } from 'lodash';
import initializeVariantFields from './initializeVariantFields';
import useTooltipClick  from '../../../../../contexts/tooltips/tooltipUtils/useTooltipClick';
import { usePanelTippy } from '../../../../../contexts/tooltips/TippyContext';
import '../../PopupForms/ChainForms/ChainTxForm/DynamicFieldRenderer';
import './RecursiveFieldRenderer.scss';



const { Option } = Select;

const RecursiveFieldRenderer = ({ fieldObject, formValues, onChange, nodeId, pills, setPills, onPillsChange, fieldName, fieldPath, fromType }) => {

    console.log(`RecursiveFieldRenderer - CYCLE CHECK fieldObject, formValues, fieldName, nodeId, ${fieldPath}`, { fromType, fieldObject, formValues, fieldName, nodeId, fieldPath });

    /// For the Panel Form... Notify that content has changed
    const { tippyPanelInstance } = usePanelTippy();
    const handleContentChange = () => {  if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) { tippyPanelInstance.current.popperInstance.update(); } };
    const { handleInputClick } = useTooltipClick(nodeId, handleContentChange);
    ///

    const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        saveNodeFormData: state.saveNodeFormData,
        clearSignedExtrinsic: state.clearSignedExtrinsic,
        markExtrinsicAsUsed: state.markExtrinsicAsUsed,
        updateNodeResponseData: state.updateNodeResponseData,
       }));

    const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
    const existingFieldData = _.get(formData.params, fieldPath);
    const hasInitializedVariantFields = useRef(false);
    const fieldType = fieldObject.type;

    const sequenceData = _.get(formData.params, fieldPath, []);
    const [items, setItems] = useState(() => {
        const dataArray = Array.isArray(sequenceData) ? sequenceData : [sequenceData];
        return dataArray.map((item, index) => ({
            value: item,
            pathKey: generatePath(fieldPath, index, 'sequenceItem', 'sequenceItem'),
        }));
    });

    const initialArrayItems = formValues?.[fieldName] || Array.from({ length: fieldObject.length }, () => ({}));

    const [arrayItems, setArrayItems] = useState(initialArrayItems);
    const [selectedIndex, setSelectedIndex] = useState(null);



    // existing field data looks at the current field path and checks if there is any data there. In each switch statement this is used to check if the field has been initialized. If it has not been initialized, then the default values are set.

    console.log(`RecursiveFieldRenderer - CHECKING ${fieldType} 1. fieldObject, formValues, fieldName, nodeId, fieldPath:`, { fieldObject, fieldName, nodeId, fieldPath });




//     useEffect(() => {
//   if (selectedIndex === null || selectedIndex === undefined) {
//     const determinedIndex = determineInitialIndex(existingFieldData, fieldObject.variants);
//     if (determinedIndex !== selectedIndex) {
//       console.log('Assigning selectedIndex value in useEffect:', { determinedIndex, fieldPath });
//       setSelectedIndex(determinedIndex);
//     }
//   }
// }, [existingFieldData, fieldObject.variants]);


        // FOR INPUT

        const handleInputChange = (path, newValue, fieldName) => {

            console.log(`RecursiveFieldRenderer - input handleInputChange about to change formValues input:`,{ path, newValue, formValues });
            // let updatedParams = _.set(formData.params, path, newValue);
            
            const updatedParams = handleChange(path, newValue, false, 'input', formData);
            console.log(`RecursiveFieldRenderer - input updated params after handleInputChange input:`, updatedParams, path, newValue);


            saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });

        };


        // FOR VARIANT
        useEffect(() => {
            // within this hook we also need to clear the previous variant that was selected.
            if (selectedIndex !== null && fieldObject.type === 'variant' && fieldObject.variants && fieldObject.variants.length > 0) {
                const existingVariantData = _.get(formData.params, fieldPath);
                if (!existingVariantData && !hasInitializedVariantFields.current) {
                    const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedIndex);
                    if (selectedVariant) {
                        const updatedParams = initializeVariantFields(selectedVariant, fieldPath, formData, false);
                        saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
                        hasInitializedVariantFields.current = true; // Prevent re-initialization
                    } else {
                        console.warn('RecursiveFieldRenderer - variant: Selected variant not found', { selectedIndex, fieldObject });
                    }
                }
            }
        }, [selectedIndex]);
    
        // ALSO FOR VARIANT 
        useEffect(() => {
            if (
                fieldObject &&
                fieldObject.type === 'variant' &&
                Array.isArray(fieldObject.variants) &&
                fieldObject.variants.length > 0
            ) {
                const initialIndex = determineInitialIndex(existingFieldData, fieldObject.variants);
                setSelectedIndex(initialIndex !== undefined ? initialIndex : fieldObject.variants[0].index);
            }
        }, [fieldObject, existingFieldData]);
    
    
        const handleVariantChange = selectedValue => {
            const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
            if (selectedVariant && selectedIndex !== selectedValue) {
                console.log(`Changing variant from index ${selectedIndex} to ${selectedValue}`, { fieldPath });
        
                // Clear old variant data
                const updatedParams = _.cloneDeep(formData.params);
                _.unset(updatedParams, fieldPath);
        
                // Initialize new variant data
                const newParams = initializeVariantFields(selectedVariant, fieldPath, { ...formData, params: updatedParams }, false);
        
                // Save the updated form data
                saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: newParams });
        
                // Update selectedIndex after form data is updated to prevent re-render issues
                setSelectedIndex(selectedValue);
            }
            console.log(`RecursiveFieldRenderer - variant 3. handleVariantChange selectedValue, selectedVariant, selectedIndex:`,{ selectedValue, selectedVariant, selectedIndex });
    
        };
        

    

        // FOR ARRAY

        // Effect to update arrayItems when the length changes
        useEffect(() => {
            // Only reset arrayItems if the length actually changes to avoid unnecessary re-renders
            if (arrayItems.length !== fieldObject.length) {
                setArrayItems(Array.from({ length: fieldObject.length }, () => ({})));
            }
        }, [fieldObject.length]); // Dependency on fieldObject.length





    console.log('RecursiveFieldRenderer - fieldObject, existingFieldData:', { fieldObject, existingFieldData, fieldPath, formValues });

    switch (fieldType) {
        case 'input':

        const getFormDataForInput = _.get(formData.params, fieldPath, null);
        console.log('RecursiveFieldRenderer - input getFormDataForInput 1:', getFormDataForInput, fieldPath);

            // if we have made every input an object that contains typeName as well as the value

            if (getFormDataForInput === undefined || getFormDataForInput === null) {
                console.log('RecursiveFieldRenderer - input 1. no getFormDataForInput:', fieldObject, getFormDataForInput, fieldPath);
                const initialValue = initializeDefaultValues(fieldObject, fieldPath, 'fromInput');

                const updatedParams = handleChange(fieldPath, initialValue, false, 'input', formData);
                console.log('RecursiveFieldRenderer - input 3. updatedParams:', { updatedParams, fieldPath, initialValue });
                saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });

            }

            console.log('RecursiveFieldRenderer - input getFormDataForInput formValues, fieldObject:', { fieldPath, fieldName, formValues,getFormDataForInput, fieldObject, fieldType });   
            console.log('RecursiveFieldRenderer - input fieldPath formValues:', { fieldPath, formValues }); 

            const inputStyle = fieldObject.typeName === "Bytes" && (getFormDataForInput === '0' || getFormDataForInput === '0x')
            ? 'background-bytes'
            : '';

            let prevId = '';
            if (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'composite') {
            // we want to get the prev id of the field path, so we can use it to get the previous value.
                 prevId = fieldObject?.path?.[fieldObject.path.length - 2]?.id;
            console.log('RecursiveFieldRenderer - input prevId in composite:', prevId);

            } else if (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'variant') {
                // we want to get the prev id of the field path, so we can use it to get the previous value.
                 prevId = fieldObject?.path?.[fieldObject.path.length - 1]?.id;
                console.log('RecursiveFieldRenderer - input prevId in variant:', prevId);
            } else if  (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'sequence') {
                prevId = fieldObject?.path?.[fieldObject.path.length - 1]?.id;
            } else {
                prevId = fieldObject?.path?.[fieldObject.path.length - 2]?.id;
            }

            return (
                <div className='input-container'>
                    <div className='input-field'>
                    <label className='font-semibold'>{fieldName ? <> <span className="field-name">{`${fieldName}`}</span><span className="type-name"> {'<'}{fieldObject.typeName}{'>'}</span> </> :<> <span className="field-name">Input:</span><span className="type-name"> {'<'}{fieldObject.typeName}{'>'} </span> </>}</label>                    
                    <CustomInput
                        key={prevId}
                        value={getFormDataForInput} 
                        onChange={newValue => handleInputChange(fieldPath, newValue, fieldName)}
                        onPillsChange={onPillsChange}
                        placeholder={`Enter ${fieldObject.typeName}`}
                        className={`custom-input ${inputStyle}`}
                        pills={pills}
                        setPills={setPills}
                        nodeId={nodeId}
                        onClick={handleInputClick} 
                    />
                    </div>
                </div>
            );

        
        case 'variant': {
        // This case is for variant and its children. 

        if (!fieldObject.variants || fieldObject.variants.length === 0) {
            console.warn('No variants available for fieldObject:', fieldObject);
            return <div>No variants available.</div>;
        }

           

            console.log('RecursiveFieldRenderer - variant 1a. existingFieldData:', { existingFieldData,fieldPath, formData, fieldObject, selectedIndex });
            

            const selectedValue = _.get(formData.params, `${fieldPath}`, '');
            console.log('RecursiveFieldRenderer - variant 2i. selectedValue and existingFieldData:', { selectedValue, existingFieldData, fieldPath });
            

            // Generate the selected variant object
            const selectedVariant = fieldObject?.variants.find(variant => variant.index === selectedIndex);
            const hasMultipleFields = selectedVariant?.fields?.length > 1;
            const fieldsAreUnnamed = selectedVariant?.fields?.every(field => !field.name);
        
            console.log('RecursiveFieldRenderer - variant 2j. selectedVariant:', { selectedIndex, selectedVariant, fieldPath, hasMultipleFields, fieldsAreUnnamed });

            if (!selectedVariant) {
                console.warn('RecursiveFieldRenderer - variant: Selected variant not found', { selectedIndex, fieldObject });
                return <div>Selected variant not found.</div>;
            }            
            const selectedVariantName = selectedVariant?.name;
            console.log('RecursiveFieldRenderer - variant 2j. selectedVariantName:', { selectedVariantName, selectedVariant, fieldPath });
            const variantPath = generatePath(fieldPath, selectedVariantName, 'variant', 'variantSecond');

            // Determine if multiple input fields exist
            const inputFields = selectedVariant.fields.filter(f => f.resolvedType.type === 'input');
            console.log('RecursiveFieldRenderer - variant 2k. inputFields:', { fieldObject, inputFields, fieldPath });
            const hasMultipleInputFields = inputFields.length > 1;

            return (
                <div className='variant-container'>
                    <div className='variant-selector'>
                        <Select
                            value={selectedIndex}
                            onChange={handleVariantChange}
                            className='w-full font-semibold custom-select'
                            placeholder="Select option"
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {fieldObject.variants.map(variant => (
                                <Option key={variant.index} value={variant.index}>{variant.name}</Option>
                            ))}
                        </Select>
                    </div>
                    {selectedIndex !== null && fieldObject.variants.find(variant => variant.index === selectedIndex)?.fields.map((field, index) => {
                        console.log('RecursiveFieldRenderer - variant field before fieldVariantPath:', field, fieldPath);
                    
                        // const isAllSiblingsVariant = selectedVariant.fields.every(f => f.resolvedType.type === 'variant');




                        console.log('RecursiveFieldRenderer - variant field before fieldVariantPath:', field, fieldPath);
                        let subFieldsType = field.resolvedType.type;
                        let subFieldPath;
                        let fieldName = field.name;
                    
                        // Check if the field is a composite with typeId === "1"
                        if (field?.resolvedType?.fields?.[0]?.typeId === "1") {
                            // Flatten the composite field by not adding the field name to the path
                            subFieldPath = variantPath; // Use variantPath directly
                            fieldName = selectedVariantName; // Use the variant name as the field name
                            console.log('RecursiveFieldRenderer - variant field is type id 1:', { field, subFieldPath, fieldName });
                        } else if (fieldsAreUnnamed && hasMultipleFields) {
                            // Fields are unnamed, store them as array elements
                            subFieldPath = generatePath(
                                variantPath,
                                '', // Empty segment
                                'variant',
                                'variantThird',
                                true,
                                index // Use index for array
                            );
                            fieldName = null; // No field name
                        } else if (fieldsAreUnnamed && !hasMultipleFields) {
                            // Single unnamed field, use variantPath directly
                            subFieldPath = variantPath;
                            fieldName = null; // No field name
                            console.log('RecursiveFieldRenderer - variant field is UNNAMED AND has multiple fields:', { field, subFieldPath, fieldName });

                          } else {
                            // Regular path generation for named fields
                            subFieldPath = generatePath(
                                variantPath,
                                field.name,
                                subFieldsType,
                                'variantThird',
                                false,
                                field.index
                            );
                        }
                


                  console.log('RecursiveFieldRenderer - variant subFieldPath:', { variantPath, subFieldPath, field });

                  return (
                      <div className='variant-field' key={index}>
                          <label className='font-semibold'>
                              {field.resolvedType.type === "input" ? null : (
                                  <>
                                      {fieldName && <span className="field-name">{fieldName}</span>}
                                      <span className="type-name">{` <${field.resolvedType.typeName}>`}</span>
                                  </>
                              )}
                          </label>
                          <RecursiveFieldRenderer
                              fieldObject={field.resolvedType}
                              formValues={_.get(formData.params, subFieldPath, {})}
                              fieldPath={subFieldPath}
                              nodeId={nodeId}
                              fromType={'variantField'}
                              fieldName={fieldName}
                          />
                      </div>
                  );
              })}
          </div>
      );
    }
  
          
        case 'composite':
            console.log('RecursiveFieldRenderer - composite 1a. :', { fieldObject, fieldPath });
            
            return (
                <div className="composite-container">
                    {fieldObject.fields.map((field, index) => {
                        const subFieldType = field.resolvedType.type;
                        const subFieldPath = generatePath(fieldPath, field.name, subFieldType === 'sequence' ? 'sequenceField' : 'compositeField', 'fromComposite');    // const subFieldPath = `${fieldPath}.${field.name}`;
                        console.log('RecursiveFieldRenderer - composite initialize composite rrr 3. subFieldPath:', fieldPath, field, subFieldPath, field.resolvedType);
                        return (
                         
                            <div key={index} className="composite-field">
                            <label className='font-semibold'> {field?.resolvedType?.type === "input" ? null : <> {field?.name && <span className="field-name">{field.name}</span>}<span className="type-name">{'<'}{field?.resolvedType?.typeName}{'>'}</span> </>}</label>                                
                            <RecursiveFieldRenderer
                                    fieldObject={field.resolvedType}
                                    formValues={formData.params?.[subFieldPath] || {}}
                                    fieldPath={subFieldPath}
                                    nodeId={nodeId}
                                    fieldName={field.name}
                                    fromType={'compositeField'}
                                />
                                
                            </div>
                     
                        );
                    })}
                </div>
            );
        

            case 'sequence':
                console.log('RecursiveFieldRenderer - sequence:', fieldObject);
            
                const sequenceData = _.get(formData.params, fieldPath, []);
                const items = Array.isArray(sequenceData) ? sequenceData.map((_, idx) => idx) : [];
            
                const handleAddItem = () => {
                    const newItemDefaultValue = initializeDefaultValues(
                        fieldObject.elementType,
                        [...fieldPath, items.length],
                        'sequenceDefault'
                    );
            
                    const updatedParams = _.cloneDeep(formData.params);
                    const arrayData = _.get(updatedParams, fieldPath, []);
            
                    if (!Array.isArray(arrayData)) {
                        _.set(updatedParams, fieldPath, []);
                    }
            
                    _.update(updatedParams, fieldPath, arr => {
                        arr.push(newItemDefaultValue);
                        return arr;
                    });
            
                    saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
                };
            
                const handleRemoveItem = (index) => {
                    const updatedParams = _.cloneDeep(formData.params);
                    const arrayData = _.get(updatedParams, fieldPath, []);
            
                    if (Array.isArray(arrayData)) {
                        arrayData.splice(index, 1);
                        _.set(updatedParams, fieldPath, arrayData);
                        saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
                    }
                };
            
                return (
                    <div className='sequence-container'>
                        <div className='add-remove-box'>
                            <button className='sequence-button' onClick={handleAddItem}>
                                <div className='add-button'>+</div>
                                <label>Add item</label>
                            </button>
                        </div>
                        {items.map((index) => (
                            <React.Fragment key={index}>
                                <label className='font-semibold'>
                                    <span className="index-style">{index}:</span>
                                    <span className="type-name">{' <'}{fieldObject.typeName}{'>'}</span>
                                </label>
                                <div className='sequence-item'>
                                    <RecursiveFieldRenderer
                                        fieldObject={fieldObject.elementType}
                                        formValues={_.get(formData.params, [...fieldPath, index])}
                                        nodeId={nodeId}
                                        fieldPath={[...fieldPath, index]}
                                        fromType={'sequenceField'}
                                    />
                                </div>
                                <div className='add-remove-box'>
                                    <button className='sequence-button' onClick={() => handleRemoveItem(index)}>
                                        <div className='remove-button'>-</div>
                                        <label>Remove item</label>
                                    </button>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                );

                
        // an array just displays other fields it doesnt really do changing, so maybe should just pass it through. The reason why i say this is because if i select a variant within an array, the formObject that is passed in, does not go into the nested object it just passes what is already there. Therefore the next fields are not rendered. 
        case 'array':
            console.log('RecursiveFieldRenderer - array:', fieldObject);
        
         
           


        
            // Handle change: propagate up instead of managing locally
            const handleChangeArrayItem = (index, newValue) => {
                const updatedArrayItems = [...arrayItems];
                updatedArrayItems[index] = newValue;
                setArrayItems(updatedArrayItems);  // Update local state to trigger re-render
                onChange({...formValues, [fieldName]: updatedArrayItems}); // Propagate changes up
            };
        
            return (
                <div className='array-container'>
                    {arrayItems.map((item, index) => (
                        <div key={index} className='array-item'>
                            <label className='font-semibold'> {field?.resolvedType?.type === "input" ? null : <> {field?.name && <span className="field-name">{field.name}</span>}<span className="type-name">{'<'}{field?.resolvedType?.typeName}{'>'}</span> </>}</label>                                
                            <RecursiveFieldRenderer
                                fieldObject={fieldObject.elementType}
                                formValues={item}
                                onChange={(newValue) => handleChangeArrayItem(index, newValue)}
                                nodeId={nodeId}
                                fieldPath={generatePath(fieldPath, item.index, 'array', 'arraySecond')}
                                fromType = {'arrayField'}

                            />
                        </div>
                    ))}
                </div>
            );

            case 'tuple':
                const handleTupleChange = (index, newValue) => {
                    // Create a new copy of the tupleItems with updated value at the specified index
                    const updatedTupleItems = [...formValues[fieldName] || []];
                    updatedTupleItems[index] = newValue;
            
                    // Update the tuple in the main form values object
                    onChange({...formValues, [fieldName]: updatedTupleItems});
                };
            
                console.log('RecursiveFieldRenderer - tuple:', fieldObject);
                return (
                    <div className="tuple-container">
                        {fieldObject.elements.map((element, index) => {
                            return (
                                <div key={index} className="tuple-item">
                                    <label className='font-semibold'>{`Element ${index}: <${element.resolvedType.typeName || element.type}>`}</label>
                                    <RecursiveFieldRenderer
                                        fieldObject={element.resolvedType}
                                        formValues={(formValues?.[fieldName] || [])[index]}
                                        onChange={(newValue) => handleTupleChange(index, newValue)}
                                        nodeId={nodeId}
                                        fieldPath={generatePath(fieldPath, element.name, 'tuple', 'tupleSecond')}
                                        fromType={'tuple'}

                                    />
                                </div>
                            );
                        })}
                    </div>
                );
                
            case 'tupleElement':  // This case might be similar to how fields within composites are handled
                console.log('RecursiveFieldRenderer - tupleElement:', fieldObject);
                // Assume tuple elements behave similarly to fields, potentially wrapping additional logic or styling if needed
                return (
                    <RecursiveFieldRenderer
                        fieldObject={fieldObject.resolvedType}
                        formValues={formValues}
                        onChange={onChange}
                        nodeId={nodeId}
                        fieldName={fieldName}
                        />
                    );
            

                    default:
                        console.log('RecursiveFieldRenderer - default:', fieldObject);
                        return <div key={fieldName}>Unsupported field type: {fieldType}</div>;
                }
            };
                
        export default RecursiveFieldRenderer;

