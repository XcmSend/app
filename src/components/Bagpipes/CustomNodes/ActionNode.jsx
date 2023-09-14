import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import SwapSVG from '/swap.svg';
import TeleportSVG from '/teleport.svg';

import '../../../index.css';
import '../../../main.scss';
import '../node.styles.scss';

export default function ActionNode({ children, nodeId, data, isConnectable }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getActionImage = () => {
    if (selectedAction === 'swap') return SwapSVG;
    if (selectedAction === 'teleport') return TeleportSVG;
    return null;
  };

  const handleDropdownClick = (value) => {
    setSelectedAction(value);
    setDropdownVisible(false);
  };

  return (
    <div className="custom-node rounded-lg shadow-lg text-xs flex flex-col items-center justify-start p-2">
      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />

      <div className="text-gray-400 mb-2 text-xxs">{data.name}</div>

      {/* Custom dropdown */}
      <div className="relative w-28">
        <div className="flex justify-between items-center border py-1 px-2 rounded cursor-pointer text-xs ml-3 mr-3 font-semibold" onClick={() => setDropdownVisible(!dropdownVisible)}>
          {selectedAction ? (
            <>
              <img src={getActionImage()} alt={selectedAction} className="w-12 h-12 p-1 mx-auto" />
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
        {selectedAction && selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
      </div>

      <div className="space-y-2 mt-2">
        {data.children}
      </div>
    </div>
  );
}
