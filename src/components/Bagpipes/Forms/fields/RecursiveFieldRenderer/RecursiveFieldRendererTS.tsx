// // Import necessary modules and types
// import React, { useState, useEffect, useRef } from 'react';
// import CustomInput from '../CustomInput';
// import { Select } from 'antd';
// import { CompositeField, SequenceField } from '../SubstrateMetadataFields';
// import { resolveFieldType } from '../../PopupForms/ChainForms/parseMetadata/resolveFieldType';
// import useAppStore from '../../../../../store/useAppStore';
// import { initializeFormData, initializeDefaultValues, generatePath, determineInitialIndex } from './utils';
// import { handleChange } from './changeHandler';
// import _, { set, update } from 'lodash';
// import initializeVariantFields from './initializeVariantFields';
// import useTooltipClick from '../../../../../contexts/tooltips/tooltipUtils/useTooltipClick';
// import { usePanelTippy } from '../../../../../contexts/tooltips/TippyContext';
// import '../../PopupForms/ChainForms/ChainTxForm/DynamicFieldRenderer';
// import './RecursiveFieldRenderer.scss';

// // Import types from Ant Design
// import { SelectProps } from 'antd';

// const { Option } = Select;

// // Define interfaces for your data structures
// interface FieldObjectBase {
//   type: string;
//   typeName: string;
//   path?: any[];
//   id?: string;
// }

// interface InputFieldObject extends FieldObjectBase {
//   type: 'input';
// }

// interface Variant {
//   name: string;
//   index: number;
//   fields: Field[];
// }

// interface VariantFieldObject extends FieldObjectBase {
//   type: 'variant';
//   variants: Variant[];
// }

// interface Field {
//   name: string;
//   resolvedType: FieldObject;
//   index?: number;
// }

// interface CompositeFieldObject extends FieldObjectBase {
//   type: 'composite';
//   fields: Field[];
// }

// interface SequenceFieldObject extends FieldObjectBase {
//   type: 'sequence';
//   elementType: FieldObject;
// }

// interface ArrayFieldObject extends FieldObjectBase {
//   type: 'array';
//   elementType: FieldObject;
//   length: number;
// }

// interface TupleFieldObject extends FieldObjectBase {
//   type: 'tuple';
//   elements: Field[];
// }

// interface TupleElementFieldObject extends FieldObjectBase {
//   type: 'tupleElement';
//   resolvedType: FieldObject;
// }

// type FieldObject =
//   | InputFieldObject
//   | VariantFieldObject
//   | CompositeFieldObject
//   | SequenceFieldObject
//   | ArrayFieldObject
//   | TupleFieldObject
//   | TupleElementFieldObject;

// // Define the props interface for your component
// interface RecursiveFieldRendererProps {
//   fieldObject: FieldObject;
//   formValues: any;
//   onChange?: (newValue: any) => void;
//   nodeId: string;
//   pills?: any;
//   setPills?: (pills: any) => void;
//   onPillsChange?: (pills: any) => void;
//   fieldName?: string;
//   fieldPath: string;
//   fromType?: string;
// }

// // Define any additional types you need
// interface Scenario {
//   id: string;
//   diagramData: {
//     nodes: Array<{
//       id: string;
//       formData: any;
//     }>;
//   };
// }

// interface AppState {
//   scenarios: { [key: string]: Scenario };
//   activeScenarioId: string;
//   saveNodeFormData: (scenarioId: string, nodeId: string, formData: any) => void;
//   clearSignedExtrinsic: () => void;
//   markExtrinsicAsUsed: () => void;
//   updateNodeResponseData: () => void;
// }

// const RecursiveFieldRenderer: React.FC<RecursiveFieldRendererProps> = ({
//   fieldObject,
//   formValues,
//   onChange,
//   nodeId,
//   pills,
//   setPills,
//   onPillsChange,
//   fieldName,
//   fieldPath,
//   fromType,
// }) => {
//   console.log(
//     `RecursiveFieldRenderer - CYCLE CHECK fieldObject, formValues, fieldName, nodeId, ${fieldPath}`,
//     { fromType, fieldObject, formValues, fieldName, nodeId, fieldPath }
//   );

