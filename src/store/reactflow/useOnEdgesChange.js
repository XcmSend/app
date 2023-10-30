import { useCallback } from 'react';
import onEdgesChange from './onEdgesChange';

const useOnEdgesChange = (set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId, takeSnapshot) => {
  return useCallback(
    onEdgesChange(set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId, takeSnapshot),
    [set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId, takeSnapshot]
  );
};

export default useOnEdgesChange;
