// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';


import '../../../index.css'
import '../../../main.scss';
import '../node.styles.scss'

export default function CustomNode({ children, data, isConnectable }) {
  

  return (
    <div 
    className="custom-node rounded-lg shadow-lg   text-xs"
  >
    <Handle id="a" type="target" position={Position.Left}  isConnectable={isConnectable} />
    <Handle id="b" type="source" position={Position.Right}  isConnectable={isConnectable} />
      
      <div className="flex justify-between items-center p-1 absolute w-[100%]">
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="node-title">{data.name}</div>
              
            </div>
          </div>
        <div>
        </div>
        <div className="">
        {children}
      </div>

      </div>

   
    </div>
  );
}
