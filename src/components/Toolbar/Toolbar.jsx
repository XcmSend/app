import React, { useContext } from 'react';
import Tippy from '@tippyjs/react';
import ThemeContext from '../../contexts/ThemeContext';
import { ActionIcon, ChainIcon, ToolsIcon, RouterIcon, WebhookIcon, WebsocketIcon, ScheduleIcon, DelayIcon, APIIcon, CodeIcon, DiscordIcon, OpenAIIcon, HttpIcon } from '../Icons/icons'; 
import 'tippy.js/dist/tippy.css'; 
import './Toolbar.scss'; 



const nodeNames = {
    // inputPrompt: 'Input Prompt',
    // output: 'Output',
    // group: 'Group',
    // textUpdater: 'Text Updater',
    // formGroup: 'Form Group',
    // openAi_Func: 'Open AI Function',
    // api: 'API',
    // gmail: 'Gmail',
    // vectorDb: 'Vector DB',
    chain: 'Chain',
    action: 'Action',
    tools: 'Tools',
    webhook: 'Hook',
    websocket: 'Socket',
    router: 'Router',
    schedule: 'Schedule',
    delay: 'Delay',
    http: 'HTTP',
    code: 'Code',
    // discord: 'Discord', 
    openAi: 'GPT',
    
};

const nodeDescriptions = {
  chain: 
    <div className='m-4 tippy-node'>
        <h1 className='text-xl font-bold'>Chain </h1>
        <p>Drag and drop a chain node on to the canvas to select the chain you want to use.</p>
        <img src='./ChainNodeScreenshot.png'></img>
    </div>,
  action: 
    <div className='m-4 tippy-node'>
        <h1 className='text-xl font-bold'>Action </h1>
        <p>Drag and drop an action to make an action (transfer, xTransfer, Swap, etc.).</p>
        <img className='action-image'src='./ActionNodeScreenshot.png'></img>
    </div>,
   tools: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Tools (coming soon) </h1>
      <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
    </div>,
  webhook: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Webhook (coming soon) </h1>
      <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
    websocket: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Websocket (coming soon) </h1>
      <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
  router: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Router (coming soon) </h1>
      <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
  schedule: 
  <div className='m-4 tippy-node'>
    <h1 className='text-xl font-bold '>Schedule (coming soon) </h1>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
</div>,
delay: 
<div className='m-4 tippy-node'>
  <h1 className='text-xl font-bold '>Delay (coming soon) </h1>
  <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
</div>,
http: 
<div className='m-4 tippy-node'>
  <h1 className='text-xl font-bold '>HTTP Request (coming soon) </h1>
  <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
</div>,
code: 
<div className='m-4 tippy-node'>
  <div className='flex justify-between'>
  <h1 className='text-xl font-bold '>Custom Code (coming soon) </h1>
  <CodeIcon className='h-6 w-6 ml-3'fillColor='black' />

  </div>
  <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>

</div>,
discord: 
<div className='m-4 tippy-node'>
  <h1 className='text-xl font-bold '>Discord (coming soon) </h1>
  <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
</div>,
openAi: 
<div className='m-4 tippy-node'>
  <h1 className='text-xl font-bold '>Open AI (coming soon) </h1>
  <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
</div>
}

const Toolbar = () => {
  const { theme } = useContext(ThemeContext);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const ToolsPopoverContent = () => {
    return (
        <div className='flex flex-col'>
            <Tippy content={nodeDescriptions.webhook}>
                <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, 'webhook')} draggable>
                    <WebhookIcon />
                    <span>Webhook</span>
                </div>
            </Tippy>
            <Tippy content={nodeDescriptions.router}>
                <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, 'router')} draggable>
                    <RouterIcon />
                    <span>Router</span>
                </div>
            </Tippy>
            <Tippy content={nodeDescriptions.router}>
                <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, 'delay')} draggable>
                    <DelayIcon />
                    <span>Delay</span>
                </div>
            </Tippy>
            <Tippy content={nodeDescriptions.router}>
                <div className={`toolbar-icon ${theme}`} onDragStart={(event) => onDragStart(event, 'schedule')} draggable>
                    <ScheduleIcon />
                    <span>Schedule</span>
                </div>
            </Tippy>
        </div>
    );
};

  const renderNode = (nodeKey) => {
    let IconComponent;
    if (nodeKey === 'chain') {
      IconComponent = <ChainIcon />;
    } else if (nodeKey === 'action') {
      IconComponent = <ActionIcon />;
    } else if (nodeKey === 'tools') {
      IconComponent = <ToolsIcon />;
    // } else if (nodeKey === 'tools') {
    //   return (
    //       <Tippy placement="bottom" theme="light" interactive={true} content={<ToolsPopoverContent />}>
    //           <div className={`toolbar-icon ${theme}`}>
    //               <ToolsIcon />
    //               <span>{nodeNames[nodeKey]}</span>
    //           </div>
    //       </Tippy>
    //   );
  } else if (nodeKey === 'router') {
      IconComponent = <RouterIcon />;
    } else if (nodeKey === 'webhook') {
      IconComponent = <WebhookIcon />;
    } else if (nodeKey === 'websocket') {
      IconComponent = <WebsocketIcon />;
    }else if (nodeKey === 'schedule') {
      IconComponent = <ScheduleIcon />;
    } else if (nodeKey === 'delay') {
      IconComponent = <DelayIcon />;
    } else if (nodeKey === 'http') {
      IconComponent = <HttpIcon />;
    } else if (nodeKey === 'code') {
      IconComponent = <CodeIcon />;
    } 
    else if (nodeKey === 'discord') {
      IconComponent = <DiscordIcon className='h-6 w-6' fillColor='white' />;
    } 
    else if (nodeKey === 'openAi') {
      IconComponent = <OpenAIIcon />;
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
    </div>
  );
};

export default Toolbar;
