

export function resolveName(typeId: string, typesLookup: any): string {
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
      return `${def.Composite.fields.map((f: {name: string }) => resolveName(def.Composite.type, typesLookup)).join(', ')})`;
    } else if (def.Sequence) {
      // Adjust here to use `elementType` for sequences
      return `Sequence of ${resolveName(def.Sequence.elementType, typesLookup)}`;
    } else if (def.Array) {
      return `Array[${def.Array.len}] of ${resolveName(def.Array.type, typesLookup)}`;
    } else if (def.Variant) {
      return `Variant`;
      } else if (def.Tuple) {
        return `Tuple(${def.Tuple.map((typeId: string) => resolveName(typeId, typesLookup)).join(', ')})`;
      } else if (def.Compact) {
        return `Compact<${resolveName(def.Compact.type, typesLookup)}>`;
    } else {
      return 'Complex Type';
    }
  }