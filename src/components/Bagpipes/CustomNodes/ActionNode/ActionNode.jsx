import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import useAppStore from '../../../../store/useAppStore';
import { getHydraDxSellPrice } from '../../../../Chains/Helpers/PriceHelper';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import { getOrderedList } from '../../utils/scenarioUtils';
import { convertFormStateToActionType } from './actionUtils';
import PriceInfo from '../PriceInfo';
import Selector from './Selector';
import toast from 'react-hot-toast';
import ThemeContext from '../../../../contexts/ThemeContext';

import '../../../../index.css';
import '../../node.styles.scss';
import '../../../../main.scss';

const formatTime = (date) => {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export default function ActionNode({ children, data, isConnectable }) {
  const { theme } = React.useContext(ThemeContext);
  const nodeId = useNodeId();
  const { scenarios, activeScenarioId, loading, saveNodeFormData  } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    saveNodeFormData: state.saveNodeFormData,
  }));
  const [orderedList, setOrderedList] = useState([]);
  const selectedNodeId = scenarios[activeScenarioId]?.selectedNodeId;
  const [assetInNodeId, setAssetInNodeId] = useState(null);
  const [assetOutNodeId, setAssetOutNodeId] = useState(null);
  const [priceInfo, setPriceInfo] = useState(null);
  const [sellPriceInfoMap, setPriceInfoMap] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isFetchingActionData, setIsFetchingActionData] = useState(false);
  const initialAction = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.action || null;
  const [formState, setFormState] = useState({ action: initialAction });
  const nodes = scenarios[activeScenarioId]?.diagramData?.nodes;
  const edges = scenarios[activeScenarioId]?.diagramData?.edges;
  const [lastUpdated, setLastUpdated] = useState(null);
  const [actionData, setActionData] = useState({});
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
    return null;
  };

  

  const handleDropdownClick = (value) => {
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
        setActionData(newActionData);
        console.log("[handleDropdownClick] Constructed action data : ", newActionData);
    }
  };


  // useEffect(() => {
  //   // logic to generate new orderedList
  //   const newList = getOrderedList();  // Assuming this is your function to generate the list
  //   setOrderedList(newList);
  // }, [edges]);

  const fetchActionInfo = async () => {
    console.log('fetchActionInfo Fetching');
    const assetInId = assetInFormData?.asset?.assetId;
    const assetOutId = assetOutFormData?.asset?.assetId;
    const amount = assetInFormData?.amount;

    console.log('fetchActionInfo assetInId:', assetInId, assetOutId);
    if (assetInId === undefined || assetInId === null || assetOutId === undefined || assetOutId === null) return;
    console.log('fetchActionInfo we passed through the if statement');

    setIsFetchingActionData(true); // Start the loading state

    try {
        if(formState.action === 'swap' && assetInFormData.chain === 'hydraDx' && assetOutFormData.chain === 'hydraDx') {
          console.log('fetchActionInfo Fetching for swap');
            const fetchedPriceInfo = await getHydraDxSellPrice(assetInId, assetOutId, amount);
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
            console.log('Fetching for xTransfer');
        }

        // Set actionData outside of the action-specific blocks
        // Create action data based on the selected value
        const newActionData = convertFormStateToActionType(
            { ...formState, action: formState.action }, 
            assetInFormData, 
            assetOutFormData
        );

        if (newActionData) {
            setActionData(newActionData);
            setLastUpdated(new Date());
            console.log("Constructed action data: ", newActionData);
            console.log('lastUpdated:', lastUpdated);

        }

    } catch (error) {
        // Handle error
        toast.error("An error occurred while fetching action info...", error);
        setPriceInfoMap({})    
      } finally {
        setIsFetchingActionData(false);

    }
};






  // useEffect(() => {
  //   console.log('[ActionNode] assetInFormData:', assetInFormData);
  //   fetchActionInfo(assetInFormData, assetOutFormData)
  //   }, [assetInNodeId, assetOutNodeId, assetInFormData?.amount, assetInFormData?.address, assetOutFormData?.amount, assetOutFormData?.address]);


    useEffect(() => {
      if (!selectedNodeId || !selectedNodeId.startsWith('action_')) return;
      console.log('[ActionNode] active node:', selectedNodeId);

      const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
      console.log('ActionNode scenario edges:', scenarios[activeScenarioId]?.diagramData?.edges);
      console.log('ActionNode Ordered List:', orderedList);

      const currentIndex = orderedList.indexOf(selectedNodeId);
      console.log('ActionNode Current Index:', currentIndex);

      if (currentIndex === -1) return;

      const assetInNodeId = orderedList[currentIndex - 1];

      const assetOutNodeId = orderedList[currentIndex + 1];
      console.log('[ActionNode] assetInNodeId:', assetInNodeId);
      console.log('[ActionNode] assetOutNodeId:', assetOutNodeId);

        
        setAssetInNodeId(assetInNodeId);
        setAssetOutNodeId(assetOutNodeId);
    }, [selectedNodeId, scenarios]);

  //   useEffect(() => {
  //     console.log('[ActionNode] Updated assetInNodeId:', assetInNodeId);
  //     console.log('[ActionNode] Updated assetOutNodeId:', assetOutNodeId);
  // }, [assetInNodeId, assetOutNodeId]);
  
    // This effect will only run once when the component mounts
    useEffect(() => {
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      if (currentNodeFormData) {
        setFormState(currentNodeFormData);
      }
    }, []);
    
    // useEffect(() => {
    //   if (formState.action === 'xTransfer') {
    //       setPriceInfo(null);
    //   }
    // }, [formState.action]);
    
    
    useEffect(() => {
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      if (currentNodeFormData && JSON.stringify(currentNodeFormData) !== JSON.stringify(formState)) {
        setFormState(currentNodeFormData);
      }
    }, [nodeId, activeScenarioId]);
    
    
    useEffect(() => {
      console.log("Attempting to save form state:", formState);
      if (!activeScenarioId || !nodeId) {
          console.warn("Missing activeScenarioId or nodeId. Not proceeding with save.");
          return;
      }

      // fetchActionInfo()
      const formData = { ...formState, actionData }; // combine formState with actionData
      saveNodeFormData(activeScenarioId, nodeId, formData);
  }, [formState, actionData, nodeId, activeScenarioId]); 
  
  
  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;

    if (currentNodeFormData && currentNodeFormData.action === 'swap') {
      console.log('fetchActionInfo Fetching for swap', currentNodeFormData.action)
      fetchActionInfo(assetInFormData, assetOutFormData)
      return
    }

  } , [assetInFormData, assetOutFormData]); 
  // Here we want to create the action form data object to pass for processing 
  useEffect(() => {
    const newActionData = convertFormStateToActionType(formState, assetInFormData, assetOutFormData); 
    if (newActionData) {
        setActionData(newActionData);
        console.log("Constructed action data: ", newActionData);
    }
  }, [formState, assetInFormData, assetOutFormData]);
  
  return (
    <>
      
    <div className={`${theme} custom-node rounded-lg shadow-lg text-xs flex flex-col justify-start bg-gray-100 primary-font`}>
 
          <h1 className="text-xxs text-gray-400 primary-font mb-2">{nodeId}</h1>

      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />
    <div className='p-3 in-node-border rounded flex justify-center flex-col items-center mb-3'>
      <div className="text-gray-400 mb-2 text-xxs"> {data.name}</div>

      
      

      {/* Custom dropdown */}
      <div className="relative">
        <div className="flex justify-between items-center in-node-border py-1 px-2 rounded cursor-pointer text-xs ml-2 mr-2 font-semibold  bg-white" onClick={() => setDropdownVisible(!dropdownVisible)}>
        {formState.action ? (
          <>
            <img src={getActionImage()} alt={formState.action} className="w-12 h-12 p-1 mx-auto" />
          </>
        ) : (
          <div className="text-gray-500 mx-auto text-xs font-semibold">Select Action</div>
        )}

          <div className="pl-2 dropdown">⌄</div>
        </div>
        
        {dropdownVisible && (
          <Selector
            handleDropdownClick={handleDropdownClick} 
            onActionSelect={(action) => console.log("Selected action:", action)}
            SwapSVG={SwapSVG}
            xTransferSVG={xTransferSVG} 
          />
        )}
      </div>

      <div className="mt-2 text-center text-xs font-semibold primary-font">
        {formState.action && formState.action.charAt(0).toUpperCase() + formState.action.slice(1)}
      </div>

      {formState && formState.action === 'swap' && (
        isFetchingActionData ? (
          <div className="small-spinner"></div>
        ) : (
          sellPriceInfoMap[nodeId] ? (
            <PriceInfo sourceInfo={assetInFormData} targetInfo={assetOutFormData} priceInfo={sellPriceInfoMap[nodeId]} />
          ) : (
            // Placeholder for when no price info is available
            <div className="in-node-border rounded m-2 p-2 ">No price info available</div>
          )
        )
      )}
      </div>

      {formState.action === 'xTransfer' && actionData?.source?.chain && actionData?.source?.amount && actionData?.source?.symbol && (
      <div className='p-2 in-node-border rounded mb-2 '>
        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">From:</div>
          <div className="w-2/3 font-semibold text-left ">{actionData.source.chain}</div>
        </div>

        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">To:</div>
          <div className="w-2/3 font-semibold text-left">{actionData.target.chain}</div>
        </div>

        <div className="flex justify-between">
          <div className="w-1/3 text-xxs text-gray-400">Amount:</div>
          <div className="w-2/3 font-semibold text-left">{actionData.source.amount} {actionData.source.symbol}</div>
        </div>
      </div>
    )}





    <button 
      onClick={() => fetchActionInfo(assetInFormData, assetOutFormData)} 
      className=" flex justify-center align-center font-bold py-1 px-1 mb-1 in-node-border-gray-300 hover:in-node-border-green rounded" 
      >
       { isFetchingActionData ? (
          <div className="small-spinner"></div>
        ) : (
          <span className=" font-semibold mr-1">fetch</span>
        )}

      <img className="h-4 w-4 ml-2" src="/refresh.svg" alt="refresh icon" />
    </button>

        {sellPriceInfoMap ? (
        lastUpdated && <span className='text-gray-400 text-xxs flex justify-center'>Last updated: {formatTime(lastUpdated)}</span>
        ):( null)
        }

      
      {/* { formState.action === 'xTransfer' ? (
         lastUpdated && <span className='text-gray-400 text-xxs flex justify-center'>
          Last updated: {formatTime(lastUpdated)}
        </span>
      ):( null)
    }  */}

      <div className="space-y-2 mt-1">
        {data.children}
      </div>
    </div>
    </>
  );
}
