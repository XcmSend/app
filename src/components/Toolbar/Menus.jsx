import React from 'react';
import Tippy from '@tippyjs/react';
import { nodeDescriptions } from './nodeDescriptions';
import { AppsIcon, ActionIcon, ChainIcon, ToolsIcon, RouterIcon, WebhookIcon, WebsocketIcon, ScheduleIcon, DelayIcon, APIIcon, CodeIcon, DiscordIcon, OpenAIIcon, HttpIcon, ChainQueryIcon, WebhookNodeIcon, BlinkIcon } from '../Icons/icons'; 
import 'tippy.js/dist/tippy.css'; 
import './Toolbar.scss'; 
import { on } from 'process';



export const nodeNames = {
    chain: 'Chain',
    action: 'Action',
    webhook: 'Hook',
    http: 'HTTP',

};

export const AppsSubMenu = ({ onClick, onDragStart, theme }) => {
  const appsNodes = {
    code: 'Code',
    delay: 'Delay',
    openAi: 'GPT',
    chatGpt: 'Chat GPT',
    router: 'Router',
    schedule: 'Schedule',
    websocket: 'Socket',
    tools: 'Tools',

   
  };
    

  const getNodeIcon = (nodeKey) => {
    switch (nodeKey) {
      case 'tools': return <ToolsIcon fillColor='black' />;
      case 'websocket': return <WebsocketIcon fillColor='black' />;
      case 'router': return <RouterIcon fillColor='black' />;
      case 'schedule': return <ScheduleIcon fillColor='black' />;
      case 'delay': return <DelayIcon fillColor='black' />;
      case 'code': return <CodeIcon fillColor='black' />;
      case 'openAi': return <OpenAIIcon fillColor='black' />;
      case 'chatGpt': return <OpenAIIcon fillColor='black' />;
      case 'chainQuery': return <ChainQueryIcon fillColor='black' />;
      case 'chainTx': return <ChainQueryIcon fillColor='black' />;
      case 'blinks': return <BlinkIcon fillColor='black' />;

      default: return null;
    }
  };

  return (
    <div className={`submenu mt-2 ${theme}`}>
      {Object.keys(appsNodes).map(nodeKey =>
        <Tippy key={nodeKey} content={nodeDescriptions[nodeKey]} interactive={true} theme="light" placement="right"  className='tippy-node'>
          <div className={`submenu-icon ${theme}`} 
     onClick={(e) => { e.stopPropagation(); onClick(nodeKey); }}
     onDragStart={(event) => onDragStart(event, nodeKey)} 
            draggable
          >
            {getNodeIcon(nodeKey)}
            <span className='text-slate-800'>{appsNodes[nodeKey]}</span>
          </div>
        </Tippy>
      )}
    </div>
  );
};


export const ChainSubMenu = ({ onClick, onDragStart, theme }) => {
  const chainsNodes = {
   chain: 'Chain',
   chainTx: 'Chain TX',
   chainQuery: 'Chain Query',
   action: 'Action',
 //  lightClient: 'Light Client',
   blinks: 'Blink Builder',

  };

  const getNodeIcon = (nodeKey) => {
    switch (nodeKey) {
      case 'chain': return <ChainIcon fillColor='black' />;
      case 'action': return <ActionIcon fillColor='black' />;
      case 'chainQuery': return <ChainQueryIcon fillColor='black' />;
      case 'chainTx': return <ChainIcon fillColor='black' />;
      case 'lightClient': return <ChainIcon fillColor='black' />;
      case 'blinks': return <BlinkIcon fillColor='black' />;


     

      
      default: return null;
    }
  };

  return (
    <div className={`submenu mt-2 ${theme}`}>
      {Object.keys(chainsNodes).map(nodeKey =>
        <Tippy key={nodeKey} content={nodeDescriptions[nodeKey]} interactive={true} theme="light" placement="right" className='tippy-node'>
          <div className={`submenu-icon ${theme}`} 
               onClick={(e) => { e.stopPropagation(); onClick(nodeKey); }}

                onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
            {getNodeIcon(nodeKey)}
            <span className='text-slate-800'>{chainsNodes[nodeKey]}</span>
          </div>
        </Tippy>
      )}
    </div>
  );
};

  export const HttpSubMenu = ({ onClickAddNode, onDragStart, theme }) => {
    const httpNodes = {
      webhook: 'Hook',
      http: 'HTTP',  
   };

   const getNodeIcon = (nodeKey) => {
    switch (nodeKey) {
      case 'webhook': return <WebhookNodeIcon fillColor='black' />;
      case 'http': return <HttpIcon fillColor='black' />;
  
      default: return null;
    }
  };

  return (
    <div className={`submenu mt-2 ${theme}`}>
      {Object.keys(httpNodes).map(nodeKey =>
        <Tippy key={nodeKey} content={nodeDescriptions[nodeKey]} interactive={true} theme="light" placement="right" className='tippy-node'>
          <div className={`submenu-icon ${theme}`} 
     onClick={(e) => { e.stopPropagation(); onClick(nodeKey); }}
     onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
            {getNodeIcon(nodeKey)}
            <span className='text-slate-800'>{httpNodes[nodeKey]}</span>
          </div>
        </Tippy>
      )}
    </div>
  );
};