//   // For the Panel Form... Notify that content has changed
//   const { tippyPanelInstance } = usePanelTippy();
//   const handleContentChange = () => {
//     if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) {
//       tippyPanelInstance.current.popperInstance.update();
//     }
//   };
//   const { handleInputClick } = useTooltipClick(nodeId, handleContentChange);
//   //

//   // Use the app store with proper typing
//   const {
//     scenarios,
//     activeScenarioId,
//     saveNodeFormData,
   
//   } = useAppStore((state: AppState) => ({
//     scenarios: state.scenarios,
//     activeScenarioId: state.activeScenarioId,
//     saveNodeFormData: state.saveNodeFormData,
    
//   }));

//   const formData =
//     scenarios[activeScenarioId]?.diagramData?.nodes.find((node) => node.id === nodeId)?.formData ||
//     {};
//   const existingFieldData = _.get(formData.params, fieldPath);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
//     const initialIndex = determineInitialIndex(existingFieldData, (fieldObject as VariantFieldObject).variants);
//     return initialIndex;
//   });

//   const hasInitializedVariantFields = useRef<boolean>(false);

//   // FOR ARRAY
//   // Initialize array items based on existing formValues or provide defaults.
//   const initialArrayItems = formValues?.[fieldName as string] || Array.from({ length: (fieldObject as ArrayFieldObject).length }, () => ({}));
//   const [arrayItems, setArrayItems] = useState<any[]>(initialArrayItems);
//   // For Array
//   // Effect to update arrayItems when the length changes
//   useEffect(() => {
//     // Only reset arrayItems if the length actually changes to avoid unnecessary re-renders
//     if (arrayItems.length !== (fieldObject as ArrayFieldObject).length) {
//       setArrayItems(Array.from({ length: (fieldObject as ArrayFieldObject).length }, () => ({})));
//     }
//   }, [(fieldObject as ArrayFieldObject).length]); // Dependency on fieldObject.length

//   // FOR SEQUENCE
//   // Initialize sequence items safely by checking if the path points to an array
//   // Initialization and state management for sequence items
//   const [items, setItems] = useState<any[]>(() => {
//     // Assuming formData.params[fieldPath] is directly the array for this sequence
//     return formData.params?.[fieldPath]
//       ? formData.params?.[fieldPath].map((item: any, index: number) => ({
//           value: item,
//           pathKey: `${fieldPath}[${index}]`, // Directly constructing pathKey
//         }))
//       : [];
//   });

//   const fieldType = fieldObject.type as
//     | 'input'
//     | 'variant'
//     | 'composite'
//     | 'sequence'
//     | 'array'
//     | 'tuple'
//     | 'tupleElement';

//   // Existing field data looks at the current field path and checks if there is any data there.
//   // In each switch statement, this is used to check if the field has been initialized.
//   // If it has not been initialized, then the default values are set.

//   console.log(`RecursiveFieldRenderer - CHECKING ${fieldType} 1. fieldObject, formValues, fieldName, nodeId, fieldPath:`, {
//     fieldObject,
//     fieldName,
//     nodeId,
//     fieldPath,
//   });

//   // UseEffect to handle selectedIndex change
//   useEffect(() => {
//     if (selectedIndex !== null && fieldType === 'variant') {
//       const existingVariantData = _.get(formData.params, fieldPath);
//       if (!existingVariantData) {
//         const selectedVariant = (fieldObject as VariantFieldObject).variants?.find(
//           (variant) => variant.index === selectedIndex
//         );
//         if (selectedVariant) {
//           const updatedParams = initializeVariantFields(selectedVariant, fieldPath, formData, false);
//           saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
//           hasInitializedVariantFields.current = true;
//         }
//       }
//     }
//   }, [selectedIndex, formData.params, fieldPath]);

//   const handleInputChange = (path: string, newValue: any, fieldName?: string) => {
//     console.log(`RecursiveFieldRenderer - input handleInputChange about to change formValues input:`, {
//       path,
//       newValue,
//       formValues,
//     });

