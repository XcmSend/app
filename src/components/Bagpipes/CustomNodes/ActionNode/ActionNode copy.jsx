
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import useAppStore from '../../../../store/useAppStore';
import { getHydraDxSellPrice } from '../../../../Chains/Helpers/PriceHelper';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import RemarkSVG from '/remark.svg';
// $DED animation
import DEDPNG from './../../../../assets/DED.png';
//import FloatingImage from './FloatingImage';

import { getOrderedList } from '../../hooks/utils/scenarioExecutionUtils';
import { convertFormStateToActionType } from './actionUtils';
import PriceInfo from '../PriceInfo';
import Selector, { useOutsideAlerter } from './Selector';
import ActionNodeForm from '../../Forms/PopupForms/Action/ActionNodeForm';
import toast from 'react-hot-toast';
import ThemeContext from '../../../../contexts/ThemeContext';
import { ActionIcon } from '../../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import '../../../../index.css';
import '../../node.styles.scss';
import '../../../../main.scss';

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export default function ActionNode({ children, data, isConnectable }) {
  const { theme } = React.useContext(ThemeContext);
  const nodeId = useNodeId();
  const { scenarios, activeScenarioId, loading, saveNodeFormData, saveActionDataForNode, saveTriggerNodeToast } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    saveNodeFormData: state.saveNodeFormData,
    saveActionDataForNode: state.saveActionDataForNode,
    saveTriggerNodeToast: state.saveTriggerNodeToast,
  }));
  const selectedNodeId = scenarios[activeScenarioId]?.selectedNodeId;
  const [assetInNodeId, setAssetInNodeId] = useState(null);
  const [assetOutNodeId, setAssetOutNodeId] = useState(null);
  const [sellPriceInfoMap, setPriceInfoMap] = useState({});
  const dropdownRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isFetchingActionData, setIsFetchingActionData] = useState(false);
  const initialAction = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.action || null;
  const [formState, setFormState] = useState({ action: initialAction });
  const nodes = scenarios[activeScenarioId]?.diagramData?.nodes;
  const edges = scenarios[activeScenarioId]?.diagramData?.edges;
  const [lastUpdated, setLastUpdated] = useState(null);
  const [actionData, setActionData] = useState({});
  const currentNode = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId);
  const currentActionData = currentNode?.formData?.actionData;
  console.log('ActionNode currentActionData:', currentActionData);
  const nodeRef = useRef(null);

  const assetInFormData = useMemo(() => {
    const nodeData = nodes.find(node => node.id === assetInNodeId);
    // console.log('ActionNode assetInFormData inside useMemo:', nodeData?.formData);
    return nodeData?.formData;
  }, [assetInNodeId, nodes]);
  
  const assetOutFormData = useMemo(() => {
    const nodeData = nodes.find(node => node.id === assetOutNodeId);
    // console.log('ActionNode assetOutFormData inside useMemo:', nodeData?.formData);
    return nodeData?.formData;
  }, [assetOutNodeId, nodes]);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


  const getActionImage = () => {
    if (formState.action === 'swap') return SwapSVG;
    if (formState.action === 'xTransfer') return xTransferSVG;
    if (formState.action === 'remark') return xTransferSVG;
    return null;
  };


  const fetchActionInfo = async (currentNodeId) => {
    if (isFetchingActionData) return;  
    setIsFetchingActionData(true);

    try {
        // Deduce the assetInNodeId and assetOutNodeId based on the currentNodeId.
        const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
        const currentIndex = orderedList.indexOf(currentNodeId);
        const assetInNodeId = orderedList[currentIndex - 1];
        const assetOutNodeId = orderedList[currentIndex + 1];

        // Now that you have the asset node IDs, derive the assetInFormData and assetOutFormData
        const assetInFormData = nodes.find(node => node.id === assetInNodeId)?.formData;
        console.log('ActionNode fetchActionInfo assetInFormData:', assetInFormData);
        const assetOutFormData = nodes.find(node => node.id === assetOutNodeId)?.formData;
        console.log(`assetOutFormData:`, assetOutFormData);
        const assetInId = assetInFormData?.asset?.assetId;
        const assetOutId = assetOutFormData?.asset?.assetId;
        const amount = assetInFormData?.amount;

        
        if(formState.action === 'swap' && assetInFormData.chain === 'hydraDx' && assetOutFormData.chain === 'hydraDx') {
          console.log('fetchActionInfo Fetching for swap');
            const fetchedPriceInfo = await getHydraDxSellPrice(assetInId, assetOutId, amount);
            console.log('fetchActionInfo fetchedPriceInfo:', fetchedPriceInfo);
            setPriceInfoMap(prevMap => ({
                ...prevMap,
                [nodeId]: fetchedPriceInfo
            }));
            setLastUpdated(new Date());
        }

        if(formState.action === 'xTransfer') {
            setIsFetchingActionData(true); // Start the loading state
            await sleep(1000);
            // Handle fetching for xTransfer if needed
            console.log('fetchActionInfo Fetching for xTransfer');
            setLastUpdated(new Date());
        }

        // Set actionData outside of the action-specific blocks
        // Create action data based on the selected value
        const newActionData = convertFormStateToActionType(
          { ...formState, action: formState.action }, 
          assetInFormData, 
          assetOutFormData
      );
  
      if (newActionData) {
        console.log("[fetchActionInfo] Constructed action data : ", newActionData);
        setActionData(newActionData); // Directly set the current action data
        saveActionDataForNode(activeScenarioId, currentNodeId, newActionData); // And also save it to global state
        console.log("fetchActionInfo Constructed action data: ", newActionData);
        setIsFetchingActionData(false);

      }

    } catch (error) {
        // Handle error
        toast.error(error.toString());
        console.error("An error occurred while fetching action info...", error);
        setPriceInfoMap({})    
      } finally {
        setIsFetchingActionData(false);

    }
};

    useEffect(() => {
      if (!selectedNodeId || !selectedNodeId.startsWith('action_')) return;
      // console.log('[ActionNode] active node:', selectedNodeId);

      const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
      // console.log('ActionNode scenario edges:', scenarios[activeScenarioId]?.diagramData?.edges);
      // console.log('ActionNode Ordered List:', orderedList);

      const currentIndex = orderedList.indexOf(selectedNodeId);
      // console.log('ActionNode Current Index:', currentIndex);

      if (currentIndex === -1) return;

      const assetInNodeId = orderedList[currentIndex - 1];

      const assetOutNodeId = orderedList[currentIndex + 1];
      // console.log('[ActionNode] assetInNodeId:', assetInNodeId);
      // console.log('[ActionNode] assetOutNodeId:', assetOutNodeId);

        
        setAssetInNodeId(assetInNodeId);
        setAssetOutNodeId(assetOutNodeId);
    }, [selectedNodeId, scenarios]);

  
    // This effect will only run once when the component mounts
    useEffect(() => {
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      if (currentNodeFormData) {
        setFormState(currentNodeFormData);
      }
    }, []);
  
    
    
    useEffect(() => {
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      if (currentNodeFormData && JSON.stringify(currentNodeFormData) !== JSON.stringify(formState)) {
        setFormState(currentNodeFormData);
      }
    }, [nodeId, activeScenarioId]);
    
    
    useEffect(() => {
      if (!activeScenarioId || !nodeId) {
        console.warn("Missing activeScenarioId or nodeId. Not proceeding with save.");
        return;
      }
    
      const formData = { ...formState, actionData: currentActionData };
      saveNodeFormData(activeScenarioId, nodeId, formData);
    }, [formState, currentActionData, nodeId, activeScenarioId]); 
    
    useEffect(() => {
      if (currentActionData?.action === 'swap' && !isFetchingActionData) {
        console.log('fetchActionInfo Fetching for swap', currentActionData.action);
        fetchActionInfo(nodeId);
      }
    }, [assetInFormData, assetOutFormData, currentActionData]); 
    
  // Here we want to create the action form data object to pass for processing 
  useEffect(() => {
    const newActionData = convertFormStateToActionType(formState, assetInFormData, assetOutFormData); 
    if (newActionData) {
      setActionData({ [nodeId]: newActionData });
      console.log("Constructed action data: ", newActionData);
    }
  }, [formState, assetInFormData, assetOutFormData]);

