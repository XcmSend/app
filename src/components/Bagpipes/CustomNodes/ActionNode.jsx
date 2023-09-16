import React, { useState, useEffect } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import SwapSVG from '/swap.svg';
import TeleportSVG from '/teleport.svg';
import useAppStore from '../../../store/useAppStore';

import '../../../index.css';
import '../node.styles.scss';
import '../../../main.scss';

export default function ActionNode({ children, data, isConnectable }) {
  const nodeId = useNodeId();
  const { scenarios, activeScenarioId, loading, saveNodeFormData  } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    saveNodeFormData: state.saveNodeFormData,

  }));

  const initialAction = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.action || null;

  const [formState, setFormState] = useState({
      action: initialAction
  });
  
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    console.log("Attempting to save form state:", formState);
    if (!activeScenarioId || !nodeId) {
      console.warn("Missing activeScenarioId or nodeId. Not proceeding with save.");
      return;
    }
    const formData = { ...formState };
    saveNodeFormData(activeScenarioId, nodeId, formData);
  }, [formState, nodeId, activeScenarioId]);
  
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

          <div className="pl-2">⌄</div> {/* This is the dropdown arrow symbol */}
        </div>
        
        {dropdownVisible && (
          <div className="absolute z-10 min-w-full border mt-1 rounded bg-white whitespace-nowrap ">
            <div className="flex flex-col">
              <div onClick={() => handleDropdownClick('swap')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={SwapSVG} alt="Swap" className="w-4 h-4 mr-2" />
                <div className='text-xs bold'>Swap</div>
              </div>
              <div onClick={() => handleDropdownClick('teleport')} className="flex items-center p-2 hover:bg-gray-200">
                <img src={TeleportSVG} alt="Teleport" className="w-5 h-4 mr-2" />
                <div className='text-xs'>Teleport</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs">
        {formState.action && formState.action.charAt(0).toUpperCase() + formState.action.slice(1)}
      </div>


      <div className="space-y-2 mt-2">
        {data.children}
      </div>
    </div>
  );
}
