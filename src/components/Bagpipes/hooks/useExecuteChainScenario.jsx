// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import { processScenarioData, validateDiagramData, getOrderedList } from '../utils/scenarioUtils';
import SocketContext from '../../../contexts/SocketContext';
import useAppStore from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
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
    toast.success('Starting Workflow Execution...');
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

        const executionId = uuidv4();
        setExecutionId(executionId);
       
        
        // Get the ordered list of nodes
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[executeChainScenario] Ordered List of Nodes:', orderedList);


        if (!orderedList) {
            toast.error('Error during ordering of nodes. Check the scenario.');
            return;
        }

        // Validate the diagramData
        diagramData = validateDiagramData(diagramData);
                
        console.log("[executeChainScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });
        toast.success('Running Scenario...');

        let nodeContents = {};
        let executionCycleFinished = false;

        // Iterate over the nodes based on the order from orderedList
        for(let nodeId of orderedList) {
            let currentNode = diagramData.nodes.find(node => node.id === nodeId);
            if (!currentNode) {
                toast.error('The execution has ended due to an unknown node.');
                return;
            }


            switch(currentNode.type) {
              case 'openAi':
                  // Handle the openAi node execution
                  break;

              case 'chain':
                toast.success('Executing Chain Node...');
                  // Handle the chain node execution
          
                  break;

              case 'action':
                toast.success('Executing Action Node...');

                  // Handle the action node execution
                  break;
          }
      }

      if (executionCycleFinished) {
          // Handle the end of the execution
      }

              // Here we have the logic from handleSaveScenario (from runChainScenarioOnce)




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