//     const updatedParams = handleChange(path, newValue, false, 'input', formData);
//     console.log(`RecursiveFieldRenderer - input updated params after handleInputChange input:`, updatedParams, path, newValue);

//     saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
//   };

//   console.log('RecursiveFieldRenderer - fieldObject, existingFieldData:', {
//     fieldObject,
//     existingFieldData,
//     fieldPath,
//     formValues,
//   });

//   switch (fieldType) {
//     case 'input':
//       const getFormDataForInput = _.get(formData.params, fieldPath, null);
//       console.log('RecursiveFieldRenderer - input getFormDataForInput 1:', getFormDataForInput, fieldPath);

//       if (getFormDataForInput === undefined || getFormDataForInput === null) {
//         console.log('RecursiveFieldRenderer - input 1. no getFormDataForInput:', fieldObject, getFormDataForInput, fieldPath);
//         const initialValue = initializeDefaultValues(fieldObject, fieldPath, 'fromInput');

//         const updatedParams = handleChange(fieldPath, initialValue, false, 'input', formData);
//         console.log('RecursiveFieldRenderer - input 3. updatedParams:', { updatedParams, fieldPath, initialValue });
//         saveNodeFormData(activeScenarioId, nodeId, { ...formData, params: updatedParams });
//       }

//       console.log('RecursiveFieldRenderer - input getFormDataForInput formValues, fieldObject:', {
//         fieldPath,
//         fieldName,
//         formValues,
//         getFormDataForInput,
//         fieldObject,
//         fieldType,
//       });
//       console.log('RecursiveFieldRenderer - input fieldPath formValues:', { fieldPath, formValues });

//       const inputStyle =
//         fieldObject.typeName === 'Bytes' && (getFormDataForInput === '0' || getFormDataForInput === '0x')
//           ? 'background-bytes'
//           : '';

//       let prevId = '';
//       if (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'composite') {
//         // Get the prev id of the field path
//         prevId = fieldObject?.path?.[fieldObject.path.length - 2]?.id || '';
//         console.log('RecursiveFieldRenderer - input prevId in composite:', prevId);
//       } else if (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'variant') {
//         prevId = fieldObject?.path?.[fieldObject.path.length - 1]?.id || '';
//         console.log('RecursiveFieldRenderer - input prevId in variant:', prevId);
//       } else if (fieldObject?.path?.[fieldObject.path.length - 1]?.type === 'sequence') {
//         prevId = fieldObject?.path?.[fieldObject.path.length - 1]?.id || '';
//       } else {
//         prevId = fieldObject?.path?.[fieldObject.path.length - 2]?.id || '';
//       }

//       return (
//         <div className="input-container">
//           <div className="input-field">
//             <label className="font-semibold">
//               {fieldName ? (
//                 <>
//                   {' '}
//                   <span className="field-name">{`${fieldName}`}</span>
//                   <span className="type-name"> {'<'}{fieldObject.typeName}{'>'}</span>{' '}
//                 </>
//               ) : (
//                 <>
//                   {' '}
//                   <span className="field-name">Input:</span>
//                   <span className="type-name"> {'<'}{fieldObject.typeName}{'>'} </span>{' '}
//                 </>
//               )}
//             </label>
//             <CustomInput
//               key={prevId}
//               value={getFormDataForInput}
//               onChange={(newValue) => handleInputChange(fieldPath, newValue, fieldName)}
//               onPillsChange={onPillsChange}
//               placeholder={`Enter ${fieldObject.typeName}`}
//               className={`custom-input ${inputStyle}`}
//               pills={pills}
//               setPills={setPills}
//               nodeId={nodeId}
//               onClick={handleInputClick}
//             />
//           </div>
//         </div>
//       );

//     case 'variant':
//       // Type casting to VariantFieldObject
//       const variantFieldObject = fieldObject as VariantFieldObject;

//       if (!variantFieldObject.variants || variantFieldObject.variants.length === 0) {
//         console.warn('No variants available for fieldObject:', variantFieldObject);
//         return <div>No variants available.</div>;
//       }

