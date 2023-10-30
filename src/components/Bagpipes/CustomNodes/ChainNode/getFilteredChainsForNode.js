import { getOrderedList } from "../../hooks/utils/scenarioExecutionUtils";
import { useAppStore } from "../../hooks";
import { buildHrmp } from "../../../../Chains/Helpers/XcmHelper";

export async function getFilteredChainsForNode(nodeId, hrmpChannels, scenarios, activeScenarioId) {
    const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
    const currentIndex = orderedList.indexOf(nodeId);
    const previousNodeId = orderedList[currentIndex - 1];
    const previousNode = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === previousNodeId);
    const sourceChain = previousNode?.formData?.actionData?.source?.chain;
 
    let currentChannels = hrmpChannels[sourceChain];
    
    if (!currentChannels || currentChannels.length === 0) {
        const fetchedChannels = await buildHrmp();
        currentChannels = fetchedChannels;
    }
 
    const availableChains = ChainsInfo.filter(chain => currentChannels.includes(chain.paraid));
    return availableChains;
}
