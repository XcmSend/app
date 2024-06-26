export interface TypeDef {
    Composite?: {
      fields: Field[];
    };
    Primitive?: string;
    Array?: {
      len: number;
      type: string;
    };
    Sequence?: {
      type: string;
    };
    Variant?: {
      variants: Variant[];
    };
    Tuple?: {
      map(arg0: (tupleTypeId: any) => any): unknown;
      elements: string[];
    };
  }
  
  export interface Field {
    name: string;
    typeName: string;
    type: string;
    docs: string[];
  }
  
  export interface Variant {
    name: string;
    fields: Field[];
    index: number;
    docs: string[];
  }
  
  export interface Type {
    path: string[];
    params: any[];
    def: TypeDef;
    docs: string[];
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
    def: TypeDefDetail;
    docs: string;
  }


  export interface TypeDefDetail {
    Primitive?: string;
    Composite?: {
      fields: Field[];
    };
    Sequence?: {
      elementType: string;
    };
    Array?: {
      elementType: string;
      len: number;
    };
    Variant?: {
      variants: Variant[];
    };
    Tuple?: {
      elements: string[];  // Array of type IDs
    };
  }


  export interface ResolvedType {
    type: string; // The resolved type, like 'input', 'composite', etc.
    path: string[]; // The path of type resolution, indicating the type chain
    elements?: ResolvedType[]; // Optional, used for tuples and other composite structures
    elementType?: string; // Optional, used for sequences and arrays
}


  