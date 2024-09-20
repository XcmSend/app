import { Pallet, MethodOutput, RawMetadata, CallOutput, StorageOutput } from './TypeDefinitions';

import { resolveTypeName } from './resolveTypeName';

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
  