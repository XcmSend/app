import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const TippyContext = createContext();

export const useTippy = () => useContext(TippyContext);

export const TippyProvider = ({ children }) => {
  const [tippyProps, setTippyProps] = useState({
    visible: false,
    position: { x: 100, y: 300 },
    size: { width: 300, height: 150 },
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
  const tippyPanelInstance = useRef(null);
  const pollingIntervalRef = useRef(null);

  const showPanelTippy = (nodeId, referenceElement, content, placement = 'top-start') => {
    const rect = referenceElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    const calculatedPosition = {
      x: shouldFlipToLeft ? rect.left : rect.right,
      y: rect.top
    };

    setPanelTippyProps({ 
      visible: true, 
      position: calculatedPosition,
      content, 
      placement: shouldFlipToLeft ? 'left-start' : placement,
    });

    // Start polling to check for content changes
    startPolling();
  };

  const hidePanelTippy = () => {
    setPanelTippyProps({ visible: false, position: { x: 0, y: 0 }, content: null, placement: 'right' });
    
    // Stop polling
    stopPolling();
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) {
        console.log('Polling: Updating Tippy instance');
        tippyPanelInstance.current.popperInstance.update();
      }
    }, 1000); // Poll every 3 seconds
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Clean up interval on component unmount
      stopPolling();
    };
  }, []);

  useEffect(() => {
    console.log('PanelTippyProvider useEffect for visibility/content change');

    if (tippyPanelInstance.current && tippyPanelInstance.current.popperInstance) {
      console.log('Updating Tippy instance');
      tippyPanelInstance.current.popperInstance.update();
    }
  }, [panelTippyProps.content, panelTippyProps.visible]);

  return (
    <PanelTippyContext.Provider value={{ panelTippyProps, showPanelTippy, hidePanelTippy, tippyPanelInstance }}>
      {children}
      {panelTippyProps.visible && (
        <Tippy
          appendTo={() => document.body}
          content={panelTippyProps.content}
          interactive={true}
          placement={panelTippyProps.placement}
          visible={panelTippyProps.visible}
          theme="light"
          trigger="click"
          hideOnClick={false}
          onClickOutside={() => hidePanelTippy()}
          flip={true}
          boundary="viewport"
          maxWidth="100%"
          onCreate={(instance) => {
            tippyPanelInstance.current = instance;
          }}
        >
          <div
            style={{
              position: 'fixed',
              left: panelTippyProps.position.x,
              top: panelTippyProps.position.y,
              maxHeight: '80vh', // Set max height for the tippy
              overflowY: 'auto', // Enable vertical scrolling
            }}
          ></div>
        </Tippy>
      )}
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



const calculatePosition = (referenceElement, placement) => {
  if (!(referenceElement instanceof Element)) {
    console.error('referenceElement is not a DOM element:', referenceElement);
    return { calculatedPosition: { x: 0, y: 0 }, placement };
  }

  const rect = referenceElement.getBoundingClientRect(); // Define rect here
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const tooltipWidth = 300; // Adjust based on your tooltip size or make it dynamic
  const tooltipHeight = 200; // Estimate or calculate dynamically if possible
  const spaceOnRight = viewportWidth - rect.right;
  const spaceBelow = viewportHeight - rect.bottom;
  const shouldFlipToLeft = spaceOnRight < tooltipWidth && placement.startsWith('right');
  const shouldFlipToTop = spaceBelow < tooltipHeight && placement.startsWith('bottom');

  let calculatedPosition;
  switch (placement) {
    case 'right-start':
    case 'right':
      calculatedPosition = shouldFlipToLeft ? { x: rect.left - tooltipWidth, y: rect.top } : { x: rect.right, y: rect.top };
      break;
    case 'bottom-start':
    case 'bottom':
      calculatedPosition = shouldFlipToTop ? { x: rect.left, y: rect.top - tooltipHeight } : { x: rect.left, y: rect.bottom };
      break;
    // Implement other placements as needed
    default:
      calculatedPosition = { x: rect.left, y: rect.top + window.scrollY }; // Fallback or default position
  }

  return {
    calculatedPosition,
    placement: shouldFlipToLeft && placement.startsWith('right') ? 'left-start' : shouldFlipToTop && placement.startsWith('bottom') ? 'top-start' : placement
  };
};

