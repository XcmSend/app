import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Fields.scss';
import { useDrop } from 'react-dnd';
import { cleanPasteContent,sanitizeHtmlContent, setCaretPosition, getCaretPosition, updateCombinedValue, insertPillAtPosition  } from './utils';
import { nodeTypeColorMapping } from '../PopupForms/Panel/nodeColorMapping';
import { functionBlocks } from '../PopupForms/Panel/Pills/pillsData';
import '../PopupForms/Panel/Pills/Pills.scss';

const CustomInput = ({ fieldKey, value, onChange, onClick, placeholder, className, pills, setPills, onPillsChange }) => {
  const editableInputRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [editableContent, setEditableContent] = useState("");
  
  
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
  const [{ isOver }, drop] = useDrop({
    accept: ['GENERAL_PILL', 'PILL', 'FUNCTION_BLOCK', 'KEYWORD_PILL', 'MATH_PILL', 'VARIABLE_PILL', 'OPERAND_PILL' ], // Include 'FUNCTION_BLOCK' or other relevant types as accepted
    hover: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (clientOffset && editableInputRef.current) {
            const dropTargetRect = editableInputRef.current.getBoundingClientRect();
            const xPosition = clientOffset.x - dropTargetRect.left;
            const yPosition = clientOffset.y - dropTargetRect.top;
            setDropPosition({ x: xPosition, y: yPosition });
            // console.log("CustomInput Drop position:", xPosition, yPosition);  
        }
    },
    drop: (item, monitor) => {
        console.log("CustomInput Drop function called", item);
        if (monitor.isOver({ shallow: true })) {
            console.log("CustomInput Item is over and will be processed", item);
            let itemsToInsert = [];
            console.log("CustomInput functionBlocks:", functionBlocks);
            // Determine if the dropped item is a function block
            if (item.nodeType === 'function' && functionBlocks[item.id]) {
              const functionBlockItems = functionBlocks[item.id];
              console.log("CustomInput Function block items:", functionBlockItems);
              
              functionBlockItems.forEach((blockItem, index) => {
                  // Construct a unique id for each pill. You can use the blockItem's type and index.
                  // If you need more uniqueness, consider adding more distinct identifiers.
                  let pillId = `${item.id}-${blockItem.type}-${index}`;
          
                  // Use blockItem.name directly for the pill text
                  let pillText = blockItem.name;
                  console.log("CustomInput Pill text:", blockItem);
          
                  let pillRepresentation = {
                      id: pillId,
                      text: pillText,
                      class: blockItem.class,
                      group: blockItem.group,
                      contentEditable: false,
                      draggable: true,
                    
                  };
                  
                  itemsToInsert.push(pillRepresentation);
              });
            } else if (item.nodeType === 'keyword' || item.nodeType === '' || item.nodeType === 'math' || item.nodeType === 'logic' || item.nodeType === 'general' || item.nodeType === 'operand' || item.nodeType === 'variable') {
              console.log("CustomInput node type Pill item:", item);
              itemsToInsert.push({
                  id: item.id,
                  text: item.label,
                  contentEditable: false,
                  draggable: true,
                  nodeIndex: item.nodeIndex,
                  class: item.class,
              });
            }
          else {
              // Handle as a single pill if not a function block
              // const textColor = '#232323';
              const color = nodeTypeColorMapping[item.nodeType] || 'defaultColor';
              console.log("CustomInput Pill color:", color);

              itemsToInsert.push({
                  id: item.id,
                  text: item.label,
                  contentEditable: false,
                  draggable: true,
                  nodeIndex: item.nodeIndex,
                  class: item.class,
                  color: color
                  // style: `background-color: ${color}; color: ${textColor};`, // Assuming you want to use the color variable here
              });
          }
          

            // Insert each item
            itemsToInsert.forEach(newPill => {
                insertPillAtPosition(editableInputRef, newPill, dropPosition, onChange, handleDragStart, handleDragEnd, removePill);
            });

            // Update pills state
            const updatedPills = [...pills, ...itemsToInsert];
            // onPillsChange(updatedPills, fieldKey);
            // console.log("CustomInput Updated pills:", updatedPills);
            setPills(updatedPills);

        }
    },
    collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
    }),
});

  // Merged ref callback
  const refCallback = useCallback(
    (node) => {
      // Assigns the node to the drop ref
      drop(node);

      // Also keeps reference to the node
      editableInputRef.current = node;
    },
    [drop], 
  );

  useEffect(() => {
    console.log("Component rendered or updated");
  }, [editableContent]);


  useEffect(() => {
    if (editableInputRef.current && value !== editableInputRef.current.innerHTML) {
      setEditableContent(value);  // This might cause cursor issues, needs careful handling
    }
  }, [value]);

 


  const handleContentChange = (e) => {
    const caretPosition = getCaretPosition(editableInputRef);
    const newContent = e.target.innerHTML;
    setEditableContent(newContent);
    onChange(newContent);
  
    setTimeout(() => {
      setCaretPosition(editableInputRef, caretPosition);
    }, 0);
  };

  const handleDivClick = (e) => {
    if (e.target.classList.contains('pill')) {
      const pillId = e.target.getAttribute('data-id');
      removePill(pillId);
    }
  };

  const handlePillClick = (pillId) => {
    // Remove the clicked pill and update the state
    const newPills = pills.filter(pill => pill.id !== pillId);
    setPills(newPills);
  };


  const handleDragStart = (event, pill) => {
  // Logic for starting drag
  const pillId = event.dataTransfer.setData("text/plain", pill.id);
  console.log("CustomInput drag start", pillId);
};