const handleDropdownClick = (value) => {
  console.log("[handleDropdownClick] Selected value clicked:", value);
  setDropdownVisible(false);
  setFormState(prev => ({
    ...prev,
    action: value
  }));

  
  // Create action data based on the selected value
  const newActionData = convertFormStateToActionType(
      { ...formState, action: value }, 
      assetInFormData, 
      assetOutFormData
  );

  if (newActionData) {
    setActionData({ [nodeId]: newActionData });
    console.log("[handleDropdownClick] Constructed action data : ", newActionData);
  }
};
const handleOutsideClick = useCallback(() => {
  // setDropdownVisible(false);
}, []);


// useOutsideAlerter(dropdownRef, handleOutsideClick);


// This function will handle the visibility toggle
const toggleDropdown = () => {
  setDropdownVisible(prev => {
    console.log('Toggling dropdown:', !prev); // This should log the new state
    return !prev;
  });
};


  return (
    <>
    {/* <Tippy
    content={<ActionNodeForm />}
    interactive={true}
    trigger="click"
    placement="auto"
    reference={nodeRef}
    theme="light"
  > */}
      
    <div ref={nodeRef} className={`${theme} action-node rounded-lg shadow-lg text-xs flex flex-col justify-start primary-font`}>
      <div className='flex m-1 justify-between'>
        <ActionIcon className='h-3 w-4' fillColor='rgb(156 163 175' />
        {/* <div className=" text-xxs text-gray-400 "> {data.name}</div> */}
        <div className=" text-xxs text-gray-400">{nodeId}</div>

      </div>

      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} className='' />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} className=''  />
      <div  className='p-3 in-node-border rounded flex justify-center flex-col items-center mb-3'>
        

      
      

      {/* Custom dropdown */}
      <div className="relative">
        <div className="action-type flex justify-between items-center in-node-border rounded cursor-pointer text-xs ml-2 mr-2 font-semibold bg-white" onClick={toggleDropdown}>
          {formState.action ? (
            <img src={getActionImage()} alt={formState.action} className="w-12 h-12 p-1 mx-auto" />
          ) : (
            <div className="text-gray-500 mx-auto text-xs font-semibold">Select Action</div>
          )}

          <div className="pl-2 dropdown">⌄</div>
        </div>
        
        {/* Absolute positioning for the dropdown */}
        <div className={`absolute z-10 ${dropdownVisible ? '' : 'hidden'}`} style={{ width: 'max-content', top: '100%' }}>
        <Selector
          handleDropdownClick={handleDropdownClick}
          SwapSVG={SwapSVG}
          xTransferSVG={xTransferSVG}
          Remark={RemarkSVG}
          dropdownVisible={dropdownVisible}
          ref={dropdownRef}
          handleOnClick={true}
        />

        </div>
      </div>

      {formState && formState.action === 'swap' && (
        isFetchingActionData ? (
          <div className="small-spinner"></div>
        ) : (
          sellPriceInfoMap[nodeId] ? (
            <PriceInfo sourceInfo={assetInFormData} targetInfo={assetOutFormData} priceInfo={sellPriceInfoMap[nodeId]} />
          ) : (
            // Placeholder for when no price info is available
            <div className="in-node-border rounded m-2 p-2 ">Swaps</div>
          )
        )
      )}
      </div>



      {formState.action === 'xTransfer' && currentActionData?.source?.chain && currentActionData?.source?.amount && currentActionData?.source?.symbol && (
      <div className='p-2 in-node-border rounded mb-2 '>
        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">From:</div>
          <div className="w-2/3 font-semibold text-left ">{currentActionData.source.chain}</div>
        </div>

          { currentActionData.source.chain == 'rococo' && (
           
           <div 
           style={{
            position: 'fixed',
            top: '90%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999, 
            animation: 'oscillate 2s linear infinite',
          }}
           >

             <img alt="DED logo" title="DED logo" src="https://xcmsend.github.io/img/DED.png" /> 
         </div>
          )}

        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">To:</div>
          <div className="w-2/3 font-semibold text-left">{currentActionData.target.chain}</div>
        </div>

        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">Amount:</div>
          <div className="w-2/3 font-semibold text-left">{currentActionData.source.amount} {currentActionData.source.symbol}</div>
        </div>
      </div>
    )}

    <button 
      onClick={() => fetchActionInfo(nodeId)} 
      className="fetch-action  hover:bg-blue-700 flex justify-center align-center hover:bg- font-bold py-1 px-1 mb-1 in-node-border-gray-300 hover:in-node-border-green rounded" 
    >
       { isFetchingActionData ? (
          <div className="small-spinner"></div>
        ) : (
          <img className="h-4 w-4" src="/refresh-white.svg" alt="refresh icon" />
        )}

    </button>

        {/* {sellPriceInfoMap ? (
        lastUpdated && <span className='text-gray-400 text-xxs flex justify-center'>Last updated: {formatTime(lastUpdated)}</span>
        ):( null)
        } */}

      
      { formState.action === 'xTransfer' ? (
         lastUpdated && <span className='text-gray-400 text-xxs flex justify-center'>
          Last updated: {formatTime(lastUpdated)}
        </span>
      ):( null)
    } 

      <div className="space-y-2 mt-1">
        {data.children}
      </div>
    </div>
    {/* </Tippy> */}
    </>
  );
}

