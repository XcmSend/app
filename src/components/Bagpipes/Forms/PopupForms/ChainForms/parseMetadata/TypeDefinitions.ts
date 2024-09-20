import { TypeDef } from './ParseMetadataTypes';
  
  export interface Field {
    name: string;
    typeName: string;
    type: string;
    docs: string[];
    typeId?: string;
  }
  
  export interface VariantObject {
    name: string;
    fields: Field[];
    index: number;
    docs: string[];
    needsLoading?: boolean;
    type: string;

  }

  export interface TupleElement {
    type: string;
  }
  
  export interface Type {
    path: string[];
    params?: any[];
    def: TypeDef;
    docs?: string[];
  }
  
  export interface TypeEntry {
    id: string;
    type: Type;
  }
  
  export interface TypeDefinitions {
    [key: string]: ParsedTypeDefinition;
  }
  
 
  
  export interface RawMetadata {
    metadata: Metadata;
  }
  
  export interface Metadata {
    V14?: VersionedMetadata;
    V13?: VersionedMetadata;
  }
  
  export interface VersionedMetadata {
    pallets: Pallet[];
    lookup?: Lookup;
  }
  
  export interface Lookup {
    types: TypeDef[];
  }
  
  export interface Pallet {
    name: string;
    calls?: Calls;
    storage?: Storage;
  }
  
  export interface Calls {
    type: string;
  }
  
  export interface Storage {
    items: StorageItem[];
  }
  
  export interface StorageItem {
    name: string;
    type: StorageType;
    docs?: string[];
  }
  
  export interface StorageType {
    Map?: Record<string, any>;
  }
  
  export interface MethodOutput {
    name: string;
    calls: CallOutput[];
    storage: StorageOutput[];
  }
  
  export interface CallOutput {
    name: string;
    type: string;
    docs: string;
  }
  
  export interface StorageOutput {
    name: string;
    fields: Field[];
    type: any;
    docs: string;
  }


  export interface Lookup {
    types: TypeDef[];
  }

  export interface TypeLookup {
    [typeId: string]: ParsedTypeDefinition;  // Key is the type ID, value is the parsed type information
  }
  
  export interface ParsedTypeDefinition {
    path: string[];
    params: any[];
    def: TypeDef;
    docs: string;
    typeId?: string;
  }

  export interface PathSegment {
    type: string;
    id: string;
    typeName?: string;  
  }



  export interface ResolvedType {
    id: string;
    type: string; 
    path?: PathSegment[];
    fields?: any[]; 
    elementType?: any;
    length?: string; 
    variants?: any[];
    elements?: ResolvedType[]; 
    typeId?: string;
    typeName?: string;
    name?: string;
  }


  