const handleDragEnd = (event) => {
  // TODO: Logic for ending drag, possibly removing pill from original position
  const pillId = event.dataTransfer.getData("text/plain");
  console.log("CustomInput drag end", pillId);
};


const removePill = (pillId) => {
  // Update state to remove the pill
  setPills(currentPills => currentPills.filter(pill => pill.id !== pillId));

  // Locate the pill element in the DOM
  const pillElement = editableInputRef.current.querySelector(`.pill[data-id="${pillId}"]`);
  if (pillElement) {
    // Check if the next sibling is the spacer
    const nextSibling = pillElement.nextSibling;
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent === '\u200B') {
      // If the next sibling is the spacer, remove it
      pillElement.parentNode.removeChild(nextSibling);
    }

    // Remove the pill element from the DOM
    pillElement.parentNode.removeChild(pillElement);

    // after removing a pill and potentially a spacer, may want to adjust caret positioning
    //  logic for placing the caret, if needed, would go here

    // Update combined value
    updateCombinedValue(editableInputRef.current, onChange);
  }
};


  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const text = clipboardData.getData('text/plain');
    const html = clipboardData.getData('text/html');
    
    const contentToPaste = html || text;
    const cleanedContent = sanitizeHtmlContent(contentToPaste);
    
    document.execCommand('insertHTML', false, cleanedContent);
  };




const handleKeyDown = (event) => {
  if (event.key === 'Backspace') {
    const selection = window.getSelection();
    if (selection.isCollapsed) {
      const anchorNode = selection.anchorNode;
      let targetPill = null;

      // If the anchorNode is a text node and its previous sibling is a pill, target that pill
      if (anchorNode.nodeType === Node.TEXT_NODE && anchorNode.previousSibling?.classList.contains('pill')) {
        targetPill = anchorNode.previousSibling;
      }
      // If the anchorNode is a pill itself (e.g., caret is directly after a pill), target the pill
      else if (anchorNode.nodeType === Node.ELEMENT_NODE && anchorNode.classList.contains('pill')) {
        targetPill = anchorNode;
      }
      // If the parent of the anchorNode is a pill (for handling cases with nested structures), target the parent pill
      else if (anchorNode.parentNode?.classList.contains('pill')) {
        targetPill = anchorNode.parentNode;
      }

      if (targetPill) {
        event.preventDefault(); // Stop the backspace from removing more than the pill
        const pillId = targetPill.getAttribute('data-id');
        removePill(pillId);
      }
    }
  }

  // if (event.key === 'Enter') {
  //   event.preventDefault();
  //   // document.execCommand('insertText', false, '\n');
  // }
};




  return (
    <div className={`custom-input-container ${className}`} onClick={onClick}>
      <div 
        ref={refCallback}
        className={"editable-input"} 
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: editableContent }}
        onInput={handleContentChange}
        onClick={handleDivClick}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      >
      </div>
    </div>
  );
};

export default CustomInput;