//       const handleVariantChange = (selectedValue: number) => {
//         const selectedVariant = variantFieldObject.variants.find((variant) => variant.index === selectedValue);
//         if (selectedIndex !== selectedValue) {
//           console.log(`RecursiveFieldRenderer - variant 2.  handleVariantChange selectedValue, selectedVariant, selectedIndex:`, {
//             selectedValue,
//             selectedVariant,
//             selectedIndex,
//             fieldPath,
//           });
//           setSelectedIndex(selectedValue);
//         }
//         console.log(`RecursiveFieldRenderer - variant 3. handleVariantChange selectedValue, selectedVariant, selectedIndex:`, {
//           selectedValue,
//           selectedVariant,
//           selectedIndex,
//         });
//       };

//       console.log('RecursiveFieldRenderer - variant 1a. existingFieldData:', { existingFieldData, fieldPath, formData });

//       if (!selectedIndex) {
//         const determinedSelectedIndex = determineInitialIndex(existingFieldData, variantFieldObject.variants);
//         console.log('RecursiveFieldRenderer - variant 1b. assigning selectedIndex value:', { selectedIndex, fieldPath });
//         setSelectedIndex(determinedSelectedIndex);
//       } else {
//         console.log('RecursiveFieldRenderer - variant 1b. already selectedIndex value:', { selectedIndex, fieldPath });
//       }
//       if (!existingFieldData && fieldType === 'variant') {
//         console.log('RecursiveFieldRenderer - variant 2a. initialize variant:', { fieldPath });
//         initializeVariantFields(variantFieldObject.variants[0], fieldPath, formData, true); // isDefault = true here
//       }

//       const selectedValue = _.get(formData.params, `${fieldPath}`, '');
//       console.log('RecursiveFieldRenderer - variant 2i. selectedValue and existingFieldData:', {
//         selectedValue,
//         existingFieldData,
//         fieldPath,
//       });

//       const selectedVariant = variantFieldObject.variants.find((variant) => variant.index === selectedIndex);
//       const selectedVariantName = selectedVariant?.name;
//       const variantPath = generatePath(fieldPath, selectedVariantName, 'variant', 'variantSecond');

//       return (
//         <div className="variant-container">
//           <div className="variant-selector">
//             <Select
//               value={selectedIndex}
//               onChange={handleVariantChange}
//               className="w-full font-semibold custom-select"
//               placeholder="Select option"
//               getPopupContainer={(trigger) => trigger.parentNode}
//             >
//               {variantFieldObject.variants.map((variant) => (
//                 <Option key={variant.index} value={variant.index}>
//                   {variant.name}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//           {selectedIndex !== null &&
//             variantFieldObject.variants
//               .find((variant) => variant.index === selectedIndex)
//               ?.fields.map((field, index) => {
//                 console.log('RecursiveFieldRenderer - variant field before fieldVariantPath:', field, fieldPath);
//                 const subFieldsType = field.resolvedType.type;

//                 // Check if all siblings are variants
//                 const isAllSiblingsVariantThenPassAsParentType = variantFieldObject.variants
//                   .find((variant) => variant.index === selectedIndex)
//                   ?.fields.every((field) => field.resolvedType.type === 'variant');
//                 console.log(
//                   'RecursiveFieldRenderer - variant field isAllSiblingsVariantThenPassAsParentType:',
//                   isAllSiblingsVariantThenPassAsParentType,
//                   fieldPath,
//                   field.name,
//                   field
//                 );
//                 const subFieldPath = generatePath(
//                   variantPath,
//                   field.name,
//                   subFieldsType,
//                   'variantThird',
//                   isAllSiblingsVariantThenPassAsParentType,
//                   field.index
//                 );
//                 console.log('RecursiveFieldRenderer - variant field rrr:', { subFieldPath, field, fieldPath }, field.name, field.resolvedType.type);

