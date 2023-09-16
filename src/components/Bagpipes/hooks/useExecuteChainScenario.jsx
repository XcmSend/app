// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import { processScenarioData, validateDiagramData, getOrderedList } from '../utils/scenarioUtils';
import SocketContext from '../../../contexts/SocketContext';
import useAppStore from '../../../store/useAppStore';
import { toast } from 'react-hot-toast';


const useExecuteChainScenario = (nodes, setNodes) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setActiveExecutionId, setExecutionId, updateNodeContent, setLoading, loading} = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      executionId: state.executionId,
      setActiveExecutionId: state.setActiveExecutionId,
      setExecutionId: state.setExecutionId,
      updateNodeContent: state.updateNodeContent,
      setLoading: state.setLoading,
      loading: state.loading,
    }));
    const [nodeContentMap, setNodeContentMap] = useState({}); 
    const [nodeContentHistory, setNodeContentHistory] = useState({});
    const [lastReceived, setLastReceived] = useState({});
    
    const prevExecutionIdRef = useRef(null);  

    // useEffect(() => {
    //   if (socket == null) return; // Make sure the socket object is available


    //   // socket stuff that was for interacting with our server

    //     });

    //     return () => {
    //       socket.off('message');
    //       socket.off('nodeOutput');
    //       socket.off('processingCompleted');
    //       socket.off('updateClient');
    //       socket.off('status');

    //     };
    //   }, [executionId, socket]);
      
    async function stopExecution() {

      // we need to modify this code for our chain flow so that it gracefully stops at the end of the current step, because of course once you execute an extrinsic you cannot undo it. 
      try {

        console.log('Stopping execution...');
          const response = await ScenarioService.stopExecution(executionId);
          console.log('Stopped execution:', response);
          setLoading(false);  // Reset to false when an error occurs

      } catch (error) {
          console.error('Error stopping the execution:', error);
          setLoading(false);  // Reset to false when an error occurs

      }
  }

  async function executeChainScenario() {
    console.log('[executeChainScenario] Starting Workflow Execution...');
    setLoading(true);

    // Clear the nodeContentMap before starting a new execution
    setNodeContentMap({});

    try {
        const rawDiagramData = store.getState();
        console.log('[executeChainScenario] rawDiagramData:', rawDiagramData);

        // Simplify the diagramData
        let diagramData = {
            nodes: rawDiagramData.getNodes().map(node => ({ 
                id: node.id, 
                type: node.type, 
                data: node.data, 
                formState: getSavedFormState(node.id) || {},  // Get the form state for each node
            })),
            edges: rawDiagramData.edges.map(edge => ({ ...edge })),
        };
        
        console.log('[executeChainScenario] Retrieved diagramData from state:', diagramData);
        
        // Get the ordered list of nodes
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[executeChainScenario] Ordered List of Nodes:', orderedList);


        if (!orderedList) {
            toast.error('Error during ordering of nodes. Check the scenario.');
            return;
        }

        // Validate the diagramData
        diagramData = validateDiagramData(diagramData);
        
        // Process the diagram data
        diagramData = processScenarioData(diagramData);
        console.log('[executeChainScenario] Processed diagramData:', diagramData);
        
        console.log("[executeChainScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });
        
        const response = await ScenarioService.runChainScenarioOnce({ 
            diagramData: diagramData,
            scenario: activeScenarioId,
        });

        // TODO: Use uuid v4 to create executionId
        setExecutionId(response.executionId);
        
        if (response.executionId) {
            const currentDateTime = new Date().toISOString();
            const executionData = {
                timestamp: currentDateTime,
                nodeContentMap: { ...nodeContentMap },
            };
            console.log('Saving execution data...');
            saveExecution(response.executionId, executionData);
        } else {
            console.error('No executionId received from the server. Cannot save execution.');
            toast.error('Execution ID not received. Unable to save execution.');
        }

    } catch (error) {
        console.error('An error occurred while executing the workflow:', error);
        toast.error(`Workflow execution error: ${error.message}`);
    } finally {
        console.log('Workflow Execution Prepared and Sent to Server...');
        setNodes([...nodes]);
    }
};
    return { nodeContentMap, executeChainScenario, stopExecution };
};

export default useExecuteChainScenario;
