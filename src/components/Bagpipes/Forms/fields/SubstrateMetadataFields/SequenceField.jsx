import React, { useEffect, useState } from 'react';
import FieldRenderer from '../../PopupForms/ChainForms/FieldRenderer';
import { findFieldByKey } from '../fieldUtils';
import { isFieldVisible } from '../../PopupForms/formUtils';
import CustomInput from '../CustomInput';
import RecursiveFieldRenderer from '../RecursiveFieldRenderer/RecursiveFieldRenderer';


const SequenceField = ({ items, onChange, setPills, onPillsChange, nodeId, values, fieldObject }) => {    
    console.log("SequenceField items:", items);
    const handleAddItem = () => {
        console.log("SequenceField handleAddItem fieldObject:", fieldObject);

            const newItem = // we need to do something here, probable something form field object
            onChange([...items, newItem]);
            handleAddItem()

    };

    const handleRemoveItem = (index) => {
        onChange(items.filter((_, idx) => idx !== index));
    };

    const handleChangeItem = (index, newValue) => {
        const updatedItems = items.map((item, idx) => idx === index ? newValue : item);
        onChange(updatedItems);
    };
        // Render individual items with add/remove capabilities for other types
    return (
        <div className='flex flex-col'>

                
               { items.map((item, index) => (
                    <div key={index} className='flex flex-row items-center'>
                        <RecursiveFieldRenderer
                            field={item}
                            formData={items}
                            onChange={(newValue) => handleChangeItem(index, newValue)}
                            fieldObject={fieldObject}
                            values={values}
                            nodeId={nodeId}
                            setPills={setPills} 
                            onPillsChange={onPillsChange}
                            />
                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                ))
            }
            <button onClick={handleAddItem}>Add New Item</button>
        </div>
    );
};


export default SequenceField;