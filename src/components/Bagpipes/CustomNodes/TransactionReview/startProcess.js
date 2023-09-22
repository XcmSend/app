import { getOrderedList } from "../../utils/scenarioUtils";
import { prepareTransactionsForReview } from "../../utils/transactionUtils";
import { extrinsicHandler } from "./extrinsicHandler";

export const startDraftingProcess = async () => {
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
        const diagramData = scenarios[activeScenarioId].diagramData;
        const orderedList = getOrderedList(diagramData.edges);
        const preparedActions = prepareTransactionsForReview(diagramData, orderedList);

        const draftedExtrinsics = [];
        for (const action of preparedActions) {
            const draftExtrinsic = await extrinsicHandler(action.type, action.data);
            draftedExtrinsics.push(draftExtrinsic);
        }

        setTransactions(draftedExtrinsics);
    }
};
