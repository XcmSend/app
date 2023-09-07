// @ts-nocheck
import { useEffect, useCallback} from 'react';
import debounce from 'lodash/debounce';
import useAppStore from '../../../store/useAppStore'

function useSaveDiagramState(nodes, edges) {
  const { activeScenarioId, saveScenario } = useAppStore((state) => ({
    activeScenarioId: state.activeScenarioId,
    saveScenario: state.saveScenario,
  }));
  // console.log('useSaveDiagramState active scenario ID', activeScenarioId);

  // Moving the log here to avoid repeated calls
  // console.log('Inside useSaveDiagramState, activeScenarioId:', activeScenarioId); 

  const saveState = useCallback(debounce(() => { // Using useCallback
    if (!activeScenarioId) {
      console.warn('No active scenario ID, skipping save.');
      return;
    }
    // console.log('Preparing to save diagram data (in useSaveDiagram):', nodes, edges);
    const diagramData = {
      nodes: nodes,
      edges: edges,
    };
    // console.log('Current Zustand state:', useAppStore.getState());
    saveScenario(activeScenarioId, diagramData);
  }, 1000), [nodes, edges, activeScenarioId, saveScenario]); 

  useEffect(() => {
    saveState();

    // cleanup on unmount
    return () => {
      saveState.cancel();
    };
  }, [saveState]); // Only depending on saveState
}


export default useSaveDiagramState;