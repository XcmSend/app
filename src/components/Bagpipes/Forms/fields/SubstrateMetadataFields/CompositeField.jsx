import React from 'react';
import CustomInput from '../CustomInput'; 
import RecursiveFieldRenderer from '../RecursiveFieldRenderer/RecursiveFieldRenderer';
import { Select } from 'antd';

const { Option } = Select;

const CompositeField = ({ fields, values, onChange, nodeId, typesLookup }) => {
  // This function handles updating the values for fields within the composite
  const handleFieldChange = (fieldName, fieldValue) => {
    const updatedValues = { ...values, [fieldName]: fieldValue };
    onChange(updatedValues);
  };

  console.log('CompositeField - fields:', fields);

  return (
    <div className="composite-container">
      {fields.map((field, index) => (
        <div key={index} className="composite-field">
          {/* <label>{field.name || `Field ${index + 1}`}</label> */}
          <label>{field.name}</label>

          <RecursiveFieldRenderer
            fieldObject={field}
            values={values[field.name]} // Pass the specific subfield values
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
            nodeId={nodeId}
            typesLookup={typesLookup}
          />
        </div>
      ))}
    </div>
  );
};

export default CompositeField;