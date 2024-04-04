import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { WebhookNodeIcon }  from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import EventNotification from '../../../EventNotifications/EventNotification';
import useAppStore from '../../../../store/useAppStore';
import DecisionPrompt from './DecisionPrompt';
import './WebhookNode.scss';
import '../../node.styles.scss';

// import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';
import WebhookForm from '../../Forms/PopupForms/Webhook/WebhookForm';

export default function WebhookNode({ }) {
  const { scenarios, activeScenarioId, executionId, setWebhookDecisionPending, setWebhookUserDecision, webhookDecision} = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    executionId: state.executionId,
    setWebhookDecisionPending: state.setWebhookDecisionPending,
    setWebhookUserDecision: state.setWebhookUserDecision,
    webhookDecision: state.webhookDecision,

  }));
  
  const nodeId = useNodeId();
  const nodeRef = useRef();
  const [isWebhookFormVisible, setWebhookFormVisible] = useState(false);
  const webhookNodeRef = useRef();
  const { showTippy } = useTippy();

  const { webhookEventStatus } = useAppStore(state => state.scenarios[activeScenarioId]?.executions[executionId]?.[nodeId]?.webhookEventStatus || {});
  const isLoadingNode = useAppStore((state) => state.nodeLoadingStates[nodeId] || false);


  // const shouldShowDecisionPrompt = webhookDecision.isPending && webhookDecision.nodeId === nodeId;

  const nodeExecutionData = scenarios[activeScenarioId]?.executions[executionId]?.[nodeId];
  const eventUpdates = nodeExecutionData?.responseData?.eventUpdates || [];
  const hasNotification = eventUpdates.length > 0;


  useEffect(() => {
    // Trigger the decision prompt based on the webhook event status
    if (webhookEventStatus?.hasPreviousEvents && webhookEventStatus.userDecision === null) {
      showDecisionPrompt();
    }
    // This useEffect no longer directly depends on the global state but on the destructured and memoized value
  }, [webhookEventStatus, nodeId, showTippy]);
  
  useEffect(() => {
    // Handle the decision
    if (webhookEventStatus?.userDecision) {
      if (webhookEventStatus.userDecision === 'processNow') {
        // Logic to immediately process the existing event
      } else if (webhookEventStatus.userDecision === 'waitForNew') {
        // Logic to wait for a new event
      }
      // Optionally, reset the decision status after handling it
      useAppStore.getState().updateNodeWebhookEventStatus(activeScenarioId, executionId, nodeId, { hasPreviousEvents: webhookEventStatus.hasPreviousEvents, userDecision: null });
    }
  }, [webhookEventStatus?.userDecision, nodeId]);



  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Determine if there's enough space to the right; if not, use the left position.
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;


  
    showTippy(null, nodeId, nodeRef.current, <WebhookForm onSave={handleSubmit} onClose={handleCloseWebhookForm} nodeId={nodeId} reference={nodeRef.current} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };



  const showDecisionPrompt = () => {
    if (!nodeRef.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300;
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    // Assuming `showTippy` is a function you've defined to show Tippy programmatically
    showTippy(
      null, 
      nodeId, 
      nodeRef.current, 
      <DecisionPrompt nodeId={nodeId} onClose={() => setWebhookDecisionPending(false, null)} />, 
      shouldFlipToLeft ? 'left-start' : 'right-start'
    );
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setWebhookFormVisible(false);
    // Handle form submission
  };

  const handleCloseWebhookForm = () => {
    setWebhookFormVisible(false);
  };

  const fillColor = "purple";

  return (

    <div ref={nodeRef} onClick={handleNodeClick}>
          {/* {showDecisionPrompt && <DecisionPrompt nodeId={nodeId} onClose={() => console.log('Prompt closed')} />} */}

      {hasNotification && <EventNotification nodeId={nodeId} eventUpdates={eventUpdates} />}

      <div className="relative nodeBody bg-white border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
 
      {isLoadingNode ? (
          <div className="spinner-container">
              {/* Simple CSS spinner */}
              <div className="node-spinner" style={{ borderColor: '#f3f3f3', borderTopColor: fillColor }}></div>
          </div>
      ) : (
          <WebhookNodeIcon className="h-8" fillColor={fillColor} />
      )}
      
      {/* Logo in the middle of the circle */}
      {/* <img src={`/chains/${logo}`} alt={`${title} Logo`} className="text-slate-800 h-8 w-8" /> */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Webhook</span>
      </div>

      
      <Handle position={Position.Right} type="source" className="z-10" />
      {/* <Handle position={Position.Left} type="target" className="hidden z-10" /> */}
      </div>
    </div>
    


  );
}


