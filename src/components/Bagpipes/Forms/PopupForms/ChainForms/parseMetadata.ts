import { Type, TypeEntry, TypeDefinitions, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType } from './TypeDefinitions';



export function parseMetadataPallets(rawMetadata: RawMetadata): MethodOutput[] {
  const metadata = rawMetadata.metadata;

  if (!metadata) {
    console.error('No metadata provided:', metadata);
    return [];
  }

  // Extract types into a lookup table
  const typesLookup = {};
  if (metadata.V14 && metadata.V14.lookup && metadata.V14.lookup.types) {
    metadata.V14.lookup.types.forEach((type: any) => {
      typesLookup[type.id] = type.type;
    });
  }

  let pallets: MethodOutput[] = [];
  if (metadata.V14) {
    console.log('Metadata version:', metadata.V14);

    pallets = metadata.V14.pallets.map(pallet => parsePallet(pallet, typesLookup));
  } else if (metadata.V13) {
    console.error('Metadata V13 handling needs to be implemented if necessary');
  } else {
    console.error('Metadata version not supported:', metadata);
  }
  return pallets;
}


function parsePallet(pallet: Pallet, typesLookup: any): MethodOutput {
  let calls: CallOutput[] = [];

  if (pallet.calls) {
    const callsTypeId = pallet.calls.type;
    const callTypeInfo = typesLookup[callsTypeId]; 

    if (callTypeInfo && callTypeInfo.def && callTypeInfo.def.Variant) {
      calls = callTypeInfo.def.Variant.variants.map((variant: any) => ({
        name: variant.name,
        type: variant.fields.map((f: any) => `${f.name}: ${resolveTypeName(f.type, typesLookup)}`).join(', '),
        docs: variant.docs.join(' '),
        fields: variant.fields.map((f: any) => ({
          name: f.name,
          type: f.type,
          typeName: f.typeName,
          docs: f.docs.join(' ')
        })),
        index: variant.index
      }));
      // console.log('Call type info:', calls[0]);

    } else {
      console.error('Call type info not found or invalid for:', callsTypeId);
    }
  }

  const storageItems: StorageOutput[] = (pallet.storage?.items || []).map(item => ({
    name: item.name,
    fields: item.type.Map ? Object.entries(item.type.Map).map(([key, value]) => ({
      name: key,
      type: value,
      typeName: '', // Add the 'typeName' property
      docs: [] // Change the 'docs' property to an empty array
    })) : [],
    type: item.type,
    docs: item.docs ? item.docs.join(' ') : 'No documentation available.',
  }));

  const methodOutput: MethodOutput = { name: pallet.name, calls, storage: storageItems };
  return methodOutput;
}

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
    return `Composite(${def.Composite.fields.map(f => resolveTypeName(f.type, typesLookup)).join(', ')})`;
  } else if (def.Sequence) {
    // Adjust here to use `elementType` for sequences
    return `Sequence of ${resolveTypeName(def.Sequence.elementType, typesLookup)}`;
  } else if (def.Array) {
    return `Array[${def.Array.len}] of ${resolveTypeName(def.Array.type, typesLookup)}`;
  } else if (def.Variant) {
    return `Variant`;
  } else if (def.Tuple) {
    return `Tuple of (${def.Tuple.map((t: string) => resolveTypeName(t, typesLookup)).join(', ')})`;
  } else {
    return 'Complex Type';
  }
}




export function resolveFieldType(typeId: string, typesLookup: TypeLookup, depth = 0, path: string[] = []): ResolvedType {
  console.log(`Resolving type for typeId: ${typeId} at recursion depth: ${depth}`);
  if (depth > 10) { // Safety check to prevent infinite recursion
      console.warn('Too deep recursion in resolveFieldType at depth:', depth);
      return { type: 'complex', path }; // Return 'complex' with the path when recursion is too deep
  }

  const typeInfo = typesLookup[typeId];
  if (!typeInfo || !typeInfo.def) {
      console.error(`Type information is undefined or missing definition for typeId: ${typeId}`);
      return { type: 'input', path }; // Return 'input' as fallback
  }

  const currentType = Object.keys(typeInfo.def)[0]; // Assuming the key itself is descriptive
  path.push(currentType); // Add the current type to the path
  console.log(`Current type path: ${path.join(' -> ')}`);

  if (typeInfo.def.Primitive) {
      console.log(`Type ${typeId} is a Primitive: ${typeInfo.def.Primitive}`);
      return { type: 'input', path };
  } else if (typeInfo.def.Composite) {
      console.log(`Type ${typeId} is a Composite`);
      return { type: 'composite', path };
  } else if (typeInfo.def.Sequence) {
      console.log(`Type ${typeId} is a Sequence, element type: ${typeInfo.def.Sequence.elementType}`);
      const elementType = resolveFieldType(typeInfo.def.Sequence.elementType, typesLookup, depth + 1, path);
    return {
        type: 'sequence',
        path,
        elements: [elementType], // Now, elements will contain full information of the nested types.
        elementType: elementType.type // Additional detail about the type of elements in the sequence.
    };
  } else if (typeInfo.def.Array) {
      console.log(`Type ${typeId} is an Array, element type: ${typeInfo.def.Array.elementType}`);
      return resolveFieldType(typeInfo.def.Array.elementType, typesLookup, depth + 1, path);
  } else if (typeInfo.def.Variant) {
      console.log(`Type ${typeId} is a Variant`);
      return { type: 'select', path };
  } else if (typeInfo.def.Tuple) {
      console.log(`Type ${typeId} is a Tuple`);
      const elements = typeInfo.def.Tuple.elements.map(elementId => resolveFieldType(elementId, typesLookup, depth + 1, path.slice()));
      console.log(`Resolved elements for Tuple ${typeId}:`, elements.map(e => e.type));
      return { type: 'tuple', path, elements };
  } else {
      console.log(`Type ${typeId} is classified as Complex`);
      return { type: 'complex', path };
  }
}


