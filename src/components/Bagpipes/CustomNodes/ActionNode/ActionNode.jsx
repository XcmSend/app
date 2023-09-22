import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import useAppStore from '../../../../store/useAppStore';
import { getHydraDxSellPrice } from '../../../Chains/PriceHelper';
import SwapSVG from '/swap.svg';
import TeleportSVG from '/teleport.svg';
import { getOrderedList } from '../../utils/scenarioUtils';
import { convertFormStateToActionType } from './actionUtils';
import PriceInfo from '../PriceInfo';

import '../../../../index.css';
import '../../node.styles.scss';
import '../../../../main.scss';

const formatTime = (date) => {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export default function ActionNode({ children, data, isConnectable }) {
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
  const [isfetchingPriceInfo, setIsFetchingPrice] = useState(false);
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
  // console.log('[ActionNode] assetInFormData:', assetInFormData);
  // console.log('[ActionNode] assetOutFormData:', assetOutFormData);

  const getActionImage = () => {
    if (formState.action === 'swap') return SwapSVG;
    if (formState.action === 'teleport') return TeleportSVG;
    return null;
  };

  const handleDropdownClick = (value) => {
    setDropdownVisible(false);
    setFormState(prev => ({
      ...prev,
      action: value
    }));
  };

  useEffect(() => {
    // logic to generate new orderedList
    const newList = getOrderedList();  // Assuming this is your function to generate the list
    setOrderedList(newList);
  }, [edges]);





  const fetchPriceInfo = async () => {
    const assetInId = assetInFormData?.asset?.assetId;
    const assetOutId = assetOutFormData?.asset?.assetId;
    const amount = assetInFormData?.amount;

    if (!assetInId || !assetOutId || !amount) return;  

    try {
        setIsFetchingPrice(true);
        const fetchedPriceInfo = await getHydraDxSellPrice(assetInId, assetOutId, amount);
        setPriceInfoMap(prevMap => ({
            ...prevMap,
            [selectedNodeId]: fetchedPriceInfo
        }));
        setLastUpdated(new Date());
    } catch (error) {
        // Handle error
    } finally {
        setIsFetchingPrice(false);
    } 
  };

  useEffect(() => {
    fetchPriceInfo();
  }, [assetInNodeId, assetOutNodeId, assetInFormData?.amount, assetInFormData?.address, assetOutFormData?.amount, assetOutFormData?.address]);


    useEffect(() => {
      if (!selectedNodeId || !selectedNodeId.startsWith('action_')) return;
      console.log('[ActionNode] active node:', selectedNodeId);

      const orderedList = getOrderedList(scenarios[activeScenarioId]?.diagramData?.edges);
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

    useEffect(() => {
      console.log('[ActionNode] Updated assetInNodeId:', assetInNodeId);
      console.log('[ActionNode] Updated assetOutNodeId:', assetOutNodeId);
  }, [assetInNodeId, assetOutNodeId]);
  
    // This effect will only run once when the component mounts
    useEffect(() => {
      const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
      if (currentNodeFormData) {
        setFormState(currentNodeFormData);
      }
    }, []);
    
    useEffect(() => {
      if (formState.action === 'teleport') {
          setPriceInfo(null);
      }
    }, [formState.action]);
    
    
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
      const formData = { ...formState, actionData }; // combine formState with actionData
      saveNodeFormData(activeScenarioId, nodeId, formData);
  }, [formState, actionData, nodeId, activeScenarioId]); 
  
  
  // Here we want to create the action form data object to pass for processing 
  useEffect(() => {
    const newActionData = convertFormStateToActionType(formState, assetInFormData, assetOutFormData); 
    if (newActionData) {
        setActionData(newActionData);
        console.log("Constructed action data: ", newActionData);
    }
}, [formState, assetInFormData, assetOutFormData]);


  return (
    <div className="custom-node rounded-lg shadow-lg text-xs flex flex-col items-center justify-start p-2 bg-gray-100 primary-font">
          <h1 className="text-xxs text-gray-400 primary-font mb-1">{nodeId}</h1>

      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />

      <div className="text-gray-400 mb-2 text-xxs">{data.name}</div>

      {/* Custom dropdown */}
      <div className="relative w-28">
        <div className="flex justify-between items-center border py-1 px-2 rounded cursor-pointer text-xs ml-3 mr-3 font-semibold  bg-white" onClick={() => setDropdownVisible(!dropdownVisible)}>
        {formState.action ? (
          <>
            <img src={getActionImage()} alt={formState.action} className="w-12 h-12 p-1 mx-auto" />
          </>
        ) : (
          <div className="text-gray-500 mx-auto text-xs font-semibold">Select Action</div>
        )}

          <div className="pl-2">⌄</div>
        </div>
        
        {dropdownVisible && (
          <div className="absolute z-10 min-w-full border mt-1 rounded bg-white whitespace-nowrap ">
            <div className="flex flex-col">
              <div onClick={() => handleDropdownClick('swap')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={SwapSVG} alt="Swap" className="w-4 h-4 mr-2" />
                <div className='text-xs bold font-semibold'>Swap</div>
              </div>
              <div onClick={() => handleDropdownClick('teleport')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={TeleportSVG} alt="Teleport" className="w-5 h-4 mr-2" />
                <div className='text-xs font-semibold'>Teleport</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs font-semibold primary-font m-2">
        {formState.action && formState.action.charAt(0).toUpperCase() + formState.action.slice(1)}
      </div>


      {formState.action === 'swap' && (
        isfetchingPriceInfo ? (
          <div className="small-spinner"></div>
        ) : (
          sellPriceInfoMap[nodeId] ? (
            <PriceInfo sourceInfo={assetInFormData} targetInfo={assetOutFormData} priceInfo={sellPriceInfoMap[nodeId]} />
          ) : (
            // Placeholder for when no price info is available
            <div className="border rounded m-2 p-2 ">No price info available</div>
          )
        )
      )}

        <span onClick={() => fetchPriceInfo(assetInFormData, assetOutFormData)} className="text-xs m-1 p-0 rounded refresh-button">
          <img className="h-3 w-3" src="/refresh.svg" />
        </span>

        {sellPriceInfoMap ? (
        lastUpdated && <span>Last updated: {formatTime(lastUpdated)}</span>
        ):( null)
        }
      <div className="space-y-2 mt-2">
        {data.children}
      </div>
    </div>
  );
}
