import React from 'react';
import { usePanelTippy } from '../TippyContext'; 
import PanelForm from '../../../components/Bagpipes/Forms/PopupForms/Panel/PanelForm';


const useTooltipClick = (nodeId, handleContentChange) => {
  const { showPanelTippy, hidePanelTippy, tippyPanelInstance } = usePanelTippy();
console.log("useTooltipClick nodeId:", nodeId);
  const handleInputClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300;
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    showPanelTippy(nodeId, event.currentTarget, <PanelForm nodeId={nodeId} onClose={() => hidePanelTippy(tippyPanelInstance)} notifyChange={handleContentChange} />, shouldFlipToLeft ? 'left-start' : 'right-start');
    event.stopPropagation();
  };

  return { handleInputClick };
};

export default useTooltipClick;
