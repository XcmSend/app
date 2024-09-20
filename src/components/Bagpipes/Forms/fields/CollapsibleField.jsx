import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Input, Button, Select, Radio } from 'antd';
import Toggle from '../Toggle';
import ItemField from './ItemField'; // Assuming ItemField is in the same directory
import { CustomExpandIcon } from './CustomExpandIcon'; // Assuming CustomExpandIcon is in the same directory
import { PlusIcon } from '../../../Icons/icons';
import { usePanelTippy } from '../../../../contexts/tooltips/TippyContext';
import PanelForm from '../PopupForms/Panel/PanelForm';
import { v4 as uuidv4 } from 'uuid';
import { useDrop, useDrag } from 'react-dnd';
import CustomInput from './CustomInput';
import { SequenceField, CompositeField } from './SubstrateMetadataFields';
import { CopyBlock, CodeBlock, dracula } from 'react-code-blocks';
import FieldRenderer from '../PopupForms/ChainForms/FieldRenderer';
import 'antd/dist/antd.css';
import './Fields.scss';


const { Option } = Select;


const CollapsibleField = ({ fieldKey, nodeId, edgeId, title, info, toggleTitle, hasToggle,fieldTypes, items=[], selectOptions=[], selectRadioOptions=[], children, value, onChange, onPillsChange, placeholder, onClick, disabled, isTextAreaValue, customContent, buttonName, typesLookup, fieldTypeObject, fields, hoverInfo}) => {
  const [isToggled, setIsToggled] = useState(false);
  const { showPanelTippy, hidePanelTippy, tippyPanelInstance } = usePanelTippy();
  const referenceElement = useRef(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [pills, setPills] = useState([]);
  const [editableContent, setEditableContent] = useState("");
  const [compositeValues, setCompositeValues] = useState(value || {});

 
  const [{ isOver }, drop] = useDrop({
    accept: ['NODE', 'PIll'], 
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        const newPill = { id: item.id, text: item.label, color: 'red' }; 
        setPills(currentPills => [...currentPills, newPill]);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  const DroppedItem = ({ item, onRemove }) => {
    const [, drag] = useDrag({
      type: 'NODE',
      item: item,
    });
  
    return (
      <span 
        ref={drag} 
        style={{ cursor: 'pointer', backgroundColor: 'red', margin: '0 4px' }} 
        onClick={onRemove}
      >
        {item.label} 
      </span>
    );
  };

const handleInputClick = (event, nodeId) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  const spaceOnRight = viewportWidth - rect.right;
  const tooltipWidth = 300;
  const shouldFlipToLeft = spaceOnRight < tooltipWidth;

  const calculatedPosition = {
    x: shouldFlipToLeft ? rect.left : rect.right,
    y: rect.top
  };

  showPanelTippy(nodeId, event.currentTarget, <PanelForm nodeId={nodeId} onClose={hidePanelTippy} notifyChange={handleContentChange} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  event.stopPropagation();
};

const handleContentChange = () => {

  // Notify that content has changed
  if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) {
    tippyPanelInstance.current.popperInstance.update();
  }
};

const handleToggleChange = (toggled) => {
    setIsToggled(toggled);
    const fieldData = formData[fieldKey];

    if (toggled) {
        // Toggling to input view
        if (fieldData && fieldData.mode === 'items' && Array.isArray(fieldData.data)) {
            // Convert item data to a single string representation
            const inputValue = fieldData.data.map(item => `${item.key}: ${item.value}`).join(", ");
            // Update using the unified structure
            handleFieldChange(fieldKey, { mode: 'input', data: inputValue });
        }
    } else {
        // Toggling to item view
        if (fieldData && fieldData.mode === 'input' && typeof fieldData.data === 'string') {
            // Simplistic conversion, might need adjustments based on actual string format
            const itemsFromString = [{ key: 'New Item', value: fieldData.data, id: generateUniqueId() }];
            // Update using the unified structure
            handleItemsChange(fieldKey, { mode: 'items', data: itemsFromString });
        }
    }
};

// Sequence Items
const handleAddItem = (defaultType = 'input') => {
  const newItem = { typeId: defaultType, value: '', id: generateUniqueId() }; // Default type can be parameterized
  const newItems = [...items, newItem];
  onChange(newItems);
};

const handleRemoveItem = (index) => {
  const newItems = items.filter((_, idx) => idx !== index);
  onChange(newItems);
};

const handleChangeItem = (index, newValue) => {
  const newItems = items.map((item, idx) => idx === index ? { ...item, value: newValue } : item);
  onChange(newItems);
};

const renderSequenceItems = () => {
  return (
      <div className='flex flex-col'>
          {items.map((item, index) => (
              <div key={item.id} className='flex flex-row items-center'>
                  {renderField(item, index, handleChangeItem)}
                  <button onClick={() => handleRemoveItem(index)}>Remove</button>
              </div>
          ))}
          <button onClick={() => handleAddItem()}>Add New Item</button>
      </div>
  );
};






  

  const deleteItem = (itemToDelete) => {
    setItems(items.filter(item => item !== itemToDelete));
  };

  const generateUniqueId = () => {
    // Generate a random number and truncate it to 5 digits
    const id = uuidv4().split('-')[0].substring(0, 4);
    const item = "item_";
    return item.concat(id);
  };
  
 

    useEffect(() => {
      console.log('Toggled state is now:', isToggled);
    }, [isToggled]);

    useEffect(() => {
    }, [items]);

    useEffect(() => {
      // Update the editableContent based on the external 'value'
      // This might involve parsing the value if it's a string combining pills and text
      setEditableContent(value);
    }, [value]);

      // Function to insert a pill into the content editable div
      const insertPill = (pill) => {
        const newContent = editableContent + `<span class="pill" style="background-color: ${pill.color}">${pill.text}</span>`;
        setEditableContent(newContent);
        onChange(newContent);
      };



  const handleItemDropped = (item) => {
    insertPill(item); // Add the pill representation to the editable area
  };

  const renderDroppedItems = () => {
    return droppedItems.map((item, index) => (
      <DroppedItem key={index} item={item} onRemove={() => removeItem(index)} />
    ));
  };


  function typeRenderer(typeId, typesLookup) {
    const typeInfo = typesLookup[typeId];
    if (!typeInfo) return <div>Unknown Type</div>;

    switch (typeInfo.def.type) {
        case 'Sequence':
            return <SequenceComponent typeId={typeInfo.def.Sequence.type} typesLookup={typesLookup} />;
        case 'Array':
            return <ArrayComponent typeId={typeInfo.def.Array.type} length={typeInfo.def.Array.len} typesLookup={typesLookup} />;
        case 'Variant':
            return <VariantComponent variants={typeInfo.def.Variant.variants} typesLookup={typesLookup} />;
        default:
            return <div>Unsupported Type: {typeInfo.def.type}</div>;
    }
}

const handleSubFieldChange = (subFieldName, newValue) => {
  const updatedValues = { ...compositeValues, [subFieldName]: newValue };
  setCompositeValues(updatedValues);
  // Optionally propagate changes up if needed:
  onChange(nodeId, updatedValues);  // Assuming you want to update some global state
};




const renderContent = (field, depth = 0) => {


    console.log(`Rendering ${field} at depth ${depth}`);

    if (depth > 10) {  // Set a reasonable max depth for recursion
        console.error('Too deep recursion detected', field);
        return <div>Complexity Error</div>;
    }

    let content;



    // Handle the toggle condition
    if (isToggled) {
      return (
         <CustomInput 
              value={value}
              onChange={onChange}
              fieldKey={fieldKey}
              onPillsChange={onPillsChange}
              onClick={(e) => handleInputClick(e, nodeId)} 
              placeholder={info}
              className='custom-input'
              pills={pills}
              setPills={setPills}
              nodeId={nodeId}
            />
      )

    }

  
    // Dynamic field type rendering based on the fieldTypes prop
    switch (fieldTypes) {

      case 'composite':
        console.log('Rendering composite field', fieldTypeObject);
        content = (
          <CompositeField
            fields={fieldTypeObject.fields}
            values={value || {}}
            onChange={onChange}
            typesLookup={typesLookup}
            nodeId={nodeId}
            setPills={setPills}
            onPillsChange={onPillsChange}
            onClick={(e) => handleInputClick(e, nodeId)} 

          />
        );
        break;

        // case 'variant':
        //   console.log('Rendering variant field in collapsible field', fieldTypeObject);
          
        //   content = (
        //     <div>
        //     <VariantField
        //       fields={fieldTypeObject.fields}
        //       // values={value || {}}
        //       onChange={onChange}              
        //       typesLookup={typesLookup}
        //       nodeId={nodeId}
        //       setPills={setPills}
        //       onPillsChange={onPillsChange}
        //       onClick={onClick} 
        //       value={value}
        //       variants={fieldTypeObject.variants}
        //       // onChange={(selectedVariant) => onChange({ ...field, value: selectedVariant })}
  
  

        //     />

        //     </div>
        //   );
    

          case 'sequence':
            content = (
                <SequenceField
                    items={value || []}
                    onChange={(newItems) => onChange(newItems)}
                    typesLookup={typesLookup}
                    elementType={fieldTypeObject.elementType}
                    setPills={setPills}
                    onPillsChange={onPillsChange}
                    nodeId={nodeId}
                />
            );
            break;



        case 'input':
          console.log(' decodeCallData Rendering input field');
            content = (
              <CustomInput 
                value={value}
                onChange={onChange}
                fieldKey={fieldKey}
                onPillsChange={onPillsChange}
                onClick={(e) => handleInputClick(e, nodeId)} 
                placeholder={info}
                className='custom-input'
                pills={pills}
                setPills={setPills}
                nodeId={nodeId}
            />
            );

        break;
        case 'select':
          content = (
            <Select
              onChange={value => onChange(value)}
              getPopupContainer={trigger => trigger.parentNode}

              value={value} 
              className='w-full font-semibold custom-select'
              placeholder="Select option"
            >
              {selectOptions.map((option, index) => (
                <Option key={index} value={option.value}><span className=''>{option.label}</span></Option>
              ))}
            </Select>
          );
          break;

          case 'selectAddressWithBalance':
            content = (
              <>
              <Select
                onChange={value => onChange(value)}
                getPopupContainer={trigger => trigger.parentNode}
  
                value={value} 
                className='w-full font-semibold custom-select'
                placeholder="Select option"
              >
                {selectOptions.map((option, index) => (
                  <Option key={index} value={option.value}>{option.label}</Option>
                ))}
              </Select>
              
      
            </>
            );
          break;
      case 'radio':
        // Check if selectRadioOptions is provided, else default to Yes/No
        // if (selectRadioOptions && selectRadioOptions.length > 0) {
          content = (
            <Radio.Group
            onChange={e => onChange(e.target.value)} // Add onChange handler
            value={value}
            buttonStyle="solid"
           
          >
            {selectRadioOptions && selectRadioOptions.length > 0 ? (
              selectRadioOptions.map((option, index) => (
                <Radio key={index} value={option.value}>{option.label}</Radio>
              ))
            ) : (
              <>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </>
            )}
          </Radio.Group>
          
          );
          break; 
      case 'buttonTextArea':

      // <textarea className="result-textarea" value={value} readOnly />

        content = (
          <>
            {isTextAreaValue ? (
            <div className=''>
              <CopyBlock
              text={value}
              language={'json'}
              showLineNumbers={false}
              customStyle={{borderRadius: '5px', marginBottom:'15px', padding: '5px', backgroundColor: '#f5f5f5', overflow: 'auto', maxWidth: '275px'}}
              />
                  {/* <CodeBlock
            text={value}
            language={'javascript'}
            showLineNumbers={true}
            theme={dracula}
          /> */}
            </div>
            ) : ('')}
          <button className="button mt-3" onClick={onClick} disabled={disabled}>{buttonName}</button>

          </>
        );  
       break;
      case 'items':
   
        const addItem = () => {
          const newItems = [...items, { key: '', value: '', id: generateUniqueId() }]; 
          onChange(newItems);
        };
      
      
        const deleteItem = (itemToDelete) => {
          const newItems = items.filter(item => item !== itemToDelete);
          onChange(newItems); // Update the parent component
        };
      
        const updateItem = (updatedItem) => {
          const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
          onChange(newItems);
        };
      

        content = (
          <div className='flex flex-col '>
            {Array.isArray(items) && items.map((item, index) => (
              <ItemField
                key={item.id}              
                title={`${item.id}`}
                item={item}
                fieldKey={fieldKey}

                onDelete={() => deleteItem(item)}
                onItemChange={(updatedItem) => updateItem(updatedItem)}
                handleInputClick={(e) => handleInputClick(e, nodeId)}
                pills={pills}
                setPills={setPills}
                onPillsChange={onPillsChange}
                value={value}
                onChange={onChange}
                nodeId={nodeId}

                />
            ))}
            <button className='flex items-center text-gray-700 text-sm' onClick={addItem}>
              <PlusIcon className='add-item-icon' />
              Add item
            </button>
          </div>
        );
      break

     
    




    case 'sequenceItems':
          return renderSequenceItems();
    case 'accordion':
      
    break;
    // case 'sequenceItems':
    case 'array':
    // case 'variant':
        return typeRenderer(field.typeId, lookupTypes);
    case 'condition':


    const parseNodeIdFromEdgeId = (edgeId) => {
      console.log('parseNodeIdFromEdgeId', edgeId);
      const parts = edgeId.split('-');
      return parts.length > 1 ? parts[1] : '';
    };
  
    const parsenodeIdfromEdgeId = parseNodeIdFromEdgeId(edgeId);

    
      const handleContentChange = (index, field, newContent) => {
        const updatedValues = [...(value || [])];
        updatedValues[index][field] = newContent;
        onChange(updatedValues);
      };


      const handleSelectChange = (index, field, selectedOption) => {
        const updatedValues = [...(value || [])];
        updatedValues[index][field] = selectedOption.value;
        onChange(updatedValues);
      };

      const handleAddCondition = (type) => {
        const updatedValues = [
          ...(Array.isArray(value) ? value : []),
          { value: '', operator: '', anotherValue: '', type }
        ];
        onChange(updatedValues);
      };

      const handleRemoveItem = (index) => {
        const updatedValues = value.filter((_, i) => i !== index);
        onChange(updatedValues);
      };

      const renderConditionField = (condition, index) => (
        <div key={index} className="condition-field">
          <CustomInput
            value={condition?.value}
            onChange={(newContent) => handleContentChange(index, 'value', newContent)}
            fieldKey={`${fieldKey}-${index}-value`}
            onPillsChange={onPillsChange}
            onClick={(e) => handleInputClick(e, parsenodeIdfromEdgeId)} 
            placeholder={info}
            className='custom-input'
            pills={pills}
            setPills={setPills}
            nodeId={edgeId}
          />
          <Select
            onChange={(selectedOption) => handleSelectChange(index, 'operator', selectedOption)}
            value={selectOptions.find(option => option.value === condition?.operator)}
            options={selectOptions}
            placeholder="Select operator"
            className='w-full font-semibold custom-select'
          />
          <CustomInput
            value={condition?.anotherValue}
            onChange={(newContent) => handleContentChange(index, 'anotherValue', newContent)}
            fieldKey={`${fieldKey}-${index}-anotherValue`}
            onPillsChange={onPillsChange}
            onClick={(e) => handleInputClick(e, parsenodeIdfromEdgeId)} 
            placeholder={info}
            className='custom-input'
            pills={pills}
            setPills={setPills}
            nodeId={edgeId}
          />
          <button type="button" onClick={() => handleRemoveItem(index)} disabled={value.length === 1}>Remove</button>
          <button type="button" onClick={() => handleAddCondition('AND')}>Add AND rule</button>
          <button type="button" onClick={() => handleAddCondition('OR')}>Add OR rule</button>
        </div>
      );

      content = (
        <div>
          {(Array.isArray(value) && value?.length === 0) ? (
            <button type="button" onClick={() => handleAddCondition('')}>Add Condition</button>
          ) : (
            value.map(renderConditionField)
          )}
        </div>
      );
      break;
     
      default:
        content = <div className="description">{info}</div>;
    }
      return (
    <div ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'transparent' }}>
      {renderDroppedItems()}
      {content} {/* Keep the existing input field */}
      {customContent}
    </div>
  );
  };
  
  const header = (
    <div className='font-semibold text-sm text-gray-600 mt-1'>
      <div>{title}</div>
      <div className='text-xs text-gray-500 mt-3'>{hoverInfo}</div>
      
    </div>
  );

  return (

    <div ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'transparent' }} className="collapsible-field-container relative">
    {hasToggle && (
      <div className="toggle-container mt-3 mr-2" style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
        <Toggle title={toggleTitle} isToggled={isToggled} onToggleChange={handleToggleChange} />
      </div>
    )}

    <Collapse className="custom-collapse" accordion defaultActiveKey={['1']} expandIcon={({ isActive }) => CustomExpandIcon({ isActive })}>

      <Collapse.Panel header={header} key="1">
      {children}
        <div className='flex justify-between'>
          {renderContent()}
        </div>
        <div className='custom-info'>{info}</div>
      </Collapse.Panel>
    </Collapse>
    </div>
  );
};

export default CollapsibleField;






