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
import toast from 'react-hot-toast'; 
import { signExtrinsicUtil } from '../../utils/signExtrinsicUtil';
import { ISubmittableResult } from '@polkadot/types/types';
import ThemeContext from '../../../../contexts/ThemeContext';
import getNonce from '../../../../Chains/api/getNonce';
import '../../../../index.css';


export default function TransactionMain() {
  const { theme } = useContext(ThemeContext);
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
  const [fetchedNonces, setFetchedNonces] = useState<{ [key: string]: number }>({});
  const [isFetchingNonces, setIsFetchingNonces] = useState<boolean>(false);
  




const signExtrinsic = async (draftedExtrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>, address: string, nonce?: number) => {
  const signer = walletContext.wallet?.signer;
  return await signExtrinsicUtil(signer, draftedExtrinsic, address, nonce);
};

  const startReview = () => {
    setIsReviewingTransactions(true);
    // display drafted extrinsics plus information about the extrinsics
  }

  const executeAndNavigate = async () => {
    navigate('/builder', { state: { executeScenario: true } });
  }

  const backToBuilder = () => {
    navigate('/builder');
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

const handleDeclineTransactions = () => {
  setIsReviewingTransactions(false);
  navigate('/builder');
};

const handleAcceptTransactions = async () => {
  setIsReviewingTransactions(false);

  const allSignedExtrinsics: any = [];
  let currentAddress: string | undefined;
  let currentNonce: number | undefined;

  for (const { draftedExtrinsic, formData } of transactions) {
      const { nodeId, source } = formData;

      // If it's a single transaction, sign without a nonce and continue
      if (transactions.length === 1) {
          const signedExtrinsic = await signExtrinsic(draftedExtrinsic, source.address);
          allSignedExtrinsics.push(signedExtrinsic);
          saveSignedExtrinsic(activeScenarioId, nodeId, signedExtrinsic);
          continue; // Move to the next iteration of the loop
      }

      // Check if the address is the same as the previous one
      if (currentAddress === source.address && currentNonce !== undefined) {
          currentNonce++; // Increment the nonce if it's the same address
      } else {
          currentNonce = fetchedNonces[source.address];
          currentAddress = source.address;
      }

      updateTransactionStatus({ draftedExtrinsic, formData }, 'waiting for extrinsic to be signed...');

      // Sign with the adjusted nonce
      const signedExtrinsic = await signExtrinsic(draftedExtrinsic, source.address, currentNonce);
      allSignedExtrinsics.push(signedExtrinsic);

      saveSignedExtrinsic(activeScenarioId, nodeId, signedExtrinsic);
  }


      // Save the signed extrinsics
      setSignedExtrinsics(allSignedExtrinsics);
      console.log("[handleAcceptTransactions] Signed extrinsics:", allSignedExtrinsics);
  
      // Once all are signed, proceed to the execution phase
      executeAndNavigate();
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




useEffect(() => {
  let addressesWithChains = {};

  for (const { formData } of transactions) {
      const { source, nodeId } = formData;
      if (typeof source === 'object' && 'address' in source && 'chain' in source) {
          if (!addressesWithChains[source.address]) {
              addressesWithChains[source.address] = [];
          }
          addressesWithChains[source.address].push({ nodeId, chain: source.chain });
      }
  }

  const fetchAllNonces = async () => {
      setIsFetchingNonces(true);
      console.log("[fetchAllNonces] fetching nonces");

      const nonces: { [key: string]: number } = {};

      for (const address in addressesWithChains) {
          // Assuming the nonce is the same across all chains for a given address
          const chain = addressesWithChains[address][0].chain;
          const nonce = await getNonce(chain, address);
          nonces[address] = nonce;
      }

      setFetchedNonces(nonces);
      console.log("[fetchAllNonces] Nonces:", nonces);
      setIsFetchingNonces(false);
  }

  fetchAllNonces();
}, [transactions]);





  return (
    <div>
      
      <button className={`button ${theme}`} onClick={backToBuilder}>Back</button>
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
