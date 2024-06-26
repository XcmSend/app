import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { HttpIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import EventNotification from '../../../EventNotifications/EventNotification';
import useAppStore from '../../../../store/useAppStore';
import './HttpNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import HttpForm from '../../Forms/PopupForms/Http/HttpForm';


export default function HttpNode({ data }) {
  const { scenarios, activeScenarioId, executionId } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    executionId: state.executionId,

  }));

  const [isHttpFormVisible, setHttpFormVisible] = useState(false);
  const { showTippy } = useTippy();
  const nodeId = useNodeId();
  const nodeRef = useRef();

  const nodeExecutionData = scenarios[activeScenarioId]?.executions[executionId]?.[nodeId];
  const eventUpdates = nodeExecutionData?.responseData?.eventUpdates || [];
  const hasNotification = eventUpdates.length > 0;
  const isLoadingNode = useAppStore((state) => state.nodeLoadingStates[nodeId] || false);

  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Determine if there's enough space to the right; if not, use the left position.
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    const calculatedPosition = {
      x: shouldFlipToLeft ? rect.left : rect.right,
      y: rect.top
    }; 
    showTippy(null, nodeId, nodeRef.current, <HttpForm onSave={handleSubmit} onClose={handleCloseHttpForm} nodeId={nodeId} reference={nodeRef.current} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setHttpFormVisible(false);
    // Handle form submission
  };


  const handleCloseHttpForm = () => {
    setHttpFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const fillColor = "white";


return(
   
  <div ref={nodeRef} onClick={handleNodeClick} onScroll={handleScroll}>
          {hasNotification && <EventNotification nodeId={nodeId} eventUpdates={eventUpdates} />}

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">

      {isLoadingNode ? (
          <div className="spinner-container">
              {/* Simple CSS spinner */}
              <div className="node-spinner" style={{ borderColor: '#f3f3f3', borderTopColor: fillColor }}></div>
          </div>
      ) : (
          <HttpIcon className="h-7" fillColor={fillColor} />
      )}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="http-name font-medium text-xl flex-col text-gray-500">HTTP Request
      {/* <div className=" font-medium text-xs absolute top-8 right-16 text-gray-500">Get proposal</div> */}
      </div>
      </div>


      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>
  );
}
