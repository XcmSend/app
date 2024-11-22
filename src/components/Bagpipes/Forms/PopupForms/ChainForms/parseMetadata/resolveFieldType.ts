import { Type, TypeEntry, TypeDefinitions, Field, Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput, TypeLookup, ResolvedType, PathSegment} from './TypeDefinitions';
import { TypeDef } from './ParseMetadataTypes';
import { resolveTypeName }  from './resolveTypeName';

// this resolves field types using the type id from the metadata.
export function resolveFieldType(typeId: string, typesLookup: TypeLookup, depth = 0, path: PathSegment[] = [], cache: Record<string, ResolvedType> = {}): ResolvedType {
  // console.log(`Resolving type for typeId: ${typeId} at recursion depth: ${depth}, path: ${path.join(' -> ')}`);
// console.log('Resolving type and here is the path and the depth', path, depth);
  if (cache[typeId]) {
    // console.log(`Using cached result for typeId: ${typeId}`);
    return cache[typeId];
}

if (depth > 500) {
    console.warn(`Excessive recursion at depth ${depth} for typeId ${typeId}`);
    return { type: 'complex', path, typeName: 'Complex Type', id: `complexDepth-${depth}`};
}

const typeInfo = typesLookup[typeId];
if (!typeInfo || !typeInfo.def) {
    console.error(`Type information is undefined or missing definition for typeId: ${typeId} and depth: ${depth} at path: ${path.join(' -> ')} `);
    return { type: 'input', path, id: `inputError-${depth}`};
}


const typeName = resolveTypeName(typeId, typesLookup);
const currentType = Object.keys(typeInfo.def)[0] as keyof TypeDef;

const typeLower = currentType.toLowerCase();
const typeID = `${typeLower}-${depth}`;


const newPathSegment = { type: currentType, id: typeID, typeName: typeName };
const newPath = [...path, newPathSegment];


  let result: ResolvedType = {
    type: currentType,
    path: newPath,
    typeName: typeName,
    id: typeID
    
};

switch (currentType) {
      case 'Primitive':
          result = { type: 'input', path: newPath, typeName: typeName, id: typeID, };
          break;

          case 'Composite':

            result = {
                type: 'composite',
                path: newPath,
                typeName: typeName,
                typeId: typeInfo.def.Composite!.type,
                id: typeID,  
                fields: typeInfo.def.Composite!.fields.map((field, index) => {
                  console.log(`Resolving composite field type: ${field.type} and name ${field.name} and index: ${index}`);
                    // Generate unique ID only for each field within the composite

                    const fieldName = field.name || 'compositeField';
                    const fieldID = `${fieldName}-${depth + 1}-[${index}]`;
                    const fieldPathSegment = { type: 'compositeField', id: fieldID, typeName: resolveTypeName(field.type, typesLookup) };
                    
                    const fieldPath = [...newPath, fieldPathSegment];

                    return {
                        name: field.name || '',
                        type: 'compositeField',
                        id: `${fieldID}`,
                        resolvedType: resolveFieldType(field.type, typesLookup, depth + 2, fieldPath, cache),
                        typeName: fieldPathSegment.typeName,
                        typeId: field.type,
                        path: fieldPath
                    };
                })
            };
            break;
        

      case 'Compact':
        const compactElementType = resolveFieldType(typeInfo.def.Compact!.type, typesLookup, depth + 1, newPath, cache)
          result = {
              ...compactElementType,
              path: newPath,
              type: 'input',
              id: typeID,
          }
          break;

      case 'Sequence':

      if (typeInfo.def.Sequence!.type === '2') {
        console.log(`Resolving array type special: ${typeId}`),
          result = {
              id: `input-${depth}`,
              type: 'input',
              path: newPath,
              typeName: 'Bytes', 
        } 
      } else {

        const childDepthId = `sequenceField-${depth + 1}`; 
        const sequenceFieldPathSegment = { type: 'sequenceField', id: childDepthId, typeName: typeName };
        const sequenceFieldPath = [...newPath, sequenceFieldPathSegment]; 

        result = {
            id: typeID,
            type: 'sequence',
            typeId: typeInfo.def.Sequence!.type,
            typeName: typeName,
            path: newPath,
            elementType: resolveFieldType(typeInfo.def.Sequence!.type, typesLookup, depth + 2, sequenceFieldPath, cache)
        };
      }
        break;
        
      case 'Array':
        console.log(`Resolving array type inside: ${typeId}`, typeInfo.def.Array);


        // Check if the array is of length 32 and element type is U8
        if (typeInfo.def.Array!.len === '4' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
                id: `input-${depth}`,
                type: 'input',
                path: newPath,
                typeName: '[u8;4]', 
          };

        } else if (typeInfo.def.Array!.len === '8' && typeInfo.def.Array!.type === '2') {
            console.log(`Resolving array type special: ${typeId}`),
              result = {
                id:`input-${depth}`,

                  type: 'input',
                  path: newPath,
                  typeName: '[u8;8]', 
              };
        } else if (typeInfo.def.Array!.len === '16' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: `input-${depth}`,

                type: 'input',
                path: newPath,
                typeName: '[u8;8]', 
            };
      
        } else if (typeInfo.def.Array!.len === '20' && typeInfo.def.Array!.type === '2') {
           console.log(`Resolving array type special: ${typeId}`),
          result = {
            id: `input-${depth}`,

              type: 'input',
              path: newPath,
              typeName: '[u8;20]', 
          };

        } else if (typeInfo.def.Array!.len === '32' && typeInfo.def.Array!.type === '2') {
          console.log(`Resolving array type special: ${typeId}`),
            result = {
              id: `input-${depth}`,

                type: 'input',
                path: newPath,
                typeName: '[u8;32]',
            };
        } else {

         

          const arrayElementId = `arrayElement-${depth + 1}`;
          const arrayElementPathSegment = { type: 'arrayElement', id: arrayElementId, typeName: typeName };

          const arrayElementPath = [...newPath, arrayElementPathSegment];
          const elementType = resolveFieldType(typeInfo.def.Array!.type, typesLookup, depth + 2, arrayElementPath, cache);

          
            result = {
                id: typeID,
                type: 'array',
                path: newPath,
                typeId: typeInfo.def.Array!.type,
                elementType: elementType,
                length: typeInfo.def.Array!.len
            };
        }


          break;

      case 'Variant':
            // Create a path segment for the variant itself
        
            result = {
                id: typeID, 
                type: 'variant',
                name: typeInfo.def.Variant!.name || '',
                path: newPath,
                typeName: typeName,
                variants: typeInfo.def.Variant!.variants.map((variant, index ) => {

                  const variantsId = `variants-${depth + 1}`;
                    const variantEntryPathSegment = { type: 'variants', id: variantsId, typeName: typeName };
                    const variantEntryPath = [...newPath, variantEntryPathSegment];
        
                    return {
                        id: `${variantsId}-[${index}]`, 
                        name: variant.name,
                        index: variant.index,
                        path: variantEntryPath,
                        typeId: variant.type,
                        type: 'variants',  // Use 'variants' to indicate a group within a variant
                        fields: variant.fields.map((field, index) => {
                            // Fields within a variant are treated as variantField
                            const variantFieldId = `variantField-${depth + 2}`;
                            const fieldPathSegment = { type: 'variantField', id: variantFieldId, typeName: typeName };
                            const fieldPath = [...variantEntryPath, fieldPathSegment];
        
                            return {
                                id: `${variantFieldId}-[${index}]`,
                                index: index.toString(),
                                name: field.name,
                                type: 'variantField',
                                resolvedType: resolveFieldType(field.type, typesLookup, depth + 3, fieldPath, cache),
                                typeName: typeName,
                                typeId: field.type,
                                path: fieldPath
                            };
                        })
                    };
                })
            };
            break;

      case 'Tuple':
              
        
              result = {
                type: 'tuple',
                path: newPath,
                typeName: typeName,
                id: typeID,
                elements: typeInfo.def.Tuple.map((tupleTypeId, index) => {
                  console.log(`Resolving tuple element type: ${tupleTypeId}`);
                  console.log(`Tuple type id ${tupleTypeId} tupleElement`);
                  const tupleTypePathSegmentElement = { type: 'tupleElement', id: `tupleElement-${depth + 1}`, typeName: resolveTypeName(tupleTypeId, typesLookup) };
                  return {
                    type: 'tupleElement',
                    id:`${tupleTypePathSegmentElement.id}-[${index}]`,
                    resolvedType: resolveFieldType(tupleTypeId, typesLookup, depth + 1, [...newPath, tupleTypePathSegmentElement], cache),
                    typeName: tupleTypePathSegmentElement.typeName,
                    typeId: tupleTypeId,
                    path: [...newPath, tupleTypePathSegmentElement]
                  };
                })
              };
              break;
          
      default:
          console.log(`Type ${typeId} is classified as 'Unknown'`);
          result = { type: 'unknown', path: newPath, typeName: 'Unknown',  id: `unknown-${depth}`,
        };
          break;
}

  cache[typeId] = result; 
  return result;
}





