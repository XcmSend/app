
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { ChainIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import EventNotification from '../../../EventNotifications/EventNotification';
import useAppStore from '../../../../store/useAppStore';
import { listChains } from '../../../../Chains/ChainsInfo';

import './LightClientNode.scss';
import '../../node.styles.scss';

import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

// import LightClientForm from '../../Forms/PopupForms/LightClientForm/LightClientForm';
import { WalletContext } from '../../../Wallet/contexts';
import ChainRpcService from '../../../../services/ChainRpcService';



export default function LightClientNode({ data }) {
  const { scenarios, activeScenarioId, executionId, updateExecutionSigningJob, updateNodeResponseData } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    executionId: state.executionId,
    updateExecutionSigningJob: state.updateExecutionSigningJob,
    updateNodeResponseData: state.updateNodeResponseData,

  }));
  const walletContext = useContext(WalletContext);


  const [isLightClientFormVisible, setLightClientFormVisible] = useState(false);
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

    // showTippy(null, nodeId, nodeRef.current, <LightClientForm onSave={handleSubmit} onClose={handleCloseLightClientForm} nodeId={nodeId} />, shouldFlipToLeft ? 'left-start' : 'right-start');
  };



  useEffect(() => {
    const fetchChains = async () => {
        const chains = listChains();
        setChainList(chains);
    };

    fetchChains();
  }, []);




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
    setLightClientFormVisible(false);
    // Handle form submission
  };


  const handleCloseLightClientForm = () => {
    setLightClientFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  const fillColor = "white";


return(
   
  <div ref={nodeRef} onClick={handleNodeClick} onScroll={handleScroll}>
          {hasNotification && <EventNotification nodeId={nodeId} nodeType={nodeType} eventUpdates={eventUpdates} />}

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">

    

      
      <ChainIcon className='h-7 w-7' fillColor='indigo' />

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle ">
        <span className="node-title text-gray-500">Light Client</span>
      </div>
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
    </div>

    </div>
  );
}


// export default function LightClientNode({ data }) {
//   const nodeRef = useRef();
//   const { logo, title, showArrow, instruction } = data;

//   return (
//   //   <Tippy
//   //   content={<AntdSelector />}
//   //   interactive={true}
//   //   trigger="click"
//   //   placement="auto"
//   //   reference={nodeRef}
//   //   theme="light"
//   // >
//     <div className="relative nodeBody bg-white border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
//       <ChainIcon className='h-7 w-7' fillColor='indigo' />

//       {/* Title outside the circle below the logo */}
//       <div className="node-title-circle ">
//         <span className="node-title text-gray-500">Light Client</span>
//       </div>
      
//       <Handle position={Position.Right} type="source" className=" z-10" />
//       <Handle position={Position.Left} type="target" className=" z-10" />
//     </div>
//     // </Tippy>
//   );
// }