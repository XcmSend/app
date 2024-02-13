
export const getCaretPosition = (editableDivRef) => {
    const editableDiv = editableDivRef.current;
    if (!editableDiv) {
        return 0;
      }
    let caretPos = 0;
    if (window.getSelection && editableDiv) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDiv);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }
    return caretPos;
  };
  
  export const setCaretPosition = (editableDivRef, caretPos) => {
    const editableDiv = editableDivRef.current;
    if (!editableDiv || !window.getSelection) {
      return;
    }
  
    const setPos = (node, pos) => {
      const range = document.createRange();
      const sel = window.getSelection();
  
      range.setStart(node, pos);
      range.collapse(true);
  
      sel.removeAllRanges();
      sel.addRange(range);
    }
  
    let currentPos = 0;
    let nodeFound = false;
  
    const searchNode = (node, pos) => {
      if (!node || nodeFound) {
        return;
      }
  
      // If the node is a text node and the position is within this node
      if (node.nodeType === Node.TEXT_NODE) {
        if (currentPos + node.length >= pos) {
          setPos(node, pos - currentPos);
          nodeFound = true;
          return;
        }
        currentPos += node.length;
      }
  
      // If the node is an element node, traverse its children
      if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          searchNode(node.childNodes[i], pos);
          if (nodeFound) {
            break;
          }
        }
      }
    };
  
    searchNode(editableDiv, caretPos);
  };
  

  export const updateCombinedValue = (editableDiv, onChange) => {
    if (!editableDiv) return;
  
    let combinedValue = '';
    Array.from(editableDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // For text nodes, add the text content to the combined value
        combinedValue += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.className === 'pill') {
        // For pill elements, create an HTML representation
        const pillId = node.getAttribute('data-id');
        const pillText = node.textContent;
        const pillColor = node.style.backgroundColor;
        const nodeIndex = node.getAttribute('data-nodeindex');
        // combinedValue += `<span draggable="true" contenteditable="false" class="pill" data-id="${pillId}" data-text="${pillText}" data-nodeindex="${nodeIndex}" style="background-color: ${pillColor};">${nodeIndex} ${pillText}</span>`;
      }
    });
    console.log("CustomInput 4. combinedValue:", combinedValue);
  
    // Update the state or prop that tracks the combined value
    onChange(combinedValue);
  };


  const getNodeSize = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // For text nodes, estimate size. This is an approximation.
      // One approach is to create a temporary element, add the text, and measure it.
      let tempDiv = document.createElement('div');
      tempDiv.style.display = 'inline-block';
      tempDiv.textContent = node.textContent;
      document.body.appendChild(tempDiv);
      let size = { width: tempDiv.offsetWidth, height: tempDiv.offsetHeight };
      document.body.removeChild(tempDiv);
      return size;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // For element nodes (like pills), use their actual size.
      console.log("CustomNode Node type and size:", node.nodeType, { width: node.offsetWidth, height: node.offsetHeight });
  
      return { width: node.offsetWidth, height: node.offsetHeight };
    }
  
    return { width: 0, height: 0 };
  };
  
  
const calculateIndexFromPosition = (editableDiv, position) => {
    let childNodes = editableDiv.childNodes;
    let accumulatedOffset = 0;
    
    for (let i = 0; i < childNodes.length; i++) {
      let node = childNodes[i];
      let nodeSize = getNodeSize(node); // Function to calculate the size of the node
      console.log("CustomInput 1. calculating middle point");
      // Calculate middle point of the node for more accurate positioning
      let middlePoint = accumulatedOffset + nodeSize.width / 2;
  
    if (position.x <= middlePoint) {
        // Determine if the drop is closer to the previous node or this node
        if (i > 0 && position.x < accumulatedOffset - getNodeSize(editableDiv.childNodes[i - 1]).width / 2) {
          return i - 1;  // Drop between the previous node and this node
        }
        return i; // Drop before this node
      }
      
      accumulatedOffset += nodeSize.width;
    }
  
    return childNodes.length; // If not found, insert at the end
  };
  
  
  const calculateIndexFromCaretPosition = (editableDiv, caretPos) => {
    let cumulativeLength = 0;
    
    for (let i = 0; i < editableDiv.childNodes.length; i++) {
      let node = editableDiv.childNodes[i];
      let nodeLength = node.nodeType === Node.TEXT_NODE ? node.textContent.length : 1; // Assuming a pill counts as one character
  
      if (cumulativeLength + nodeLength >= caretPos) {
        return i; // Insert at this index
      }
  
      cumulativeLength += nodeLength;
    }
  
    return editableDiv.childNodes.length; // Insert at the end if not found
  };
  
  
  const createPillElement = (pill, onDragStart, onDragEnd, onRemovePill) => {
    let pillElement = document.createElement('span');
    pillElement.setAttribute('data-id', pill.id);
    pillElement.textContent = `${pill.nodeIndex}. ${pill.text}`;    
    console.log("CustomInput 1. text content:", pill.text);
    pillElement.className = 'pill';
    pillElement.style.backgroundColor = pill.color;
    pillElement.setAttribute('contenteditable', 'false');
    pillElement.setAttribute('data-nodeindex', pill.nodeIndex);
    pillElement.draggable = true;
    pillElement.addEventListener('click', () => onRemovePill(pill.id));
    pillElement.addEventListener('dragstart', (event) => onDragStart(event, pill));
    pillElement.addEventListener('dragend', onDragEnd);
    console.log("CustomInput 1. created pill element", pillElement);

    return pillElement;
  };
  
  export const insertPillAtPosition = (editableInputRef, pill, dropCoordinates, onChange, handleDragStart, handleDragEnd, removePill) => {
      const editableDiv = editableInputRef.current;
      if (!editableDiv) return;
    
      let index;
      if (dropCoordinates) {
        index = calculateIndexFromPosition(editableDiv, dropCoordinates);
      } else {
      // If dropCoordinates aren't provided, use the caret position
      const caretPos = getCaretPosition(editableInputRef);
      index = calculateIndexFromCaretPosition(editableDiv, caretPos);
    }
    
    let pillElement = createPillElement(pill, handleDragStart, handleDragEnd, removePill);
    
    if (editableDiv.childNodes[index]) {
      editableDiv.insertBefore(pillElement, editableDiv.childNodes[index]);
    } else {
      editableDiv.appendChild(pillElement);
  }
  
    updateCombinedValue(editableDiv, onChange); // Update the combined value
  };
  
  export const insertPillAtCursorPosition = (editableInputRef, pill, handleDragStart, handleDragEnd) => {
    const editableDiv = editableInputRef.current;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    const pillNode = createPillElement(pill, handleDragStart, handleDragEnd, removePill);
    range.insertNode(pillNode);
  
    const textNode = document.createTextNode(' '); // Create a spacer text node
    range.insertNode(textNode); // Insert it after the pill
  
    // Update cursor position
    range.setStartAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  
    updateCombinedValue(editableDiv); // Update combined value
  };
  