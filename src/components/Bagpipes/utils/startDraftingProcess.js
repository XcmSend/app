import { getOrderedList } from "./scenarioUtils";
import { prepareTransactionsForReview } from "../CustomNodes/TransactionReview/transactionUtils";
import { extrinsicHandler } from "../CustomNodes/TransactionReview/extrinsicHandler";
import { useAppStore } from "../hooks";

export const startDraftingProcess = async (activeScenarioId, scenarios) => {
    console.log('[startDraftingProcess] Starting the drafting process...', activeScenarioId);
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
        const diagramData = scenarios[activeScenarioId].diagramData;
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[startDraftingProcess] Ordered List:', orderedList);
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
