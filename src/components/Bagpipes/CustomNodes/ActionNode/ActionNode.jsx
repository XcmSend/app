
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import useAppStore from '../../../../store/useAppStore';
import { getHydraDxSellPrice } from '../../../../Chains/Helpers/PriceHelper';
import { query_contract } from '../../../../Chains/DraftTx/DraftInk';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import RemarkSVG from '/remark.svg';
import VoteSVG from '/vote.svg';
import DelegateSVG from '/delegate.svg';
import InkSVG from '/ink.svg';
import StakeSVG from '/stake.svg';

// $DED animation
import DEDPNG from './../../../../assets/DED.png';
//import FloatingImage from './FloatingImage';

import { getOrderedList } from '../../hooks/utils/scenarioExecutionUtils';
import { convertFormStateToActionType } from './actionUtils';
import PriceInfo from '../PriceInfo';
import InkInfo from '../InkInfo';
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
  console.log('000 ActionNode currentActionData:', currentActionData);
  const nodeRef = useRef(null);

  const assetInFormData = useMemo(() => {
    const nodeData = nodes.find(node => node.id === assetInNodeId);
   console.log('ActionNode assetInFormData inside useMemo:', nodeData?.formData);
    return nodeData?.formData;
  }, [assetInNodeId, nodes]);
  
  const assetOutFormData = useMemo(() => {
    const nodeData = nodes.find(node => node.id === assetOutNodeId);
     console.log('ActionNode assetOutFormData inside useMemo:', nodeData?.formData);
    return nodeData?.formData;
  }, [assetOutNodeId, nodes]);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


  const getActionImage = () => {
    if (formState.action === 'swap') return SwapSVG;
    if (formState.action === 'xTransfer') return xTransferSVG;
    if (formState.action === "remark") return RemarkSVG;
    if (formState.action === "Remark") return RemarkSVG;
    if (formState.action === "stake") return StakeSVG;
    if (formState.action === "delegate") return DelegateSVG;
    if (formState.action === "ink") return InkSVG;
    
    if (formState.action === "vote") return VoteSVG;

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
       
        if(formState.action === 'ink') {
          setIsFetchingActionData(true); // Start the loading state
          await sleep(1000);
          const fetchedPriceInfo = {
            "type": "Sell",
            "amountIn": "1",
            "amountOut": "0.005668",
            "spotPrice": "0.005699451151",
            "tradeFee": "0.000015",
            "tradeFeePct": 0.3,
            "priceImpactPct": -0.29,
            "swaps": [
                {
                    "poolAddress": "7JRrXBpB1K2JUapwojTYLZPoMvLPMQUDyiEyJb5hj7wad1of",
                    "pool": "Xyk",
                    "assetIn": "0",
                    "assetOut": "10",
                    "amountIn": "1",
                    "calculatedOut": "0.005683",
                    "amountOut": "0.005668",
                    "spotPrice": "0.005699451151",
                    "tradeFeePct": 0.3,
                    "priceImpactPct": -0.29,
                    "errors": []
                }
            ]
        };
          setPriceInfoMap(prevMap => ({
            ...prevMap,
            [nodeId]: fetchedPriceInfo
        }));
          console.log('fetchActionInfo Fetching for ink');
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
        console.log(`newActionData`);
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
        console.log(`currentNodeFormData set`);
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
      console.log(`newactiondata called`);
      const newActionData = convertFormStateToActionType(formState, assetInFormData, assetOutFormData); 
      if (newActionData) {
        setActionData({ [nodeId]: newActionData });
        console.log("Constructed action data: ", newActionData);
      }
    }, [formState, assetInFormData, assetOutFormData]);

function get_previous_node() {
  const nodes = scenarios[activeScenarioId]?.diagramData?.nodes || [];
  const currentNodeIndex = nodes.findIndex(node => node.id === nodeId);
  const previousNode = currentNodeIndex > 0 ? nodes[currentNodeIndex - 1] : null;
  const previousNodeFormData = previousNode ? previousNode.formData : null;
  return previousNodeFormData;
}

  
// store the system remark message
  const setRemark = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    console.log(`currentNodeFormData: `, currentNodeFormData);
    console.log(`setting remark value `);
    const nodes = scenarios[activeScenarioId]?.diagramData?.nodes || [];
    const currentNodeIndex = nodes.findIndex(node => node.id === nodeId);
    const previousNode = currentNodeIndex > 0 ? nodes[currentNodeIndex - 1] : null;
    const previousNodeFormData = previousNode ? previousNode.formData : null;
    var currentActionData = currentNodeFormData.actionData || {};
    currentActionData.actionType = 'remark';


    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      extra: value.target.value,
    };
    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);
  


  };

  const setDelegateConviction = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    var inputen = value.target.value;

    const newone = currentNodeFormData.actionData; 
    if (!newone.source.delegate){
      newone.source.delegate = {};
    }
    newone.source.delegate.conviction = inputen;

  if (newone) {
    setActionData({ [nodeId]: newone });
  }

  };

  const setStake = (value) => {
    console.log(`set stake called`);
    console.log(`SET STAKE`, scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId));
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    const nodes = scenarios[activeScenarioId]?.diagramData?.nodes || [];
const currentNodeIndex = nodes.findIndex(node => node.id === nodeId);
const previousNode = currentNodeIndex > 0 ? nodes[currentNodeIndex - 1] : null;
const previousNodeFormData = previousNode ? previousNode.formData : null;

