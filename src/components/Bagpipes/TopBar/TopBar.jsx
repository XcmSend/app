import React, { useEffect } from "react";
import { CreateUiButton, ClearButton,  CreateButton, ExecuteButton, StartButton, StopButton, GenerateLinkButton } from "../buttons";
import './TopBar.scss';  
import { useAppStore } from '../hooks';

const TopBar = ({ createScenario, handleExecuteFlowScenario, handleStartScenario, handleStopScenario, actionNodesPresent }) => {

    const { isExecuting, scenarios, activeScenarioId, clearSignedExtrinsic, markExtrinsicAsUsed } = useAppStore(state => ({
        isExecuting: state.isExecuting,
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        clearSignedExtrinsic: state.clearSignedExtrinsic,
        markExtrinsicAsUsed: state.markExtrinsicAsUsed,
    }));
    const extrinsicsSigned = checkAllExtrinsicsSigned(scenarios, activeScenarioId);

    const showExecuteButton = actionNodesPresent && extrinsicsSigned;
    
    const selectedNodeId = scenarios[activeScenarioId]?.selectedNodeId;

    const handleClearExtrinsic = () => {
        console.log("[handleClearExtrinsic] Clearing extrinsic for scenario and nodeId:", activeScenarioId, selectedNodeId);
        clearSignedExtrinsic(activeScenarioId, selectedNodeId); 
        markExtrinsicAsUsed(activeScenarioId, selectedNodeId);
    
    }

    return (
      <div className='top-bar'>
          <GenerateLinkButton scenarioId={activeScenarioId} />
          <CreateUiButton />
          <CreateButton createScenario={createScenario} />

              {showExecuteButton ? (
                <>
                  <ExecuteButton 
                      executeFlowScenario={handleExecuteFlowScenario} 
                      stopExecution={handleStopScenario}
                      actionNodesPresent={actionNodesPresent}
                  />
                  <ClearButton clearExtrinsic={handleClearExtrinsic} />
              </>
          ) : isExecuting && !showExecuteButton ? (
              <StopButton stopScenario={handleStopScenario} />
          ) : (
            !showExecuteButton && <StartButton startScenario={handleStartScenario} />
        )}



      </div>
  );
};


export default TopBar;


const checkAllExtrinsicsSigned = (scenarios, scenId) => {
    const scenario = scenarios[scenId];
    if (!scenario) {
      console.error(`[checkAllExtrinsicsSigned] Scenario with ID ${scenId} not found.`);
      return false;
    }
  
    for (const node of scenario.diagramData.nodes) {
      if (node.type === "action") {
        // Check both existence and usage status of signedExtrinsic
        const isExtrinsicSignedAndUnused = node?.extrinsics?.signedExtrinsic !== undefined && 
                                            node?.extrinsics?.signedExtrinsic !== null && 
                                            !node?.extrinsics?.isUsed; // Ensure it's not used
  
        if (!isExtrinsicSignedAndUnused) {
          return false; // An action node lacks a valid, unused signedExtrinsic
        }
      }
    }
  
    return true; // All action nodes have valid, unused signedExtrinsics
  };
  



