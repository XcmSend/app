import React, { useContext } from 'react';
import Tippy from '@tippyjs/react';
import ThemeContext from '../../contexts/ThemeContext';
import { nodeDescriptions } from './nodeDescriptions';
import { AppsIcon, ActionIcon, ChainIcon, ToolsIcon, RouterIcon, WebhookIcon, WebsocketIcon, ScheduleIcon, DelayIcon, APIIcon, CodeIcon, DiscordIcon, OpenAIIcon, HttpIcon, ChainQueryIcon } from '../Icons/icons'; 
import 'tippy.js/dist/tippy.css'; 
import './Toolbar.scss'; 



const nodeNames = {
    chain: 'Chain',
    action: 'Action',
    webhook: 'Hook',
    http: 'HTTP',
  
    
};

const AppsSubMenu = ({ onDragStart, theme }) => {
  const appsNodes = {
    code: 'Code',
    delay: 'Delay',
    openAi: 'GPT',
    chatGpt: 'Chat GPT',
    router: 'Router',
    schedule: 'Schedule',
    websocket: 'Socket',
    tools: 'Tools',
    chainQuery: 'Query Chain',
    chainTx: 'Chain TX',


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
      default: return null;
    }
  };

  return (
    <div className={`submenu mt-2 ${theme}`}>
      {Object.keys(appsNodes).map(nodeKey =>
        <Tippy key={nodeKey} content={nodeDescriptions[nodeKey]} interactive={true} theme="light" placement="right">
          <div className={`submenu-icon ${theme}`} onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
            {getNodeIcon(nodeKey)}
            <span className='text-slate-800'>{appsNodes[nodeKey]}</span>
          </div>
        </Tippy>
      )}
    </div>
  );
};

const Toolbar = () => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };


  const renderNode = (nodeKey) => {
    let IconComponent;
    if (nodeKey === 'chain') {
      IconComponent = <ChainIcon />;
    } else if (nodeKey === 'action') {
      IconComponent = <ActionIcon />;
    // } else if (nodeKey === 'tools') {
    //   return (
    //       <Tippy placement="bottom" theme="light" interactive={true} content={<ToolsPopoverContent />}>
    //           <div className={`toolbar-icon ${theme}`}>
    //               <ToolsIcon />
    //               <span>{nodeNames[nodeKey]}</span>
    //           </div>
    //       </Tippy>
    //   );
    } else if (nodeKey === 'webhook') {
      IconComponent = <WebhookIcon />;
    } else if (nodeKey === 'websocket') {
      IconComponent = <WebsocketIcon />;
    } else if (nodeKey === 'delay') {
      IconComponent = <DelayIcon />;
    } else if (nodeKey === 'http') {
      IconComponent = <HttpIcon />;
    } else if (nodeKey === 'code') {
      IconComponent = <CodeIcon />;
    } else if (nodeKey === 'discord') {
      IconComponent = <DiscordIcon className='h-6 w-6' fillColor='white' />;
    } else if (nodeKey === 'openAi' || nodeKey === 'chatGpt') {
      IconComponent = <OpenAIIcon />;
    } else if (nodeKey === 'chainQuery') {
      IconComponent = <ChainQueryIcon />;
    }else if (nodeKey === 'chainTx') {
      IconComponent = <ChainQueryIcon />;
    }

    return (
      <Tippy theme="light" placement="bottom" className='tippy-node' interactive={true} content={nodeDescriptions[nodeKey]}>
        <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
          {IconComponent}
          <span>{nodeNames[nodeKey]}</span>
        </div>
      </Tippy>
    );
  };
  return (
    <div className={`toolbar-node ${theme}`}>
      {Object.keys(nodeNames).map(nodeKey => renderNode(nodeKey))}
      <Tippy content={<AppsSubMenu onDragStart={onDragStart} theme={theme} />} interactive={true} theme="light" placement="bottom">
        <div className={`toolbar-icon ${theme}`}>
          <AppsIcon /> 
          <span>Apps</span>
        </div>
      </Tippy>
    </div>
  );
};

export default Toolbar;