//                 return (
//                   <div className="variant-field" key={index}>
//                     <label className="font-semibold">
//                       {' '}
//                       {field?.resolvedType?.type === 'input' ? null : (
//                         <>
//                           {' '}
//                           {field?.name && <span className="field-name">{field.name}</span>}
//                           <span className="type-name">
//                             {'<'}
//                             {field?.resolvedType?.typeName}
//                             {'>'}
//                           </span>{' '}
//                         </>
//                       )}
//                     </label>
//                     <RecursiveFieldRenderer
//                       fieldObject={field.resolvedType}
//                       formValues={_.get(formData, `params.${subFieldPath}`, {})}
//                       fieldPath={subFieldPath}
//                       nodeId={nodeId}
//                       fromType={'variantField'}
//                       fieldName={field.name}
//                     />
//                   </div>
//                 );
//               })}
//         </div>
//       );

//     case 'composite':
//       const compositeFieldObject = fieldObject as CompositeFieldObject;
//       console.log('RecursiveFieldRenderer - composite 1a. :', { compositeFieldObject, fieldPath });

//       return (
//         <div className="composite-container">
//           {compositeFieldObject.fields.map((field, index) => {
//             const subFieldType = field.resolvedType.type;
//             const subFieldPath = generatePath(
//               fieldPath,
//               field.name,
//               subFieldType === 'sequence' ? 'sequenceField' : 'compositeField',
//               'fromComposite'
//             );
//             console.log('RecursiveFieldRenderer - composite initialize composite rrr 3. subFieldPath:', fieldPath, field, subFieldPath, field.resolvedType);
//             return (
//               <div key={index} className="composite-field">
//                 <label className="font-semibold">
//                   {' '}
//                   {field?.resolvedType?.type === 'input' ? null : (
//                     <>
//                       {' '}
//                       {field?.name && <span className="field-name">{field.name}</span>}
//                       <span className="type-name">
//                         {'<'}
//                         {field?.resolvedType?.typeName}
//                         {'>'}
//                       </span>{' '}
//                     </>
//                   )}
//                 </label>
//                 <RecursiveFieldRenderer
//                   fieldObject={field.resolvedType}
//                   formValues={formData.params?.[subFieldPath] || {}}
//                   fieldPath={subFieldPath}
//                   nodeId={nodeId}
//                   fieldName={field.name}
//                   fromType={'compositeField'}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       );

//     case 'sequence':
//       const sequenceFieldObject = fieldObject as SequenceFieldObject;
//       console.log('RecursiveFieldRenderer - sequence:', sequenceFieldObject);

//       // Add new item to the sequence
//       const handleAddItem = () => {
//         const newItemDefaultValue = initializeDefaultValues(
//           sequenceFieldObject.elementType,
//           generatePath(fieldPath, items.length, 'sequenceItem', 'sequenceItem'),
//           'sequenceDefault'
//         );
//         const newItem = {
//           value: newItemDefaultValue,
//           pathKey: generatePath(fieldPath, items.length, 'sequenceItem', 'sequenceItem'),
//         };
//         const updatedItems = [...items, newItem];
//         setItems(updatedItems);
//         handleChange(newItem.pathKey, newItemDefaultValue, false, 'sequence', formData);
//       };

//       // Update an item in the sequence
//       const handleChangeItem = (index: number, newValue: any) => {
//         const itemPath = generatePath(fieldPath, index, 'sequenceItem', 'sequenceItem');
//         handleChange(itemPath, newValue, true, 'sequence', formData);
//         const updatedItems = [...items];
//         updatedItems[index].value = newValue;
//         setItems(updatedItems);
//       };

//       // Remove item from the sequence
//       const handleRemoveItem = (index: number) => {
//         const newItems = items.filter((_, i) => i !== index);
//         setItems(newItems);
//         const updatedArray = newItems.map((item) => item.value);
//         handleChange(fieldPath, updatedArray, true, 'sequence', formData);
//       };

