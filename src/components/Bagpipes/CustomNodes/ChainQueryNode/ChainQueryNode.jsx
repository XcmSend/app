import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { ChainQueryIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import EventNotification from '../../../EventNotifications/EventNotification';
import useAppStore from '../../../../store/useAppStore';
import { listChains } from '../../../../Chains/ChainsInfo';

import './ChainQuery.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import ChainQueryForm from '../../Forms/PopupForms/ChainForms/ChainQueryForm/ChainQueryForm';


export default function ChainQueryNode({ data }) {
  const { scenarios, activeScenarioId, executionId } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    executionId: state.executionId,

  }));

  const [isChainQueryFormVisible, setChainQueryFormVisible] = useState(false);
  const { showTippy } = useTippy();
  const nodeId = useNodeId();
  const nodeRef = useRef();

  const [chainList, setChainList] = useState({});
  const ChainInfoList = Object.values(chainList);
  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  const selectedChain = formData?.selectedChain;

  const selectedChainLogo = ChainInfoList.find(chain => chain.name === selectedChain)?.logo;


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
    showTippy(null, nodeId, nodeRef.current, <ChainQueryForm onSave={handleSubmit} onClose={handleCloseChainQueryForm} nodeId={nodeId} reference={nodeRef.current} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };

  useEffect(() => {
    const fetchChains = async () => {
        const chains = listChains();
        setChainList(chains);
    };

    fetchChains();
  }, []);



  const handleSubmit = (event) => {
    // event.preventDefault();
    setChainQueryFormVisible(false);
    // Handle form submission
  };


  const handleCloseChainQueryForm = () => {
    setChainQueryFormVisible(false);
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
          <>
        { selectedChain ? (
          <img src={selectedChainLogo} className="chain-logo" alt="Chain Logo" />
        ) : (
          <ChainQueryIcon className="h-7" fillColor={fillColor} />
        )}
        
         </>
      )}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="chainQuery-name font-medium text-xl flex-col text-gray-500">Query Chain
      {/* <div className=" font-medium text-xs absolute top-8 right-16 text-gray-500">Get proposal</div> */}
      </div>
      </div>


      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>
  );
}
