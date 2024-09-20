import React from 'react';  
import RecursiveFieldRenderer from '../../../fields/RecursiveFieldRenderer/RecursiveFieldRendererNew';
import { CollapsibleField }  from '../../../fields';
import { generatePath } from '../../../fields/RecursiveFieldRenderer/utils';


const DynamicFieldRenderer = ({ fieldObject, index, localResolvedFields, customContent, nodeId, formData, handleMethodFieldChange, initialPathName }) => {
    const resolvedField = localResolvedFields?.[index];
    console.log("resolvedField path and fieldObject", resolvedField, fieldObject);
    if (!resolvedField) {
        console.warn("Mismatch or missing data in localResolvedFields");
        return <div>Error or incomplete data.</div>;
    }




    const initialPath = generatePath(initialPathName, resolvedField.name, resolvedField.type);
    console.log("generatePath initialPath", { initialPath, resolvedField } );

    return (
        <CollapsibleField
            title={`${fieldObject.name} <${fieldObject.typeName || resolvedField.typeName}>`}
            info={fieldObject?.docs || ''}
            customContent={customContent}
            hasToggle={true}
            nodeId={nodeId}
            placeholder={`Enter ${fieldObject.name}`}
        >
 <RecursiveFieldRenderer
                index={index}
                localResolvedFields={localResolvedFields}
                fieldName={resolvedField.name}
                fieldObject={resolvedField}
                formValues={formData?.params?.[resolvedField?.name] || []}
                nodeId={nodeId}
                formData={formData}
                fieldPath={initialPath}
                onChange={handleMethodFieldChange}
            />
        </CollapsibleField>
    );
};

export default DynamicFieldRenderer;