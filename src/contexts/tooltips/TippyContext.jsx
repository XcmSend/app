import React, { createContext, useState, useContext } from 'react';

const TippyContext = createContext();

export const useTippy = () => useContext(TippyContext);

export const TippyProvider = ({ children }) => {
  const [tippyProps, setTippyProps] = useState({
    visible: false,
    position: { x: 100, y: 300 },
    nodeId: null,
    placement: 'bottom',
    content: null
  });

  const calculatePosition = (referenceElement, placement) => {
    const rect = referenceElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const tooltipWidth = 300; // Adjust based on your tooltip size or make it dynamic
    const spaceOnRight = viewportWidth - rect.right;
    const shouldFlipToLeft = spaceOnRight < tooltipWidth && placement.startsWith('right');

    let calculatedPosition;
    switch (placement) {
      case 'right-start':
      case 'right':
        calculatedPosition = shouldFlipToLeft ? { x: rect.left - tooltipWidth, y: rect.top } : { x: rect.right, y: rect.top };
        break;
      // Implement other placements as needed
      default:
        calculatedPosition = { x: rect.left, y: rect.top + window.scrollY }; // Fallback or default position
    }

    return { calculatedPosition, placement: shouldFlipToLeft && placement.startsWith('right') ? 'left-start' : placement };
  };


  const showTippy = (contentType, nodeId, referenceElement, content, placement = 'bottom') => {
    console.log('showTippy called with nodeId:', nodeId);
  
    const { calculatedPosition, placement: finalPlacement } = calculatePosition(referenceElement, placement);
  
    setTippyProps({
      visible: true,
      position: calculatedPosition,
      nodeId,
      content,
      placement: finalPlacement,
    });
  };


  const hideTippy = () => {
    setTippyProps({ visible: false, position: { x: 0, y: 0 }, nodeId: null, content: null, placement: 'bottom' });
  };

  return (
    <TippyContext.Provider value={{ tippyProps, showTippy, hideTippy }}>
      {children}
    </TippyContext.Provider>
  );
};


const PanelTippyContext = createContext();

export const usePanelTippy = () => useContext(PanelTippyContext);

export const PanelTippyProvider = ({ children }) => {
  const [panelTippyProps, setPanelTippyProps] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    content: null,
    placement: 'bottom',
  });

  const showPanelTippy = (nodeId, position, content, placement ='top-start') => {
    const parentPosition = { x: 100, y: 300 }; // Example: Get this from the parent element's bounding box
    const bestPlacement = calculateBestPlacement(parentPosition, -200); // Use a 15px offset
    
    setPanelTippyProps({ 
      visible: true, 
      position,
      content, 
      placement, 
    });
  };

  const hidePanelTippy = () => {
    setPanelTippyProps({ visible: false, position: { x: 0, y: 0 }, content: null, placement: 'right' });
  };

  // Ensure you render the Tippy component only when it's visible
  // And ensure you're providing a reference to an element, even if it's hidden or not interactable

  return (
    <PanelTippyContext.Provider value={{ panelTippyProps, showPanelTippy, hidePanelTippy }}>
      {children}
      {/* Your Tippy implementation here */}
    </PanelTippyContext.Provider>
  );
};


function calculateBestPlacement(position, offset = 10) {
  const { innerWidth, innerHeight } = window;

  // Adjust position by an offset to prevent direct overlap
  const adjustedPosition = {
    x: position.x + offset,
    y: position.y + offset,
  };

  const horizontalSpaceLeft = adjustedPosition.x;
  const horizontalSpaceRight = innerWidth - adjustedPosition.x;
  const verticalSpaceTop = adjustedPosition.y;
  const verticalSpaceBottom = innerHeight - adjustedPosition.y;

  // Determine where we have more space and place the element accordingly
  // The offsets can help ensure there's a gap between the parent and the panel
  if (horizontalSpaceLeft > horizontalSpaceRight) {
    return verticalSpaceTop > verticalSpaceBottom ? 'right' : 'left';
  } else {
    return verticalSpaceTop > verticalSpaceBottom ? 'right' : 'left';
  }
}