console.log('previousNodeFormData: ', previousNodeFormData);

    console.log(`currentNodeFormData: `, currentNodeFormData);

    var currentActionData = currentNodeFormData.actionData || {};
    currentActionData.actionType = 'stake';


    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      stake: {
        pool_id: value.target.value
      }
    };
  
    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);
  

  };

  const setToDel = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    console.log(`currentNodeFormData: `, currentNodeFormData);
    const currentActionData = currentNodeFormData.actionData || {};
    const currentSource = currentActionData.delegate || {};
    currentActionData.actionType = 'delegate';
    const updatedActionData = {
      ...currentActionData,
      source: get_previous_node(),
      delegate: {
        ...currentSource,
        to_address: value.target.value
      }
    };
    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);
  };


  const handleFileUpload = (event) => {
    console.log(`handle fileupload`);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = JSON.parse(e.target.result);
      // Do something with fileContent
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      var currentActionData = currentNodeFormData.actionData || {};
      var currentSource = currentActionData.inkdata || {};
      currentActionData.actionType = 'ink';

      currentSource.abi = fileContent;
      const previousNodeFormData = get_previous_node(); 
  
  
      const updatedActionData = {
        ...currentActionData,
        source: previousNodeFormData,
        inkdata: {
          ...currentSource,
          abi: fileContent
        }
      };
      console.log(`abi saved`);
      console.log(`abi is: `, fileContent);
  setActionData(updatedActionData);

      saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);


     // console.log(fileContent);
    };
    reader.readAsText(file);
    console.log(`handle fileupload ok`);
  };

  const setInkAddress = (value) => {
    console.log(`set ink address start`);
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    var currentActionData = currentNodeFormData.actionData || {};
    const currentSource = currentActionData.inkdata || {};
    currentActionData.actionType = 'ink';

    var currentInkData = currentSource.inkdata || {};
    currentInkData.contract = value.target.value;
    const previousNodeFormData = get_previous_node(); 


    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      inkdata: {
        ...currentSource,
        contract: value.target.value
      }
    };

    console.log(`set 2 ink`);
    setActionData(updatedActionData);
    console.log(`set 3 ink`);
    console.log(`updatedActionData: `, updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);
    console.log(`set ink address done`);

  };

  const setAye = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    var aye_or_nay = false;
    if (value === 'aye'){
      aye_or_nay = true;
    }

    var currentActionData = currentNodeFormData.actionData || {};
    const currentSource = currentActionData.votedata || {};
    currentActionData.actionType = 'vote';

    var currentVoteData = currentSource.votedata || {};
    currentVoteData.aye_or_nay = aye_or_nay;

    currentVoteData.refnr = value; // value.target.value; // append the message as source.target value
    const previousNodeFormData = get_previous_node();
    
    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      votedata: {
        ...currentSource,
        aye_or_nay: aye_or_nay
      }
    };


    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);

  };

  const setDelLock = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    const currentActionData = currentNodeFormData.actionData || {};

    const currentDelData = currentActionData.delegate || {};
    currentActionData.actionType = 'delegate';
    const updatedActionData = {
      ...currentActionData,
      source: get_previous_node(),
      delegate: {
        ...currentDelData,
        conviction: value,
      }
    };

  // Update the local state
  setActionData(updatedActionData);
  saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);



  };


  const setLock = (value) => {
  
 
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    console.log(`currentNodeFormData: `, currentNodeFormData);
    console.log(`setLock called `);
  
    if (!currentNodeFormData) return;
  
    const currentActionData = currentNodeFormData.actionData || {};

    const currentVoteData = currentActionData.votedata || {};
    currentActionData.actionType = 'vote';
    const previousNodeFormData = get_previous_node(); 
    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      votedata: {
        ...currentVoteData,
        lock: value,
      }
    };

  
    // Update the local state
    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);

  };


  const setRef = (value) => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;

  
    var currentActionData = currentNodeFormData.actionData || {};

    var currentVoteData = currentActionData.votedata || {};
    currentActionData.actionType = 'vote';

    currentVoteData.refnr = value; // value.target.value; // append the message as source.target value

    const previousNodeFormData = get_previous_node(); 
    const updatedActionData = {
      ...currentActionData,
      source: previousNodeFormData,
      votedata: {
        ...currentVoteData,
        lock: value,
      }
    };

    // Update the local state
    setActionData(updatedActionData);
    saveActionDataForNode(activeScenarioId, nodeId, updatedActionData);

    console.log("[setRef] Constructed action data : ", updatedActionData);
  };


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

  console.log(`Actionnode formstate:`, formState);
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
          RemarkSVG={RemarkSVG}
          VoteSVG={VoteSVG}
          DelegateSVG={DelegateSVG}
          InkSVG={InkSVG}
          StakeSVG={StakeSVG}
          dropdownVisible={dropdownVisible}
          ref={dropdownRef}
          handleOnClick={true}
        />

        </div>
      </div>

      {formState && formState.action === 'delegate' && (

<div className="in-node-border rounded m-2 p-2 ">Delegate voting power on all Polkadot tracks
<input  onChange={(newValue) => setToDel(newValue)}  type="text" id="contact-name"  placeholder="Address" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />

<select
            onChange={(e) => setDelLock(e.target.value)}
            id="vote-locks"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          >
            <option value="0">0.1x voting balance, no lockup period</option>
            <option value="1">1x voting balance, locked for 7 days</option>
            <option value="2">2x voting balance, locked for 14 days</option>
            <option value="3">3x voting balance, locked for 28 days</option>
            <option value="4">4x voting balance, locked for 56 days</option>
            <option value="5">5x voting balance, locked for 112 days</option>
            <option value="6">6x voting balance, locked for 224 days</option>
          </select>
</div>
)}
     {formState && formState.action === 'stake' && (

<div className="in-node-border rounded m-2 p-2 ">Stake dot to a nomination pool

<input  onChange={(newValue) => setStake(newValue)}  type="number" min="1" id="contact-name"  placeholder="Nomination pool id" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
</div>
)}

      {formState && formState.action === 'Remark' && (

            <div className="in-node-border rounded m-2 p-2 ">System Remark
            <input  onChange={(newValue) => setRemark(newValue)}  type="text" id="contact-name"  placeholder="Message" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            </div>
      )}

