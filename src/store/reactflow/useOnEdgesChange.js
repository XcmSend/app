import { useCallback } from 'react';
import onEdgesChange from './onEdgesChange';

const useOnEdgesChange = (set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId) => {
  return useCallback(
    onEdgesChange(set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId),
    [set, get, setInputVariablesByEdgeId, inputVariablesByEdgeId, updateEdgesInScenario, scenarioId]
  );
};

export default useOnEdgesChange;
