import { useEffect, useState } from 'react';
import { getFilteredChainsForNode } from '../getFilteredChainsForNode';

export const useFilterChains = (nodeId, scenarios, activeScenarioId) => {
  const [chains, setChains] = useState([]);

  useEffect(() => {
    async function fetchAndFilterChains() {
      const fetchedChains = await getFilteredChainsForNode(nodeId, scenarios, activeScenarioId);
      setChains(fetchedChains);
    }

    fetchAndFilterChains();
  }, [nodeId, scenarios, activeScenarioId]);

  return chains;
};
