import React, { useEffect, useState } from 'react';
import FieldRenderer from '../PopupForms/ChainForms/FieldRenderer';
import { findFieldByKey } from './fieldUtils';
import { isFieldVisible } from '../PopupForms/formUtils';
import CustomInput from './CustomInput';

const SequenceField = ({ items, onChange, typesLookup, elementType, setPills, onPillsChange, nodeId }) => {    console.log("SequenceField items:", items);
    const handleAddItem = () => {
        if (elementType === 'input') {
            // For Vec<u8>, treat as a single input field for byte data.
            const newItem = ''; // initialize as empty string or appropriate byte data structure
            onChange([...items, newItem]);
        if (!items.length && elementType === 'tuple') {
            console.log("SequenceField tuple Adding new item of type:", elementType);
            // If no items and type is tuple, initialize properly
            handleAddItem(); // This will add an initial tuple to the sequence
        }
        } else {
            // For other types, initialize based on specific needs
            console.log("SequenceField Adding new item of type:", elementType);
            const newItem = { typeId: elementType, value: getDefaultForType(elementType) };
            onChange([...items, newItem]);
        }
    };

    const handleRemoveItem = (index) => {
        onChange(items.filter((_, idx) => idx !== index));
    };

    const handleChangeItem = (index, newValue) => {
        const updatedItems = items.map((item, idx) => idx === index ? newValue : item);
        onChange(updatedItems);
    };

    return (
        <div className='flex flex-col'>
            {elementType === 'input' ? (
                <>

        <div className='flex flex-col'>
            {items.map((item, index) => (
                <div key={index} className='flex flex-row items-center'>
                    <CustomInput 
                        value={item.value}
                        onChange={(newValue) => handleChangeItem(index, newValue)}
                        fieldKey={item.key}
                        onPillsChange={onPillsChange}
                        pills={item.pills}
                        setPills={setPills}
                        nodeId={nodeId}
                        placeholder="Enter value"
                        className="custom-input"
                    />
                    <button onClick={() => handleRemoveItem(index)}>Remove</button>
                </div>
            ))}
            <button onClick={handleAddItem}>Add New Item</button>
        </div>
                </>
            ) : (
                // Render individual items with add/remove capabilities for other types
                items.map((item, index) => (
                    <div key={index} className='flex flex-row items-center'>
                        <FieldRenderer
                            field={item}
                            formData={items}
                            onChange={(newValue) => handleChangeItem(index, newValue)}
                            typesLookup={typesLookup}
                            // isFieldVisible={checkFieldVisibility}
                            />
                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                ))
            )}
            <button onClick={handleAddItem}>Add New Item</button>
        </div>
    );
};


export default SequenceField;


function getDefaultForType(elementType) {
    switch(elementType) {
        case 'input': return ''; // Default for byte data
        case 'composite': return {}; // Default for composite types
        case 'sequence': return []; // Default for sequences
        case 'tuple': return [['test', 'test']];  // Default for tuples, initialize each part of the tuple
        // more cases as necessary
    }
}