// @ts-nocheck
import React, { useEffect, useState, useRef} from 'react';
import { Handle, Position } from 'reactflow';
import ContextMenu from '../Menus/ContextMenu';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import '../../../index.css'
import '../node.styles.css'

export default function CustomNode({ nodeId, data, isConnectable }) {
   
  const [isOpen, setIsOpen] = useState(false);
  const [newNodeId, setNewNodeId] = useState(nodeId);
  const [contextMenuEvent, setContextMenuEvent] = useState(null);
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenuEvent(event);
  }

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault(); // Prevent the default context menu from appearing
    };
    window.addEventListener('contextmenu', handleRightClick);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  

  const handleNodeIdChange = (event) => setNewNodeId(event.target.value);
  const handleNodeIdSubmit = (event) => {
    event.preventDefault();
    // Logic for updating nodeId goes here
  };

  const handleNicknameChange = (event) => {
    setNewNickname(event.target.value);

}
const nicknameInputRef = useRef();

const handleNicknameSubmit = (event) => {
    event.preventDefault();
    if (nicknameInputRef.current.value) setNickname(nicknameInputRef.current.value);
}


  const items = [
    { label: 'Chat with this agent only', onClick: () => {} },
    { label: 'Delete node', onClick: () => {} },
    { label: 'Clone Node', onClick: () => {} },
    { label: 'Copy Node', onClick: () => {} },
  ];

  const menu = {
    image: "./menu-dots.svg"
  }



  return (
    <div 
    className="custom-node rounded-lg shadow-lg font-mono text-xs"
    onContextMenu={handleContextMenu}
  >
    <Handle id="a" type="target" position={Position.Left}  isConnectable={isConnectable} />
    <Handle id="b" type="source" position={Position.Right}  isConnectable={isConnectable} />
      
      <div className="flex justify-between items-center p-1 absolute w-[100%]">
        <div className="flex items-center">
          <img className="w-6 h-6 mr-2" src={data.image} alt="Node logo" />
          <div className="flex flex-col">
            <div className="node-title">{data.name}</div>
              <Tippy
                  interactive={true}
                  hideOnClick={true}
                  theme="light"
                  trigger="click"
                  content={
                      <form onSubmit={handleNicknameSubmit}>
                      <input autoFocus type="text" ref={nicknameInputRef} defaultValue={nickname || nodeId} 
                          onFocus={(e) => e.target.value = ""}  />
                      <input type="submit" value="update" className='cursor-pointer update-text' />
                      </form>
                  }
                  >
                  <span className="cursor-pointer node-name">{nickname || nodeId}</span>
              </Tippy>
            </div>
          </div>
        <div>
          <button onClick={toggleMenu} className="focus:outline-none">
            <img src={menu.image} className="w-1" />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-2 rounded shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
              <li className="px-4 py-2">Option 1</li>
              <li className="px-4 py-2">Option 2</li>
              <li className="px-4 py-2">Option 3</li>
            </ul>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {data.children}
        
      </div>
      {contextMenuEvent && (
        <ContextMenu 
          triggerEvent={contextMenuEvent} 
          items={items}
        />
      )}
    </div>
  );
}