{formState && formState.action === 'ink' && (

<div className="in-node-border rounded m-2 p-2 ">Contract address:
<input  onChange={(newValue) => setInkAddress(newValue)}  type="text" id="contact-name"  placeholder="Smart contract address" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
<label htmlFor="contract-json" className="mt-2">Upload Contract JSON file:</label>
  <input
    onChange={(e) => handleFileUpload(e)}
    type="file"
    id="contract-json"
    accept=".json"
    placeholder="contract.json"
    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
  />
</div>



)}



{formState && formState.action === 'vote' && (

<div className="in-node-border rounded m-2 p-2 ">Vote
<input  onChange={(newValue) => setRef(newValue.target.value)} min="1"  type="number" id="contact-name"  placeholder="Referendum Number" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
<select
            onChange={(e) => setAye(e.target.value)}
            id="vote-aye"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          >
            <option value="aye">Aye</option>
            <option value="nay">Nay</option>
          </select>

<select
            onChange={(e) => setLock(e.target.value)}
            id="vote-locks"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          >
            <option value="0">0.1x voting balance, no lockup period</option>
            <option value="1">1x voting balance, locked for 7 days</option>
            <option value="2">2x voting balance, locked for 14 days</option>
            <option value="3">3x voting balance, locked for 28 days</option>
            <option value="4">4x voting balance, locked for 56 days</option>
            <option value="5">5x voting balance, locked for 112 days</option>
            <option value="6">6x voting balance, locked for 224 days</option>
          </select>

</div>
)}
  {formState && formState.action === 'ink' && (
        isFetchingActionData ? (
            <InkInfo sourceInfo='0' targetInfo='0' priceInfo='0'  contract_address={ formState.actionData?.inkdata?.contract }  abi={formState.actionData?.inkdata?.abi} />
          ) : (
            // Placeholder for when no price info is available
            <div className="in-node-border rounded m-2 p-2 ">!ink<br/>
              Contract address: { formState.actionData?.inkdata?.contract || 'Not set'}<br/>
              Chain: { formState.actionData?.source?.chain || 'Not set'}
            </div>
            
          )
        )
      }

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

