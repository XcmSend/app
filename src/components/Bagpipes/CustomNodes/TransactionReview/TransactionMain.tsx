//ts-nocheck
import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TransactionReview } from './TransactionReviewViewer';
import { prepareTransactionsForReview } from './transactionUtils';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from "../../hooks/utils/scenarioExecutionUtils";
import { WalletContext } from '../../../Wallet/contexts';
import { extrinsicHandler } from './extrinsicHandler';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { useNavigate } from 'react-router-dom';
import { signExtrinsicUtil } from '../../utils/signExtrinsicUtil';
import { ISubmittableResult } from '@polkadot/types/types';
import ThemeContext from '../../../../contexts/ThemeContext';
import getNonce from '../../../../Chains/api/getNonce';
import '../../../../index.css';
import { getApiInstance } from '../../../../Chains/api/connect';


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
  // const signedCount = signedExtrinsics.length;

  const [signedCount, setSignedCount] = useState(0);






const signExtrinsic = async (draftedExtrinsic: SubmittableExtrinsic<"promise", ISubmittableResult>, address: string, currentChain: string, nonce?: number) => {
  const signer = walletContext.wallet?.signer;
  console.log("[signExtrinsic] chain:", currentChain);
  const api = await getApiInstance(currentChain);

  return await signExtrinsicUtil(api, signer, draftedExtrinsic, address, nonce);
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
      const { nodeId, source, target } = formData;
      const chain = source.chain;
      console.log("[handleAcceptTransactions] signExtrinsic formData:", formData);
  
      // If it's a single transaction, sign without a nonce and continue
      if (transactions.length === 1) {
          console.log('signExtrinsic chain in handleAcceptTransactions:', chain);
          const signedExtrinsic = await signExtrinsic(draftedExtrinsic, source.address, chain);
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
      const signedExtrinsic = await signExtrinsic(draftedExtrinsic, source.address, currentChain, currentNonce);
      allSignedExtrinsics.push(signedExtrinsic);
      console.log('All signed extrinsics:', allSignedExtrinsics);

      // Increment the signed count
      setSignedCount(prevCount => prevCount + 1);
  
      saveSignedExtrinsic(activeScenarioId, nodeId, signedExtrinsic);
  }
  


      // Save the signed extrinsics
      setSignedExtrinsics(allSignedExtrinsics);
      console.log("[handleAcceptTransactions] Signed extrinsics:", allSignedExtrinsics);
      console.log('signedExtrinsics in state:', signedExtrinsics);

      const executionId = uuidv4();
      setExecutionId(executionId);

      // Signal that we should execute the scenario
      toggleExecuteChainScenario();

  
      // Once all are signed, proceed to the execution phase
      executeAndNavigate();
    };

    useEffect(() => {
      console.log('signedExtrinsics in state:', signedExtrinsics);
  }, [signedExtrinsics]);


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


  const wrapperSignExtrinsic = (transaction: any, address: string, nonce?: number) => {
    const currentChain = transaction.formData.source.chain;
    return signExtrinsic(transaction, address, currentChain, nonce);
}


  return (
    <>
      <div>
        
        <button className={`button ${theme}`} onClick={backToBuilder}>Back</button>
  
        {isReviewingTransactions ? (
          <TransactionReview
            transactions={transactions}
            onAccept={handleAcceptTransactions}
            onDecline={handleDeclineTransactions}
            signExtrinsic={wrapperSignExtrinsic}
            setSignedExtrinsics={setSignedExtrinsics}
          />
        ) : (
          <div className="transaction-signature-status">
            {signedCount < transactions.length 
             ? `${signedCount}/${transactions.length} transactions signed. Once you have signed all transactions you will be sent back to the builder. Then you can broadcast them when you are ready.`
             : `All transactions are signed! You can now broadcast them.`}
          </div>
        )}
  
      </div>
    </>
  );
  
  
  
  
  
  
  
}
