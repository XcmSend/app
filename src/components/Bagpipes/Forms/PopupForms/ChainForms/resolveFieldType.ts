function resolveFieldType(typeId, typesLookup) {
    const typeInfo = typesLookup[typeId];
    if (!typeInfo || !typeInfo.def) return 'input';  // Default to input if type is unknown or not defined

    const typeDef = typeInfo.def;
    if (typeDef.Primitive) {
        return 'input'; // Use input for primitive types
    } else if (typeDef.Composite) {
        return 'composite'; // This might be a form group or a similar complex input
    } else if (typeDef.Sequence) {
        return 'sequence'; // Use a list input component
    } else if (typeDef.Array) {
        return 'array'; // Use a fixed size list component
    } else if (typeDef.Variant) {
        return 'select'; // Use a dropdown for selecting variants
    } else {
        return 'complex'; // Default for unhandled complex types
    }
}
