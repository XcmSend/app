export const resolveKeyType = (typeId, lookupTypes) => {
    const typeInfo = lookupTypes[typeId];
    if (!typeInfo) {
        console.warn(`Type information not found for type ID: ${typeId}`);
        return { displayName: 'Unknown' }; // Provide a fallback type
    }

    let displayName = '';
    // Use only the last element of the path if it exists
    if (typeInfo.path.length > 0) {
        displayName = typeInfo.path[typeInfo.path.length - 1];
    } else if (typeInfo.definition) {
        // If path is empty, determine the display name based on the type definition
        switch (typeInfo.definition.type) {
            case 'Primitive':
                displayName = typeInfo.definition.primitiveType;
                break;
            case 'Composite':
                // For composite types, join type names if available
                displayName = typeInfo.definition.fields.map(f => f.typeName || f.type).join(', ');
                break;
            case 'Variant':
                // For variant types, list variant names
                displayName = typeInfo.definition.variants.map(v => v.name).join(', ');
                break;
            default:
                displayName = 'Complex Type'; // Default text for complex or unknown definitions
                break;
        }
    }

    return { ...typeInfo, displayName };
  };