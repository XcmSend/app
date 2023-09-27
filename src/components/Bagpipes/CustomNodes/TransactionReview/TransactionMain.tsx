import React, { useState, useEffect, useContext } from 'react';
import { TransactionReview } from './TransactionReviewViewer';
import { prepareTransactionsForReview } from './transactionUtils';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from "../../utils/scenarioUtils";
import { WalletContext } from '../../../Wallet/contexts';
import { extrinsicHandler } from './extrinsicHandler';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { useExecuteChainScenario } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 
import { signExtrinsicUtil } from '../../utils/signExtrinsicUtil';
import { ISubmittableResult } from '@polkadot/types/types';


export default function TransactionMain() {
  const { scenarios, activeScenarioId, transactions, setTransactions, saveSignedExtrinsic, setNodes, nodes } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    transactions: state.transactions,
    setTransactions: state.setTransactions,
    saveSignedExtrinsic: state.saveSignedExtrinsic,
    setNodes: state.setNodes,
    nodes: state.nodes
  }));
  const navigate = useNavigate(); 

  const [isLoading, setIsLoading] = useState(true);
  const walletContext = useContext(WalletContext);

  const [isReviewingTransactions, setIsReviewingTransactions] = useState(true);
  const [signedExtrinsics, setSignedExtrinsics] = useState([]);
  const currentScenarioNodes = scenarios[activeScenarioId]?.diagramData?.nodes || [];



    useEffect(() => {
    if (activeScenarioId && scenarios[activeScenarioId]?.diagramData) {
      const diagramData = scenarios[activeScenarioId].diagramData;
      const orderedList = getOrderedList(diagramData.edges);
      const preparedActions = prepareTransactionsForReview(diagramData, orderedList);

      // Transform the prepared actions into drafted extrinsics with data
      const fetchDraftedExtrinsicsWithData = async () => {
        const draftedExtrinsicsWithData: { formData: any; draftedExtrinsic: any; status: string; }[] = [];
        for (const formData of preparedActions) {
          const draftedExtrinsic = await extrinsicHandler(formData.actionType, formData);
          const transactionData = {
            formData: formData,
            draftedExtrinsic: draftedExtrinsic,
            status: 'drafted'

          };
          console.log("[fetchDraftedExtrinsicsWithData] transactionData:", transactionData);
          draftedExtrinsicsWithData.push(transactionData);
        }
        return draftedExtrinsicsWithData;
      }

      fetchDraftedExtrinsicsWithData().then((extrinsicsWithData) => {
        setTransactions(extrinsicsWithData);
      });
    }
  }, [activeScenarioId, scenarios]);


const signExtrinsic = async (draftedExtrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>, address: string) => {
  const signer = walletContext.wallet?.signer;
  return await signExtrinsicUtil(signer, draftedExtrinsic, address);
};

  const startReview = () => {
    setIsReviewingTransactions(true);
    // display drafted extrinsics plus information about the extrinsics
  }


  const handleAcceptTransactions = async () => {
    setIsReviewingTransactions(false);

    const allSignedExtrinsics: any = [];

    // Loop through the draft extrinsics and sign each
    for (const txData of transactions) { 
      updateTransactionStatus(txData, 'waiting for extrinsic to be signed...');

      console.log("[handleAcceptTransactions] draftedExtrinsic:", txData)
        const signedExtrinsic = await signExtrinsic(txData.draftedExtrinsic, txData.formData.source.address);
        allSignedExtrinsics.push(signedExtrinsic);

        console.log("[handleAcceptTransactions] saving signed extrinsic activeScenarioId:", activeScenarioId);

        // Update node data with the signed extrinsic using nodeId from txData.formData
        saveSignedExtrinsic(activeScenarioId, txData.formData.nodeId, signedExtrinsic);

    }

    // Save the signed extrinsics
    setSignedExtrinsics(allSignedExtrinsics);
    console.log("[handleAcceptTransactions] Signed extrinsics:", allSignedExtrinsics);

    // Once all are signed, proceed to the execution phase
    executeAndNavigate();
  };

  const executeAndNavigate = async () => {
    navigate('/builder', { state: { executeScenario: true } });
  }
  



  const updateTransactionStatus = (transaction: any, status: string) => {
    const updatedTransactions = transactions.map((tx: { status: string; }) => {
        if (tx === transaction) {
            tx.status = status;
        }
        return tx;
    });
    setTransactions(updatedTransactions);
};

// useEffect(() => {
//   if (signedExtrinsics.length === transactions.length) {
//       console.log("[handleAccept] Broadcasting extrinsics:", signedExtrinsics);

//       toast.success('Broadcasting extrinsics...');  
//       navigate('/builder')
//       // Call the executeChainScenario function
//       toast.success('Extrinsics broadcasted successfully!');
//     }
// }, [signedExtrinsics]);

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
