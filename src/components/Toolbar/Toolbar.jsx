import React, { useContext } from 'react';
import Tippy from '@tippyjs/react';
import ThemeContext from '../../contexts/ThemeContext';
import { nodeDescriptions } from './nodeDescriptions';
import { AppsIcon, ActionIcon, ChainIcon, ToolsIcon, RouterIcon, WebhookIcon, WebsocketIcon, ScheduleIcon, DelayIcon, APIIcon, CodeIcon, DiscordIcon, OpenAIIcon, HttpIcon, ChainQueryIcon, WebhookNodeIcon } from '../Icons/icons'; 
import { AppsSubMenu, ChainSubMenu, HttpSubMenu, nodeNames } from './Menus';
import 'tippy.js/dist/tippy.css'; 
import './Toolbar.scss'; 





const Toolbar = ({ onAddNode }) => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    console.log('dragging nodeType', { nodeType });
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const onClickAddNode = ( nodeKey) => {
    console.log('clicked nodeType', { nodeKey });

    if (typeof onAddNode === 'function') {
      onAddNode(nodeKey);
    } else {
      console.error('onAddNode is not a function', onAddNode);
    }

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
    } else if (nodeKey === 'chainTx') {
      IconComponent = <ChainQueryIcon />;
    } else if (nodeKey === 'lightClient') {
      IconComponent = <ChainIcon />;
    } else if (nodeKey === 'blinks') {
      IconComponent = <BlinkIcon />;
    }

    // return (
    //   <Tippy theme="light" placement="bottom" className='tippy-node' interactive={true} content={nodeDescriptions[nodeKey]}>
    //     <div className={`toolbar-icon ${theme}`} 
    //       onClick={() => onClickAddNode(nodeKey)}
    //       onDragStart={(event) => onDragStart(event, nodeKey)} draggable>
    //       {IconComponent}
    //       <span>{nodeNames[nodeKey]}</span>
    //     </div>
    //   </Tippy>
    // );
  };
  
  return (
    <div className={`toolbar-node ${theme}`}>
    {Object.keys(nodeNames).map(nodeKey => renderNode(nodeKey))}
    <Tippy content={<ChainSubMenu onDragStart={onDragStart} onClick={onClickAddNode} theme={theme} />} interactive={true} theme="light" placement="bottom">
      <div className={`toolbar-icon ${theme}`}>
        <ChainIcon />
        <span>Web3</span>
      </div>
    </Tippy>

    <Tippy content={<HttpSubMenu onDragStart={onDragStart} onClick={onClickAddNode} theme={theme} />}  interactive={true} theme="light" placement="bottom">
      <div className={`toolbar-icon ${theme}`}>
        <HttpIcon />
        <span>Web2</span>
      </div>
    </Tippy>

    <Tippy content={<AppsSubMenu onDragStart={onDragStart} onClick={onClickAddNode} theme={theme} />}  interactive={true} theme="light" placement="bottom">
      <div className={`toolbar-icon ${theme}`}>
        <AppsIcon />
        <span>Apps</span>
      </div>
    </Tippy>
   

  </div>
  );
};

export default Toolbar;
