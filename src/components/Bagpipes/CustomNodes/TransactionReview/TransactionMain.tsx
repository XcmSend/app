import React, { useState, useEffect, useContext } from 'react';
import { TransactionReview } from './TransactionReviewViewer';
import { prepareTransactionsForReview } from './transactionUtils';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from "../../utils/scenarioUtils";
import { WalletContext } from '../../../Wallet/contexts';
import { extrinsicHandler } from './extrinsicHandler';
import { SubmittableExtrinsic } from '@polkadot/api/types';



export function TransactionMain() {
  const { scenarios, activeScenarioId } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
  }));
  const walletContext = useContext(WalletContext);

  const [isReviewingTransactions, setIsReviewingTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [signedExtrinsics, setSignedExtrinsics] = useState([]);

  useEffect(() => {
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
        const diagramData = scenarios[activeScenarioId].diagramData;
        const orderedList = getOrderedList(diagramData.edges);
        const preparedActions = prepareTransactionsForReview(diagramData, orderedList);

        // Transform the prepared actions into drafted extrinsics
        const fetchDraftedExtrinsics = async () => {
            const draftedExtrinsics = [];
            for (const action of preparedActions) {
                const draftExtrinsic = await extrinsicHandler(action.type, action.data);
                draftedExtrinsics.push(draftExtrinsic);
            }
            return draftedExtrinsics;
        }

        fetchDraftedExtrinsics().then((extrinsics) => {
            setTransactions(extrinsics);
        });
    }
}, [activeScenarioId, scenarios]);

  const signExtrinsic = async (draftExtrinsic: SubmittableExtrinsic<'promise'>, address: string) => {
    const signer = walletContext.wallet?.signer;

    if (signer && signer.signRaw) {
      const signPromise = signer.signRaw({
        address,
        data: draftExtrinsic.toHex(),
        type: 'bytes'
      });

      // Handle the promise result (similar to the example you provided)
      try {
        const signedExtrinsic = await signPromise;
        return signedExtrinsic;
      } catch (error) {
        console.error("Signing failed:", error);
        throw error;
      }
    }
  };

  const startReview = () => {
    setIsReviewingTransactions(true);
  }


  const handleAcceptTransactions = async () => {
    setIsReviewingTransactions(false);

    const allSignedExtrinsics = [];

    // Loop through the draft extrinsics and sign each
    for (const draftExtrinsic of transactions) { 
        const signedExtrinsic = await signExtrinsic(draftExtrinsic);
        allSignedExtrinsics.push(signedExtrinsic);
    }

    // Save the signed extrinsics
    setSignedExtrinsics(allSignedExtrinsics);

    //  Broadcasting will use the signedExtrinsics state
};


const broadcastExtrinsic = async (signedExtrinsic) => {
    // TODO: Implement broadcasting logic here
};


  const handleDeclineTransactions = () => {
    setIsReviewingTransactions(false);
    // Handle declined scenario...
  };

  return (
    <div>
      <button onClick={startReview}>Start Execution</button>
      {isReviewingTransactions && (
        <TransactionReview
          transactions={transactions}
          onAccept={handleAcceptTransactions}
          onDecline={handleDeclineTransactions}
        />
      )}
    </div>
  );
}
