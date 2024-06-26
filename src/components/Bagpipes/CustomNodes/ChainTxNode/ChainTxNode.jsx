import React, { useState, useRef, useEffect, useContext } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { ChainQueryIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import EventNotification from '../../../EventNotifications/EventNotification';
import useAppStore from '../../../../store/useAppStore';
import { listChains } from '../../../../Chains/ChainsInfo';

import './ChainTx.scss';
import '../../node.styles.scss';

import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import ChainTxForm from '../../Forms/PopupForms/ChainForms/ChainTxForm/ChainTxForm';
import TransactionSignForm from '../../Forms/PopupForms/ChainForms/ChainTxForm/TransactionSignForm';
import { WalletContext } from '../../../Wallet/contexts';
import ChainRpcService from '../../../../services/ChainRpcService';


export default function ChainTxNode({ data }) {
  const { scenarios, activeScenarioId, executionId, updateExecutionSigningJob, updateNodeResponseData } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    executionId: state.executionId,
    updateExecutionSigningJob: state.updateExecutionSigningJob,
    updateNodeResponseData: state.updateNodeResponseData,

  }));
  const walletContext = useContext(WalletContext);


  const [isChainTxFormVisible, setChainTxFormVisible] = useState(false);
  const { showTippy, hideTippy } = useTippy();
  const nodeId = useNodeId();
  const nodeRef = useRef();

  const [signedResponse, setSignedResponse] = useState(null);


  const [chainList, setChainList] = useState({});
  const ChainInfoList = Object.values(chainList);
  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  const selectedChain = formData?.selectedChain;

  const selectedChainLogo = ChainInfoList.find(chain => chain.name === selectedChain)?.logo;

  const nodeExecutionData = scenarios[activeScenarioId]?.executions[executionId]?.[nodeId];
  const eventUpdates = nodeExecutionData?.responseData?.eventUpdates || [];
  const hasNotification = eventUpdates.length > 0;
  const nodeType = nodeExecutionData?.nodeType;

  const signingJob = nodeExecutionData?.signingJob;
  const isSigningNedded = signingJob?.transactionDetails?.needsSigning;
  const isLoadingNode = useAppStore((state) => state.nodeLoadingStates[nodeId] || false);

  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Determine if there's enough space to the right; if not, use the left position.
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    // const calculatedPosition = {
    //   x: shouldFlipToLeft ? rect.left : rect.right,
    //   y: rect.top
    // }; 

    showTippy(null, nodeId, nodeRef.current, <ChainTxForm onSave={handleSubmit} onClose={handleCloseChainTxForm} nodeId={nodeId} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };

  const renderSigningNotification = () => {

    const rect = nodeRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Determine if there's enough space to the right; if not, use the left position.
    const spaceOnRight = viewportWidth - rect.right;
    const tooltipWidth = 300; // Approximate or dynamically determine your tooltip's width.
    const shouldFlipToLeft = spaceOnRight < tooltipWidth;

    const calculatedPosition = {
      x: shouldFlipToLeft ? rect.left : rect.right,
      y: rect.top
    }; 

    showTippy(null, nodeId, nodeRef.current, <TransactionSignForm 
      nodeId={nodeId}
      nodeRef={nodeRef.current}
      transactionDetails={signingJob.transactionDetails} 
      signedResponse={signedResponse}
      onConfirm={handleSignAndExecute} 
      onCancel={handleCancelSign} />, 
      shouldFlipToLeft ? 'left-start' : 'right-start');
  };

  useEffect(() => {
    console.log(`ChainTxNode: `, signingJob);

    const isNeedsSigningTrue = signingJob?.transactionDetails?.needsSigning;
    if (isNeedsSigningTrue) {
      renderSigningNotification();
    }
  }, [signingJob]);


  useEffect(() => {
    console.log(`ChainTxNode: `, signingJob);

    const isNeedsSigningTrue = signingJob?.transactionDetails?.needsSigning;
    if (isNeedsSigningTrue) {
      renderSigningNotification();
    } else if (isNeedsSigningTrue === false) {
      hideTippy();
    }
  }, [signingJob?.transactionDetails?.needsSigning]);



  useEffect(() => {
    const fetchChains = async () => {
        const chains = listChains();
        setChainList(chains);
    };

    fetchChains();
  }, []);

  useEffect(() => {
    if (isSigningNedded) {
      renderSigningNotification();
    }
  }, [isSigningNedded]);




  const handleSignAndExecute = async () => {
    try {
      const { extrinsic } = signingJob;
      const signer  = walletContext?.wallet?.signer;
      const { selectedAddress } = formData;
      const { parsedFormData } = signingJob.transactionDetails;

      const signedExtrinsic = await ChainRpcService.executeChainTxMethod({
        chainKey: parsedFormData.selectedChain,
        palletName: parsedFormData.selectedPallet,
        methodName: parsedFormData.selectedMethod.name,
        params: Object.values(parsedFormData.params || {}),
        extrinsic,
        signerAddress: selectedAddress,
        signer,
      });

      
      // updateNodeResponseData(activeScenarioId, executionId, nodeId, {
      //   signedExtrinsic: signedExtrinsic,
      //   status: 'success'
      // });

      // Update the signing job to indicate it's complete
      updateExecutionSigningJob(activeScenarioId, executionId, nodeId, {
        ...signingJob,
        signedExtrinsic: signedExtrinsic,
        status: 'signed',
        transactionDetails: {
          ...signingJob.transactionDetails,
          needsSigning: false,
        }
      });
    } catch (error) {
      console.error('Error signing Chain Tx:', error);
      updateNodeResponseData(activeScenarioId, executionId, nodeId, {
        error: error.message,
        status: 'error'
      });
    }
  };





  const handleCancelSign = () => {
    console.log('Cancelling signing process...');
    // Handle cancellation of signing process
    updateExecutionSigningJob(activeScenarioId, executionId, nodeId, {
      ...signingJob,
      transactionDetails: {
        ...signingJob.transactionDetails,
        needsSigning: false,
      }
    });
    hideTippy();
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setChainTxFormVisible(false);
    // Handle form submission
  };


  const handleCloseChainTxForm = () => {
    setChainTxFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const fillColor = "white";


return(
   
  <div ref={nodeRef} onClick={handleNodeClick} onScroll={handleScroll}>
          {hasNotification && <EventNotification nodeId={nodeId} nodeType={nodeType} eventUpdates={eventUpdates} />}

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">

      {isLoadingNode ? (
          <div className="spinner-container">
              {/* Simple CSS spinner */}
              <div className="node-spinner" style={{ borderColor: '#f3f3f3', borderTopColor: fillColor }}></div>
          </div>
      ) : (
        <>
        { selectedChain ? (
          <img src={selectedChainLogo} className="chain-logo" alt="Chain Logo" />
        ) : (
          <ChainQueryIcon className="h-7" fillColor={fillColor} />
        )}
        
         </>
      )}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="chainTx-name font-medium text-xl flex-col text-gray-500">Chain Tx
      {/* <div className=" font-medium text-xs absolute top-8 right-16 text-gray-500">Get proposal</div> */}
      </div>
      </div>


      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>
  );
}
