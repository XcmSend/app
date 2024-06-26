import {  Type, TypeEntry, ParsedTypeDefinition, TypeDefinitions } from './TypeDefinitions';


export function parseTypeDefinition(type: Type): ParsedTypeDefinition {
  let def: any = {};

  if (type.def.Composite) {
    def.Composite = {
      fields: type.def.Composite.fields.map(field => ({
        name: field.name,
        typeName: field.typeName,
        type: field.type,
        docs: field.docs.join(' ')
      }))
    };
  } else if (type.def.Primitive) {
    def.Primitive = type.def.Primitive;
  } else if (type.def.Array) {
    def.Array = {
      length: type.def.Array.len,
      elementType: type.def.Array.type
    };
  } else if (type.def.Sequence) {
    def.Sequence = {
      elementType: type.def.Sequence.type
    };
  } else if (type.def.Variant) {
    def.Variant = {
      variants: type.def.Variant.variants.map(variant => ({
        name: variant.name,
        index: variant.index,
        fields: variant.fields.map(field => ({
          name: field.name,
          type: field.type,
          typeName: field.typeName,
          docs: field.docs.join(' ')
        }))
      }))
    };
  } else if (type.def.Tuple) {
    def.Tuple = {
      elements: type.def.Tuple.map(tupleTypeId => tupleTypeId) // Assuming tuple contains an array of typeIds
    };
  } else {
    def.Unknown = {}; // Handle unclassified or unhandled types
  }

  return {
    path: type.path, 
    params: type.params,
    def, // Using the direct keys from the metadata
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


