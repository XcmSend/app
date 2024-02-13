

import React from 'react';
import CollapsibleField from '../../fields/CollapsibleField';
import { isFieldVisible } from '../formUtils';


const renderFieldElement = (field) => {
  if (!field) {
    console.warn("renderFieldElement was called with a null field");
    return null;
  }


    const commonProps = {
      key: field.key,
      title: field.label,
      hasToggle: field.hasToggle,
      type: field.type,
    };


    switch (field.type) {
      case 'input':
        console.log('field type input')
        fieldElement = (
          <CollapsibleField
          fieldTypes='input'
            {...commonProps}
            key={field.key}
            placeholder={field.label}
            value={formValues[field.key] || ''}
            onChange={(value) => handleFieldChange(field.key, value)}
          />
        );
        break;
        case 'select':
          if (!isFieldVisible(field)) {
            return null;
          }
          const selectedOption = field.options.find(option => option.value === formValues[field.key]);
          const childrenFields = selectedOption?.children || [];
        
          fieldElement = (
            <>
              <CollapsibleField
                {...commonProps}
                fieldTypes='select'
                selectOptions={field.options}
                defaultValue={formValues[field.key] || field.default}
                onChange={(value) => {
                  handleSelectChange(field.key, value);
                }}        
              />
                {childrenFields.map(childKey => renderFieldWithChildren(childKey))}

            </>
          );
          break;


      case 'radio':
        fieldElement = (
          <CollapsibleField
            {...commonProps}
            fieldTypes='radio'
            selectRadioOptions={field.options}
            defaultValue={formValues[field.key] || field.default}
            onChange={(value) => handleFieldChange(field.key, value)}
          />
        );
        break;

      case 'items':
        fieldElement = (
          <CollapsibleField
            {...commonProps}
            fieldTypes='items'
            items={formValues[field.key] || []}
            onChange={(value) => handleFieldChange(field.key, value)}
          />
        );
        break;
 
      default:
        return null;
    }


  }
 

  const FieldRenderer = ({ fieldKey, formValues, handleFieldChange, handleSelectChange, findFieldByKey, formSections, isFieldVisible, showAdvancedSettings }) => {
    // Use findFieldByKey with formSections
    const field = findFieldByKey(fieldKey);
    if (isFieldVisible(field, formValues, showAdvancedSettings)) return null;
  
    let fieldElement = renderFieldElement(field, formValues, handleFieldChange, handleSelectChange);
  
    let childrenElements = field.children?.map(childKey => (
      <FieldRenderer
        key={childKey}
        fieldKey={childKey}
        formValues={formValues}
        handleFieldChange={handleFieldChange}
        handleSelectChange={handleSelectChange}
        findFieldByKey={findFieldByKey}
        formSections={formSections}
      />
    ));
  
    return (
      <>
        {fieldElement}
        <div className="field-children">
          {childrenElements}
        </div>
      </>
    );
  };
  
export default FieldRenderer;