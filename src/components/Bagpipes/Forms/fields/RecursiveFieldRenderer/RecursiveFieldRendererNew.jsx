import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { Select } from 'antd';
import { CompositeField, SequenceField} from '../SubstrateMetadataFields';
import { resolveFieldType } from '../../PopupForms/ChainForms/parseMetadata/resolveFieldType';
import useAppStore from '../../../../../store/useAppStore';
import { initializeFormData, initializeDefaultValues, generatePath, determineInitialIndex } from './utils';
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

    const { scenarios, activeScenarioId, saveNodeFormData, clearSignedExtrinsic, markExtrinsicAsUsed, updateNodeResponseData } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        saveNodeFormData: state.saveNodeFormData,
        clearSignedExtrinsic: state.clearSignedExtrinsic,
        markExtrinsicAsUsed: state.markExtrinsicAsUsed,
        updateNodeResponseData: state.updateNodeResponseData,
       }));

    const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
    const existingFieldData = _.get(formData.params, fieldPath);
    const [selectedIndex, setSelectedIndex] = useState('');

    // FOR ARRAY
    // Initialize array items based on existing formValues or provide defaults.
    const initialArrayItems = formValues?.[fieldName] || Array.from({ length: fieldObject.length }, () => ({}));
    const [arrayItems, setArrayItems] = useState(initialArrayItems);
    // For Array
    // Effect to update arrayItems when the length changes
    useEffect(() => {
        // Only reset arrayItems if the length actually changes to avoid unnecessary re-renders
        if (arrayItems.length !== fieldObject.length) {
            setArrayItems(Array.from({ length: fieldObject.length }, () => ({})));
        }
    }, [fieldObject.length]); // Dependency on fieldObject.length



    // FOR SEQUENCE
    // Initialize sequence items safely by checking if the path points to an array
            // Initialization and state management for sequence items
            const [items, setItems] = useState(() => {
                // Assuming formData.params[fieldPath] is directly the array for this sequence
                return formData.params?.[fieldPath] ? formData.params?.[fieldPath].map((item, index) => ({
                    value: item,
                    pathKey: `${fieldPath}[${index}]`, // Directly constructing pathKey
                })) : [];
            });

    const fieldType = fieldObject.type;

    // existing field data looks at the current field path and checks if there is any data there. In each switch statement this is used to check if the field has been initialized. If it has not been initialized, then the default values are set.

    console.log(`RecursiveFieldRenderer - CHECKING ${fieldType} 1. fieldObject, formValues, fieldName, nodeId, fieldPath:`, { fieldObject, fieldName, nodeId, fieldPath });

    // if setSelectedIndex has been used then we need to use a hook to update the form data.
    useEffect(() => {
        console.log(`RecursiveFieldRenderer - variant effect 0. selectedIndex, fieldObject.variants, formData, fieldPath:`, { selectedIndex, fieldObject, formData, fieldPath });
        if (selectedIndex !== null && fieldType == 'variant') {
            const selectedVariant = fieldObject.variants?.find(variant => variant.index === selectedIndex);
            console.log(`RecursiveFieldRenderer - variant effect 0a. selectedVariant, fieldPath, existingFieldData:`, { selectedVariant, fieldPath, existingFieldData });
            if (selectedVariant) {
                const updatedParams = initializeVariantFields(selectedVariant, fieldPath, formData, false); // isDefault is false here because we  are making an update. 
                console.log(`RecursiveFieldRenderer - variant effect 1. Initialize:`, { selectedVariant, fieldPath });
                saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
            }
        } 

    }, [selectedIndex]);




    const handleInputChange = (path, newValue) => {

        console.log(`RecursiveFieldRenderer - input handleInputChange about to change formValues input:`,{ path, newValue, formValues });
        // let updatedParams = _.set(formData.params, path, newValue);
        
        const updatedParams = handleChange(path, newValue, false, 'input', formData);
        console.log(`RecursiveFieldRenderer - input updated params after handleInputChange input:`, updatedParams, path, newValue);


        saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });

    };

       


    
  
    console.log('RecursiveFieldRenderer - fieldObject, existingFieldData:', { fieldObject, existingFieldData, fieldPath });

    switch (fieldType) {
        case 'input':

            const getFormDataForInput = _.get(formData, `params.${fieldPath}`, null)
            console.log('RecursiveFieldRenderer - input getFormDataForInput:', getFormDataForInput, fieldPath);

            // if we have made every input an object that contains typeName as well as the value

            if (!getFormDataForInput) {
                console.log('RecursiveFieldRenderer - input 1. no getFormDataForInput:', fieldObject, getFormDataForInput, fieldPath);
                const initialValue = initializeDefaultValues(fieldObject, fieldPath, 'fromInput');

                const updatedParams = handleChange(fieldPath, initialValue, false, 'input', formData);
                console.log('RecursiveFieldRenderer - input 3. updatedParams:', { updatedParams, fieldPath, initialValue });
                saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });

            }

            console.log('RecursiveFieldRenderer - input formValues, fieldObject:', { fieldPath, fieldName, formValues, fieldObject, fieldType });   
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
                        onChange={newValue => handleInputChange(fieldPath, newValue)}
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

        
        case 'variant':
        // This case is for variant and its children. 


            const handleVariantChange = selectedValue => {
                // the below selectedVariant is the actual variant object that is selected
                const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
                if (selectedIndex !== selectedValue) { // Check if really needs updating
                    console.log(`RecursiveFieldRenderer - variant 2.  handleVariantChange selectedValue, selectedVariant, selectedIndex:`,{ selectedValue, selectedVariant, selectedIndex, fieldPath});
                    setSelectedIndex(selectedValue);                
                }
                console.log(`RecursiveFieldRenderer - variant 3. handleVariantChange selectedValue, selectedVariant, selectedIndex:`,{ selectedValue, selectedVariant, selectedIndex });
            }

            console.log('RecursiveFieldRenderer - variant 1a. existingFieldData:', { existingFieldData,fieldPath, formData });
            
            if (!selectedIndex) {

             const destermineSelectedIndex = determineInitialIndex(existingFieldData, fieldObject.variants);
                console.log('RecursiveFieldRenderer - variant 1b. assigning selectedIndex value:', { selectedIndex, fieldPath });
                setSelectedIndex(destermineSelectedIndex);
                // handleChange(fieldPath, { [defaultName]: initialValues }, false, 'variant', formData);

                // else if (selectedIndex === '' && existingFieldData) {
                //     const initialSelectedIndex = determineInitialIndex(existingFieldData, fieldObject.variants);
                //     console.log('RecursiveFieldRenderer - variant 1c. assigning selectedIndex value:', { selectedIndex, fieldPath, initialSelectedIndex });
                //     setSelectedIndex(initialSelectedIndex);

                // }
            } else {
                console.log('RecursiveFieldRenderer - variant 1b. already selectedIndex value:', { selectedIndex, fieldPath });
            }
            if (!existingFieldData && fieldType === 'variant') {
                console.log('RecursiveFieldRenderer - variant 2a. initialize variant:', { fieldPath });
                initializeVariantFields(fieldObject.variants[0], fieldPath, formData, true ); // isDefault = true here 
            }

            const selectedValue = _.get(formData.params, `${fieldPath}`, '');
            console.log('RecursiveFieldRenderer - variant 2i. selectedValue and existingFieldData:', { selectedValue, existingFieldData, fieldPath });
            

            const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedIndex);
            const selectedVariantName = selectedVariant?.name;
            const variantPath = generatePath(fieldPath, selectedVariantName, 'variant', 'variantSecond');



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
                        const subFieldsType = field.resolvedType.type;

                        // we need to create a siblings check to see if all the fields are variants. If they are then when generating a path it should be an array. If not all variants then we should make it blank. 
                        const isAllSibilingsVariantThenPassAsParentType = fieldObject.variants.find(variant => variant.index === selectedIndex)?.fields.every(field => field.resolvedType.type === 'variant');
                        console.log('RecursiveFieldRenderer - variant field isAllSibilingsVariantThenPassAsParentType:', isAllSibilingsVariantThenPassAsParentType, fieldPath, field.name, field);
                        const subFieldPath = generatePath(variantPath, field.name, subFieldsType, 'variantThird', isAllSibilingsVariantThenPassAsParentType, field.index);
                        // const fieldVariantPath = `${fieldPath}.${defaultName}`;
                        console.log('RecursiveFieldRenderer - variant field rrr:',{ subFieldPath, field, fieldPath}, field.name, field.resolvedType.type);
            
                        return(
                            <div className='variant-field' key={index}>
                            <label className='font-semibold'> {field?.resolvedType?.type === "input" ? null : <> {field?.name && <span className="field-name">{field.name}</span>}<span className="type-name">{'<'}{field?.resolvedType?.typeName}{'>'}</span> </>}</label>                                
                            <RecursiveFieldRenderer
                                    fieldObject={field.resolvedType}
                                    formValues={_.get(formData, `params.${subFieldPath}`, {})}
                                    fieldPath={subFieldPath}
                                    nodeId={nodeId}
                                    fromType={'variantField'}
                                    fieldName={field.name}
                                />
                            </div>
                        );
                    })}
                </div>
            );
          
        case 'composite':
            console.log('RecursiveFieldRenderer - composite 1a. :', { fieldObject, fieldPath });
    
            
            // const existingCompositeData = _.get(formData, fieldPath);
            // console.log('RecursiveFieldRenderer - composite 1b. existingCompositeData:', { existingCompositeData, fieldPath });
            // if (!existingCompositeData && fieldType === 'composite') {
            //     console.log('RecursiveFieldRenderer - composite 2a. initialize composite:', { fieldPath });
            //     const initialValues = {};
            //     fieldObject.fields.forEach(field => {
            //         initialValues[field.name] = initializeDefaultValues(field.resolvedType, `${fieldPath}.${field.name}`); 
            //     });
            //     handleChange(fieldPath, initialValues, false, 'composite', formData); // Set initialized data into state
            // } else {
            //     console.log('RecursiveFieldRenderer - composite 2c. already existingCompositeData:', existingCompositeData, fieldPath);
            // }
            
            return (
                <div className="composite-container">
                    {fieldObject.fields.map((field, index) => {
                        const subFieldPath = generatePath(fieldPath, field.name, 'compositeField', 'fromComposie' );
                        // const subFieldPath = `${fieldPath}.${field.name}`;
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
            
                            
            // Add new item to the sequence
            const handleAddItem = () => {
                const newItemDefaultValue = initializeDefaultValues(fieldObject.elementType, fieldPath, 'sequenceDefault'); // Default values based on type
                const newItem = { value: newItemDefaultValue, pathKey: `params[${items.length}]` }; // Adjust pathKey to array access
                const updatedItems = [...items, newItem];
                setItems(updatedItems);
                handleChange(`params[${items.length}]`, newItemDefaultValue, false, 'sequence', formData);
            };

            // Remove item from the sequence
            const handleRemoveItem = (index) => {
                const newItems = items.filter((_, i) => i !== index);
                setItems(newItems);
                // Assuming `fieldPath` correctly points to the array in `params`
                // Update the array at the specific path to reflect the removal of the item
                const updatedArray = newItems.map(item => item.value);
                // Properly setting the entire sequence array
                const updatedParams = [...formData.params];
                _.set(updatedParams, fieldPath, updatedArray);  // Replace the entire sequence array at the field path
                // saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
                handleChange(fieldPath, updatedArray, true, 'sequence', formData);
            };

            // Update an item in the sequence
            const handleChangeItem = (index, newValue) => {
                const itemPath = items[index].pathKey;
                handleChange(itemPath, newValue, true, 'sequence', formData);
                const updatedItems = [...items];
                updatedItems[index].value = newValue;
                setItems(updatedItems);
            };

            // Render sequence items
            return (
                <div className='sequence-container'>
                    <div className='add-remove-box'>
                        <button className='sequence-button' onClick={handleAddItem}>
                            <div className='add-button'>+</div>
                            <label>Add item</label>
                        </button>
                    </div>
                    {items.map((item, index) => (
                        <React.Fragment key={item.pathKey}>
                                <label className='font-semibold'><span className="index-style">{index}:</span><span className="type-name">{' <'}{fieldObject.typeName}{'>'}</span></label>                            
                                <div className='sequence-item'>
                                <RecursiveFieldRenderer
                                    fieldObject={fieldObject.elementType}
                                    formValues={item.value}
                                    onChange={(newValue) => handleChangeItem(index, newValue)}
                                    nodeId={nodeId}
                                    fieldPath={item.pathKey}
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

