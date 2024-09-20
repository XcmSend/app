import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { Select } from 'antd';
import { resolveFieldType } from '../../PopupForms/ChainForms/parseMetadata';
import useAppStore from '../../../../../store/useAppStore';
import { generatePathKey, parsePathKey, rebuildNestedStructure } from '../utils';

import useTooltipClick  from '../../../../../contexts/tooltips/tooltipUtils/useTooltipClick';
import { usePanelTippy } from '../../../../../contexts/tooltips/TippyContext';
import '../../PopupForms/ChainForms/ChainTxForm/DynamicFieldRenderer';
import './RecursiveFieldRenderer.scss';

const { Option } = Select;
    // TODO 1: (DONE) CURRENT ISSUES: VARIANT AND THEN COMPOSITE FIELD RENDERS. HOWEVER VARIANT DOES NOT RENDER ANOTHER VARIANT FIELD COULD BE AN ISSUE WITH FORM VALUES 
    // TODO 2: (NOT NEEDED) None and Some (in AccountKey20) is an "Option". And option can be something that is included or not. If none then it is not included, if yes then it is included. 
    // TODO 3: (DONE) Also AccountKey20 looks like it is an array of 20 inputs of u8, so we need to add a condition in array. 
    // TODO 4: (DOING) Also when we select a variant field it can change the parent variant, this is probably because of non-unique keys. 
