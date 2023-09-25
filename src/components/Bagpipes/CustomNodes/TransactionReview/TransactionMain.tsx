import React, { useState, useEffect, useContext } from 'react';
import { TransactionReview } from './TransactionReviewViewer';
import { prepareTransactionsForReview } from './transactionUtils';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from "../../utils/scenarioUtils";
import { WalletContext } from '../../../Wallet/contexts';
import { extrinsicHandler } from './extrinsicHandler';
import { SubmittableExtrinsic } from '@polkadot/api/types';



export default function TransactionMain() {
  const { scenarios, activeScenarioId, transactions, setTransactions } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    transactions: state.transactions,
    setTransactions: state.setTransactions,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const walletContext = useContext(WalletContext);

  const [isReviewingTransactions, setIsReviewingTransactions] = useState(false);
  const [signedExtrinsics, setSignedExtrinsics] = useState([]);



  useEffect(() => {
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
        const diagramData = scenarios[activeScenarioId].diagramData;
        const orderedList = getOrderedList(diagramData.edges);
        const preparedActions = prepareTransactionsForReview(diagramData, orderedList);

        // Transform the prepared actions into drafted extrinsics with data
        const fetchDraftedExtrinsicsWithData = async () => {
            const draftedExtrinsicsWithData = [];
            for (const formData of preparedActions) {
                const draftExtrinsic = await extrinsicHandler(formData.actionType, formData);
                const transactionData = {
                    formData: formData,
                    draftedExtrinsic: draftExtrinsic
                };
                draftedExtrinsicsWithData.push(transactionData);
            }
            return draftedExtrinsicsWithData;
        }

        fetchDraftedExtrinsicsWithData().then((extrinsicsWithData) => {
            setTransactions(extrinsicsWithData);
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
    // display drafted extrinsics plus information about the extrinsics
  }


  const handleAcceptTransactions = async () => {
    setIsReviewingTransactions(false);

    const allSignedExtrinsics: any = [];

    // Loop through the draft extrinsics and sign each
    for (const draftExtrinsic of transactions) { 
        const signedExtrinsic = await signExtrinsic(draftExtrinsic);
        allSignedExtrinsics.push(signedExtrinsic);
    }

    // Save the signed extrinsics
    setSignedExtrinsics(allSignedExtrinsics);

    //  Broadcasting will use the signedExtrinsics state
};


const broadcastExtrinsic = async (signedExtrinsic: any) => {
    // TODO: Implement broadcasting logic here
};


  const handleDeclineTransactions = () => {
    setIsReviewingTransactions(false);
    // Handle declined scenario...
  };

  return (
    <div>
      
      <button className='button' onClick={startReview}>Start Review</button>
      {isReviewingTransactions && (
       <TransactionReview
       transactions={transactions}
       onAccept={handleAcceptTransactions}
       onDecline={handleDeclineTransactions}
       signExtrinsic={signExtrinsic}
       setSignedExtrinsics={setSignedExtrinsics}
     />
     
      )}
    </div>
  );
}
