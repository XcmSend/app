import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TransactionReview } from './TransactionReviewViewer';
import { prepareTransactionsForReview } from './transactionUtils';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from "../../utils/scenarioUtils";
import { WalletContext } from '../../../Wallet/contexts';
import { extrinsicHandler } from './extrinsicHandler';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { useNavigate } from 'react-router-dom';
import { signExtrinsicUtil } from '../../utils/signExtrinsicUtil';
import { ISubmittableResult } from '@polkadot/types/types';
import ThemeContext from '../../../../contexts/ThemeContext';
import getNonce from '../../../../Chains/api/getNonce';
import '../../../../index.css';


export default function TransactionMain() {
  const { theme } = useContext(ThemeContext);
  const { scenarios, activeScenarioId, transactions, setTransactions, saveSignedExtrinsic, setNodes, nodes, toggleExecuteChainScenario, setExecutionId, executionId } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    transactions: state.transactions,
    setTransactions: state.setTransactions,
    saveSignedExtrinsic: state.saveSignedExtrinsic,
    setNodes: state.setNodes,
    nodes: state.nodes,
    toggleExecuteChainScenario: state.toggleExecuteChainScenario,
    setExecutionId: state.setExecutionId,
    executionId: state.executionId
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
    console.log("[executeAndNavigate] executionId:", executionId);
    navigate('/builder', { state: { executeScenario: true, executionId: executionId } });
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
  let currentChain: string | undefined;

  for (const { draftedExtrinsic, formData } of transactions) {
      const { nodeId, source, chain } = formData;
  
      // If it's a single transaction, sign without a nonce and continue
      if (transactions.length === 1) {
          const signedExtrinsic = await signExtrinsic(draftedExtrinsic, source.address);
          allSignedExtrinsics.push(signedExtrinsic);
          saveSignedExtrinsic(activeScenarioId, nodeId, signedExtrinsic);
          continue;
      }
  
      // Check if the address and the chain is the same as the previous one
      if (currentAddress === source.address && currentChain === chain && currentNonce !== undefined) {
          currentNonce++; // Increment the nonce if it's the same address-chain combination
      } else {
          currentNonce = fetchedNonces[source.address + "_" + chain];
          currentAddress = source.address;
          currentChain = chain;
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

      const executionId = uuidv4();
      setExecutionId(executionId);

      // Signal that we should execute the scenario
      toggleExecuteChainScenario();

  
      // Once all are signed, proceed to the execution phase
      executeAndNavigate();
    };



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
        for (const chainInfo of addressesWithChains[address]) {
            const chain = chainInfo.chain;
            const nonce = await getNonce(chain, address);
            nonces[address + "_" + chain] = nonce;
        }
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
