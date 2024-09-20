import { getOrderedList } from "../hooks/utils/scenarioExecutionUtils";
import { prepareTransactionsForReview } from "../CustomNodes/TransactionReview/transactionUtils";
import { extrinsicHandler } from "../CustomNodes/TransactionReview/extrinsicHandler";
import { useAppStore } from "../hooks";

export const preProcessDraftTransactions = async (activeScenarioId, scenarios, isActionDataComplete) => {
    const actionNodes = scenarios[activeScenarioId]?.diagramData?.nodes?.filter(node => node.type === 'action');
    
    if (!actionNodes || actionNodes.length === 0) {
        throw new Error('No action nodes found.');
    }
    console.log(`ActionNodes are: `,actionNodes );
    console.log(`preProcessDraftTransactions: `, );
    if (actionNodes.some(node => !isActionDataComplete(node))) {
       // console.log(`problem node: `, node);
        console.log(`problem: `, actionNodes);
        throw new Error('Incomplete data in some action nodes. Please review and complete all fields.');
    }
  
    // Start the drafting process and return a promise that either resolves with the transactions
    // or rejects after a timeout.
    return new Promise(async (resolve, reject) => {
       const timeoutId = setTimeout(() => {
             reject(new Error('Drafting is taking longer than expected. Please refresh the page and try again.'));
         }, 10000); // 10 seconds timeout
  
        try {
            const result = await startDraftingProcess(activeScenarioId, scenarios);
            clearTimeout(timeoutId); // Clear the timeout if drafting succeeds in time
            resolve(result);
        } catch (error) {
            clearTimeout(timeoutId); // Clear the timeout if there's an error
            reject(error);
        }
    });
  };

  

export const startDraftingProcess = async (activeScenarioId, scenarios) => {
    console.log('[startDraftingProcess] Starting the drafting process...', activeScenarioId);
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
        const diagramData = scenarios[activeScenarioId].diagramData;
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[startDraftingProcess] Ordered List:', orderedList);
        console.log(`predata: `, diagramData);
        const preparedActions = prepareTransactionsForReview(diagramData, orderedList);
        console.log('[startDraftingProcess] Prepared Actions:', preparedActions);
        const draftedExtrinsicsWithData = []; // Note the name change for clarity
        for (const formData of preparedActions) {
            console.log('[startDraftingProcess] Drafting extrinsic for action:', formData);
            const draftedExtrinsic = await extrinsicHandler(formData.actionType, formData);
            // Here we're packaging the extrinsic with its corresponding form data
            draftedExtrinsicsWithData.push({ 
                formData: formData, 
                draftedExtrinsic: draftedExtrinsic 
            });
            console.log('[startDraftingProcess] Drafted extrinsic:', draftedExtrinsic);
        }
        console.log('[startDraftingProcess] Drafted extrinsics with data:', draftedExtrinsicsWithData);

        return draftedExtrinsicsWithData;
    }
};
