

## Parsing and processing Metadata Types

1. first the metadata is parsed by:

  `const lookupTypes = useMemo(() => {`

in ChainTxForm and ChainQueryForm

2. Then they are processed by `resolveFieldType()` in `parseMetadata.ts`. A path is generated as well as the required input fields in each nested object. 

3. Then they are rendered into fields through `renderMethodFields`

4. `fieldTypeObject` is passed into CollapsibleField which routes them to the correct switch statement. 


## Common Type Definitions

1. Primitive:

- Description: The most basic data types without further subdivisions. Examples include integers, booleans, and strings.
- Use Case: Directly used for input fields in UIs, as they do not contain nested structures.


2. Composite:

- Description: A structured type that consists of multiple named fields, each of which has its own type. This is similar to a "struct" in many programming languages.

- Use Case: Often used to represent objects or records in UIs, where each field of the composite might be displayed as a separate input.


3. Sequence (Vec in Rust):

- Description: A list or array of elements of the same type. The length of the sequence may vary.
- Use Case: Used for dynamic lists in UIs where users can add, remove, or edit multiple items of the same type.


4. Array:

- Description: Similar to sequences but with a fixed length.
- Use Case: Used for fixed collections of items in UIs, often rendered as multiple fields or a grid.


5. Variant (Enum in Rust):

- Description: A type that can be any one of several defined variants, each of which is a type itself. This is similar to "enums" in many languages, but with each variant potentially being a complex type.

- Use Case: Used for dropdowns or selector controls in UIs, where choosing a variant determines which other fields are displayed.


6. Tuple:

- Description: An ordered list of elements, potentially of different types. Similar to arrays but without the restriction of a single element type.
- Use Case: Often used for fixed-length collections where each position has a specific meaning and type, displayed as a row of fields.

7. Compact:

- Description: A type used to optimize the storage of numbers by using variable-length encoding. It's typically wrapped around another numeric type.
- Use Case: Primarily a data storage optimization, not usually directly exposed in UIs except as a normal numeric input.


8. Map:

- Description: A collection of key-value pairs, where keys are of one type and values another.
- Use Case: Not directly mentioned in your scenario, but could be used for associative arrays or dictionary-like structures in a UI.
