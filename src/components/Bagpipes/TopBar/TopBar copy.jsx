import React, { useEffect, useState } from "react";
import { CreateUiButton, CreateButton, ExecuteButton, StartButton } from "../buttons";

import './TopBar.scss';  
import { useAppStore } from '../hooks';

const TopBar = ({ createScenario, handleExecuteFlowScenario, handleStartScenario, actionNodesPresent, node }) => {

    const { scenarios, activeScenarioId, clearSignedExtrinsic } = useAppStore(state => ({
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        clearSignedExtrinsic: state.clearSignedExtrinsic
    }));

    const initialExtrinsicsSigned = checkAllExtrinsicsSigned(scenarios, activeScenarioId);
    const [showExecuteButton, setShowExecuteButton] = useState(actionNodesPresent && initialExtrinsicsSigned);

    useEffect(() => {
        const extrinsicsSigned = checkAllExtrinsicsSigned(scenarios, activeScenarioId);
        setShowExecuteButton(actionNodesPresent && extrinsicsSigned);
    }, [scenarios, activeScenarioId, actionNodesPresent]); // Depend on scenarios and activeScenarioId

    const deleteSignedExtrinsic = () => {
        console.log(`[deleteSignedExtrinsic] Clearing signed extrinsics for scenario ${activeScenarioId} ${scenarios[activeScenarioId].selectedNodeId}`);
        clearSignedExtrinsic(activeScenarioId, scenarios[activeScenarioId].selectedNodeId );
    }
    return (
        <div className='top-bar'>
            <CreateUiButton />
            <CreateButton createScenario={createScenario} />
            {showExecuteButton ? (
                <ExecuteButton 
                    executeFlowScenario={handleExecuteFlowScenario} 
                    stopExecution={handleStartScenario}
                    actionNodesPresent={actionNodesPresent}
                />
            ) : (
                <StartButton startScenario={handleStartScenario} />
            )}
            <StartButton startScenario={deleteSignedExtrinsic} />

        </div>
    );
};


export default TopBar;


const checkAllExtrinsicsSigned = (scenarios, scenId) => {
    console.log(`[checkAllExtrinsicsSigned] Checking scenario: ${scenId}`);
    const scenario = scenarios[scenId];
    if (!scenario) {
        console.error(`[checkAllExtrinsicsSigned] Scenario with ID ${scenId} not found.`);
        return false;
    }

    console.log(`[checkAllExtrinsicsSigned] about to check each node:`, scenId);
    for (const node of scenario.diagramData.nodes) {
        if (node.type === "action") {
            console.log(`[checkAllExtrinsicsSigned] inside a node:`, node);
            // Ensure 'signedExtrinsic' is not only present but also not null or an empty string
            const signedExtrinsicExists = node?.signedExtrinsic !== undefined && node.formData?.signedExtrinsic !== null && node.formData?.signedExtrinsic !== '';

            console.log(`[Node ID: ${node.id}, Type: ${node.type}] Signed Extrinsic Exists: ${signedExtrinsicExists}`, node.formData);

            if (!signedExtrinsicExists) {
                console.log(`[Node ID: ${node.id}] requires signing but no valid signedExtrinsic found.`);
                return false; // At least one action node does not have a valid signedExtrinsic, return false
            }
        }
    }

    console.log(`[checkAllExtrinsicsSigned] All action extrinsics signed for scenario ${scenId}: true`);
    return true; // All action nodes have a valid signedExtrinsic
};