//  TODO 5: save variants to state correctly...
const RecursiveFieldRenderer = ({ fieldObject, formValues, onChange, nodeId, pills, setPills, onPillsChange, fieldName }) => {
    const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        saveNodeFormData: state.saveNodeFormData,
        clearSignedExtrinsic: state.clearSignedExtrinsic,
        markExtrinsicAsUsed: state.markExtrinsicAsUsed,
        updateNodeResponseData: state.updateNodeResponseData,

       }));
    
    const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};

    console.log(`RecursiveFieldRenderer - CYCLE CHECK fieldObject, formValues, fieldName, nodeId`, { fieldObject, formValues, fieldName, nodeId });

    // For the Panel Form... Notify that content has changed
    const { tippyPanelInstance } = usePanelTippy();
    const handleContentChange = () => {  if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) { tippyPanelInstance.current.popperInstance.update(); } };
    const { handleInputClick } = useTooltipClick(nodeId, handleContentChange);


    // const handleChange = (path, newValue, fieldType) => {
    //     const pathKey = generatePathKey(path);  // Convert the path array to a string key
    //     console.log('RecursiveFieldRenderer - handleChange about to change:', pathKey, newValue);
    
    //     // Update the value at the path in the form's state
    //     const updatedValues = { ...formValues, [pathKey]: newValue };
    //     onChange(updatedValues, fieldType);
    // };


    const handleInputChange = (name, newValue) => {
        const updatedFormValues = { ...formValues, [name]: newValue };
        console.log('RecursiveFieldRenderer - handleInputChange:', updatedFormValues);

        onChange(updatedFormValues);
        saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedFormValues });
    };

    const renderField = (fieldObject, formValues, fieldName) => {
        const fieldType = fieldObject.type;
        switch (fieldType) {
            case 'input':
                return (
                    <div className='mt-2 mb-4'>
                        <label className='font-semibold'>{fieldName ? `input: ${fieldName || "input"} <${fieldObject.typeName}>` : `input: <${fieldObject.typeName}>`}</label>
                        <CustomInput
                            value={formValues || ''}
                            onChange={(newValue) => handleInputChange(fieldName, newValue)}
                            onPillsChange={onPillsChange}
                            placeholder={`Enter ${fieldObject.typeName}`}
                            className='custom-input'
                            pills={pills}
                            setPills={setPills}
                            nodeId={nodeId}
                        />
                    </div>
                );
            case 'variant':
                const handleSelectChange = selectedValue => {
                    const selectedVariant = fieldObject.variants.find(variant => variant.index === selectedValue);
                    if (selectedVariant) {
                        const newValue = { [selectedVariant.name]: { index: selectedVariant.index, name: selectedVariant.name, fields: {} } };
                        handleInputChange(fieldName, newValue);
                    }
                };
                
                const selectedVariant = formValues ? Object.keys(formValues)[0] : undefined;
                const selectedIndex = selectedVariant ? fieldObject.variants.find(variant => variant.name === selectedVariant)?.index : undefined;

                return (
                    <div className='variant-container'>
                        <div className='variant-selector'>
                            <Select
                                value={selectedIndex}
                                onChange={handleSelectChange}
                                className='w-full font-semibold custom-select'
                                placeholder="Select option"
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {fieldObject.variants.map(variant => (
                                    <option key={variant.index} value={variant.index}>{variant.name}</option>
                                ))}
                            </Select>
                        </div>
                        {selectedVariant && fieldObject?.variants?.find(variant => variant.name === selectedVariant)?.fields.map((field, index) => (
                            <div className='variant-field' key={index}>
                                <label className='font-semibold'>{`variant field: ${field?.name} <${field?.resolvedType?.typeName}>`}</label>
                                {renderField(field?.resolvedType, formValues?.[selectedVariant]?.fields?.[field.name] || {}, field.name)}
                            </div>
                        ))}
                    </div>
                );
            case 'composite':
                return (
                    <div className="composite-container">
                        {fieldObject.fields.map((field, index) => (
                            <div key={index} className="composite-field">
                                <label className='font-semibold'>{`composite: ${field?.name} <${field?.resolvedType?.typeName}>`}</label>
                                {renderField(field.resolvedType, formValues?.[field.name] || {}, field.name)}
                            </div>
                        ))}
                    </div>
                );
            case 'sequence':
                const handleAddItem = () => {
                    const updatedFormValues = [...(formValues || []), {}];
                    handleInputChange(fieldName, updatedFormValues);
                };

                const handleRemoveItem = index => {
                    const updatedFormValues = (formValues || []).filter((_, i) => i !== index);
                    handleInputChange(fieldName, updatedFormValues);
                };

                const handleSequenceItemChange = (index, newValue) => {
                    const updatedFormValues = [...(formValues || [])];
                    updatedFormValues[index] = newValue;
                    handleInputChange(fieldName, updatedFormValues);
                };

                return (
                    <div className='sequence-container'>
                        <div className='add-remove-box'>
                            <button className='sequence-button' onClick={handleAddItem}>
                                <div className='add-button'>+</div>
                                <label>Add item</label>
                            </button>
                        </div>
                        {formValues?.map((item, index) => (
                            <div key={index} className='sequence-item'>
                                <label className='sequence-field-label'>{`${index}: <${fieldObject.typeName}>`}</label>
                                {renderField(fieldObject.elementType, item, index)}
                                <div className='add-remove-box'>
                                    <button className='sequence-button' onClick={() => handleRemoveItem(index)}>
                                        <div className='remove-button'>-</div>
                                        <label>Remove item</label>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'array':
                return (
                    <div className='array-container'>
                        {Array.from({ length: fieldObject.length }).map((_, index) => (
                            <div key={index} className='array-item'>
                                <label className='array-field-label'>{`${index}: <${fieldObject.elementType?.typeName}>`}</label>
                                {renderField(fieldObject.elementType, formValues?.[index], index)}
                            </div>
                        ))}
                    </div>
                );
            case 'compact':
                return (
                    <div className='compact-container'>
                        <label className='font-semibold'>{`compact: ${fieldName}`}</label>
                        {renderField(fieldObject.resolvedType, formValues, fieldName)}
                    </div>
                );
            case 'tuple':
                const handleTupleChange = (index, newValue) => {
                    const updatedFormValues = [...formValues];
                    updatedFormValues[index] = newValue;
                    handleInputChange(fieldName, updatedFormValues);
                };

                return (
                    <div className="tuple-container">
                        {fieldObject.elements.map((element, index) => (
                            <div key={index} className="tuple-item">
                                <label className='font-semibold'>{`Element ${index}: <${element.resolvedType.typeName || element.type}>`}</label>
                                {renderField(element.resolvedType, formValues?.[index] || {}, index)}
                            </div>
                        ))}
                    </div>
                );
            default:
                return <div key={fieldName}>Unsupported field type: {fieldType}</div>;
        }
    };

    return renderField(fieldObject, formValues, fieldName);
};

export default RecursiveFieldRenderer;