import {  TupleElement,  Field, VariantObject, Type, TypeEntry, ParsedTypeDefinition, TypeDefinitions } from './TypeDefinitions';


export interface TypeDef {
  Composite?: {
    fields: Field[];
    type?: string
  };
  Primitive?: string;
  Array?: {
    len: string;
    type: string;
    needsLoading?: boolean;
    typeId?: string;

  };
  Sequence?: {
    type: string;
    typeId?: string;
    needsLoading?: boolean;
    elementType: string;

  };
  Variant?: {
    variants: VariantObject[];
    needsLoading?: boolean;
    type: string;
    typeId?: string;
    name?: string;
    

  };

  Tuple?: string[];

  Compact?: {
    type: string;
    typeId?: string;
  };
  Unknown?: {};

}

export function parseTypeDefinition(type: Type): ParsedTypeDefinition {
  let def: TypeDef = {};

  if (type.def.Composite) {
    def.Composite = {
      type: type.def.Composite.type,
      fields: type.def.Composite.fields.map(field => ({
        name: field.name,
        typeName: field.typeName,
        type: field.type,
        docs: field.docs // Keep as an array of strings
      }))
    };
  } else if (type.def.Primitive) {
    def.Primitive = type.def.Primitive;
  } else if (type.def.Array) {
    def.Array = {
      len: type.def.Array.len,
      type: type.def.Array.type
    };
  } else if (type.def.Sequence) {
    def.Sequence = {
      type: type.def.Sequence.type,
      elementType: type.def.Sequence.type
    };
  } else if (type.def.Variant) {
    def.Variant = {
      type: type.def.Variant.type,
      name: type.def.Variant.name,
      typeId: type.def.Variant.typeId,
      variants: type.def.Variant.variants.map(variant => ({
        name: variant.name,
        index: variant.index,
        docs: variant.docs,
        type: type.def.Variant!.type, 
        typeId: type.def.Variant!.typeId,
        fields: variant.fields.map(field => ({
          name: field.name,
          type: field.type,
          typeName: field.typeName,
          docs: field.docs 
        }))
      }))
    };
  } else if (type.def.Tuple) {
    def.Tuple = type.def.Tuple.map(typeId => typeId.toString());

  } else if (type.def.Compact) {
    def.Compact = {
      type: type.def.Compact.type
    };
  } else {
    def.Unknown = {}; 
  }

  return {
    path: type.path,
    params: type.params,
    def,
    docs: type.docs.join(' ')
  };
}





export function parseLookupTypes(lookupTypes: TypeEntry[]): TypeDefinitions {
  const typeDefinitions: TypeDefinitions = {};

  if (!Array.isArray(lookupTypes)) {
    console.error('Expected lookupTypes to be an array, received:', lookupTypes);
    return typeDefinitions;
  }

  lookupTypes.forEach(typeEntry => {
    const { id, type } = typeEntry;
    typeDefinitions[id] = parseTypeDefinition(type);
  });

  return typeDefinitions;
}


// interface TypeDef {
//   Composite?: {
//     fields: Field[];
//   };
//   Primitive?: string;
//   Array?: {
//     len: number;
//     type: string;
//   };
//   Sequence?: {
//     type: string;
//   };
//   Variant?: {
//     variants: Variant[];
//   };
// }
// interface Field {
//   name: string;
//   typeName: string;
//   type: string;
//   docs: string[];
// }

// interface Variant {
//   name: string;
//   index: number;
//   fields: Field[];
// }

// interface Type {
//   path: string[];
//   params: any[];
//   def: TypeDef;
//   docs: string[];
// }

// interface TypeEntry {
//   id: string;
//   type: Type;
// }

// interface TypeDefinitions {
//   [key: string]: ParsedTypeDefinition;
// }

// interface ParsedTypeDefinition {
//   path: string[];
//   params: any[];
//   def: any;
//   docs: string;
// }


// export function parseTypeDefinition(type) {
//     let def = {};

  
//     if (type.def.Composite) {
//       def = {
//         type: 'Composite',
//         fields: type.def.Composite.fields.map(field => ({
//             name: field.name,
//             typeName: field.typeName,
//             type: field.type,
//             docs: field.docs.join(' ')
//         }))
//     };
//     } else if (type.def.Primitive) {
//       def = {
//         type: 'Primitive',
//         primitiveType: type.def.Primitive
//       };
//     } else if (type.def.Array) {
//       def = {
//         type: 'Array',
//         length: type.def.Array.len,
//         elementType: type.def.Array.type
//       };
//     } else if (type.def.Sequence) {
//       def = {
//         type: 'Sequence',
//         elementType: type.def.Sequence.type
//       };
//     } else if (type.def.Variant) {
//       def = {
//         type: 'Variant',
//         variants: type.def.Variant.variants.map(variant => ({
//           name: variant.name,
//           index: variant.index,
//           fields: variant.fields.map(field => ({
//             name: field.name,
//             type: field.type,
//             typeName: field.typeName,
//             docs: field.docs.join(' ')
//           }))
//         }))
//       };
//     } else {
//       def = {
//         type: 'Unknown'
//       };
//     }
  
//     return {
//       path: type.path, 
//       params: type.params,
//       def,
//       docs: type.docs.join(' ')
//   };
//   }
  

//   export function parseLookupTypes(lookupTypes) {
//     const typeDefinitions = {};

//     if (!Array.isArray(lookupTypes)) {
//         console.error('Expected lookupTypes to be an array, received:', lookupTypes);
//         return typeDefinitions;
//     }
//     // console.log("Starting to parse lookup types", lookupTypes);

//     lookupTypes.forEach(typeEntry => {
//       const { id, type } = typeEntry;
//       typeDefinitions[id] = parseTypeDefinition(type);
//       // console.log(`Parsed type ${id}:`, typeDefinitions[id]);

//   });

//     // console.log('Lookup Parsed Type Definitions:', typeDefinitions);
//     return typeDefinitions;
// }


