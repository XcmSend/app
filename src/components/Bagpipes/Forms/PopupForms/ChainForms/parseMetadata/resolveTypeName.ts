

export function resolveTypeName(typeId: string, typesLookup: any): string {
    const typeInfo = typesLookup[typeId];
    if (!typeInfo) return 'Unknown Type';
  
    // Checking for the path to display nested types
    if (typeInfo.path && typeInfo.path.length > 0) {
      return typeInfo.path.join('.');
    }
  
    // Access the def object
    const { def } = typeInfo;
    if (!def) return 'Undefined Type Definition';
  
    // Handling various type defs
    if (def.Primitive) {
      return def.Primitive;
    } else if (def.Composite) {
      return `Composite(${def.Composite.fields.map((f: { type: string; }) => resolveTypeName(f.type, typesLookup)).join(', ')})`;
    } else if (def.Sequence) {
      // Adjust here to use `elementType` for sequences
      return `Sequence of ${resolveTypeName(def.Sequence.elementType, typesLookup)}`;
    } else if (def.Array) {
      return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
    } else if (def.Variant) {
      return `Variant`;
      } else if (def.Tuple) {
        return `Tuple(${def.Tuple.map((typeId: string) => resolveTypeName(typeId, typesLookup)).join(', ')})`;
      } else if (def.Compact) {
        return `Compact<${resolveTypeName(def.Compact.type, typesLookup)}>`;
    } else {
      return 'Complex Type';
    }
  }