//       // Render sequence items
//       return (
//         <div className="sequence-container">
//           <div className="add-remove-box">
//             <button className="sequence-button" onClick={handleAddItem}>
//               <div className="add-button">+</div>
//               <label>Add item</label>
//             </button>
//           </div>
//           {items.map((item, index) => (
//             <React.Fragment key={item.pathKey}>
//               <label className="font-semibold">
//                 <span className="index-style">{index}:</span>
//                 <span className="type-name">
//                   {' <'}
//                   {fieldObject.typeName}
//                   {'>'}
//                 </span>
//               </label>
//               <div className="sequence-item">
//                 <RecursiveFieldRenderer
//                   fieldObject={sequenceFieldObject.elementType}
//                   formValues={item.value}
//                   onChange={(newValue) => handleChangeItem(index, newValue)}
//                   nodeId={nodeId}
//                   fieldPath={item.pathKey}
//                   fromType={'sequenceField'}
//                 />
//               </div>
//               <div className="add-remove-box">
//                 <button className="sequence-button" onClick={() => handleRemoveItem(index)}>
//                   <div className="remove-button">-</div>
//                   <label>Remove item</label>
//                 </button>
//               </div>
//             </React.Fragment>
//           ))}
//         </div>
//       );

//     case 'array':
//       const arrayFieldObject = fieldObject as ArrayFieldObject;
//       console.log('RecursiveFieldRenderer - array:', arrayFieldObject);

//       // Handle change: propagate up instead of managing locally
//       const handleChangeArrayItem = (index: number, newValue: any) => {
//         const updatedArrayItems = [...arrayItems];
//         updatedArrayItems[index] = newValue;
//         setArrayItems(updatedArrayItems); // Update local state to trigger re-render
//         onChange && onChange({ ...formValues, [fieldName as string]: updatedArrayItems }); // Propagate changes up
//       };

//       return (
//         <div className="array-container">
//           {arrayItems.map((item, index) => (
//             <div key={index} className="array-item">
//               <label className="font-semibold">
//                 {' '}
//                 {fieldName && <span className="field-name">{fieldName}</span>}
//                 <span className="type-name">
//                   {'<'}
//                   {arrayFieldObject.elementType.typeName}
//                   {'>'}
//                 </span>{' '}
//               </label>
//               <RecursiveFieldRenderer
//                 fieldObject={arrayFieldObject.elementType}
//                 formValues={item}
//                 onChange={(newValue) => handleChangeArrayItem(index, newValue)}
//                 nodeId={nodeId}
//                 fieldPath={generatePath(fieldPath, index, 'array', 'arraySecond')}
//                 fromType={'arrayField'}
//               />
//             </div>
//           ))}
//         </div>
//       );

//     case 'tuple':
//       const tupleFieldObject = fieldObject as TupleFieldObject;
//       const handleTupleChange = (index: number, newValue: any) => {
//         const updatedTupleItems = [...(formValues[fieldName as string] || [])];
//         updatedTupleItems[index] = newValue;

//         // Update the tuple in the main form values object
//         onChange && onChange({ ...formValues, [fieldName as string]: updatedTupleItems });
//       };

//       console.log('RecursiveFieldRenderer - tuple:', tupleFieldObject);
//       return (
//         <div className="tuple-container">
//           {tupleFieldObject.elements.map((element, index) => {
//             return (
//               <div key={index} className="tuple-item">
//                 <label className="font-semibold">{`Element ${index}: <${element.resolvedType.typeName || element.type}>`}</label>
//                 <RecursiveFieldRenderer
//                   fieldObject={element.resolvedType}
//                   formValues={(formValues?.[fieldName as string] || [])[index]}
//                   onChange={(newValue) => handleTupleChange(index, newValue)}
//                   nodeId={nodeId}
//                   fieldPath={generatePath(fieldPath, element.name, 'tuple', 'tupleSecond')}
//                   fromType={'tuple'}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       );

//     case 'tupleElement':
//       const tupleElementFieldObject = fieldObject as TupleElementFieldObject;
//       console.log('RecursiveFieldRenderer - tupleElement:', tupleElementFieldObject);
//       return (
//         <RecursiveFieldRenderer
//           fieldObject={tupleElementFieldObject.resolvedType}
//           formValues={formValues}
//           onChange={onChange}
//           nodeId={nodeId}
//           fieldName={fieldName}
//           fieldPath={fieldPath}
//         />
//       );

//     default:
//       console.log('RecursiveFieldRenderer - default:', fieldObject);
//       return (
//         <div key={fieldName}>
//           Unsupported field type: {fieldType}
//         </div>
//       );
//   }
// };

// export default RecursiveFieldRenderer;
