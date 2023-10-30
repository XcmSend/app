import { applyNodeChanges } from 'reactflow';

const onNodesChange = (set, get, takeSnapshot, activeScenarioId) => (changes) => {
    takeSnapshot();
    set((state) => {
      const currentScenario = state.scenarios[activeScenarioId];
      if (!currentScenario) return state; // Handle error if needed
  
      const updatedNodes = applyNodeChanges(changes, currentScenario.diagramData.nodes);
  
      // Return the updated state with the new nodes
      return {
        scenarios: {
          ...state.scenarios,
          [activeScenarioId]: {
            ...currentScenario,
            diagramData: {
              ...currentScenario.diagramData,
              nodes: updatedNodes,
            },
          },
        },
      };
    });
  };
  
  export default onNodesChange;