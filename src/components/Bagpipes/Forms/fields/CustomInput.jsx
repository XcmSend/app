import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Fields.scss';
import { useDrop } from 'react-dnd';
import { setCaretPosition, getCaretPosition, updateCombinedValue, insertPillAtPosition  } from './utils';
import { nodeTypeColorMapping } from '../PopupForms/Panel/nodeColorMapping';

const CustomInput = ({ fieldKey, value, onChange, onClick, placeholder, className, pills, setPills,onPillsChange }) => {
  const editableInputRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [editableContent, setEditableContent] = useState("");
  
  
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
  const [{ isOver }, drop] = useDrop({
    accept: ['NODE', 'PILL'], 
     hover: (item, monitor) => {
      const dropPosition = monitor.getClientOffset();
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && editableInputRef.current) {
          const dropTargetRect = editableInputRef.current.getBoundingClientRect();
        
          const xPosition = clientOffset.x - dropTargetRect.left;
          const yPosition = clientOffset.y - dropTargetRect.top;
        
          setDropPosition({ x: xPosition, y: yPosition });
          console.log("CustomInput Drop position:", xPosition, yPosition);  

        }
      },
      drop: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          const color = nodeTypeColorMapping[item.nodeType] || 'defaultColor'; 
          const newPill = {
            id: item.id,  
            text: item.label,  
            color: color,
            contentEditable: false, 
            draggable: true,
            nodeIndex: item.nodeIndex,
          };
          const updatedPills = [...pills, newPill]; 
          console.log("CustomInput - Updated pills before calling onPillsChange:", updatedPills);
          onPillsChange(updatedPills, fieldKey); 
          setPills(updatedPills); 
          insertPillAtPosition(editableInputRef, newPill, dropPosition, onChange, handleDragStart, handleDragEnd, removePill);
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
    // Update the editableContent based on the external 'value'
    // This might involve parsing the value if it's a string combining pills and text
    setEditableContent(value);
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

  // Remove the pill element from the DOM
  const pillElement = editableInputRef.current.querySelector(`.pill[data-id="${pillId}"]`);
  if (pillElement) {
    pillElement.remove();
  }

  // Update combined value
  updateCombinedValue(editableInputRef.current, onChange);
};

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      const selection = window.getSelection();
      // Check if the selection is collapsed (cursor, no text selected)
      if (selection.isCollapsed) {
        const anchorNode = selection.anchorNode;
        const previousSibling = anchorNode.previousSibling;
  
        // Check if the cursor is immediately after a pill
        if (previousSibling && previousSibling.classList.contains('pill')) {
          const pillId = previousSibling.getAttribute('data-id');
          removePill(pillId);
        }
      }
    }
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

        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      >
      </div>
    </div>
  );
};

export default CustomInput;