import React from 'react';
import { CreateUI } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { buttonDescriptions }  from './buttonDescriptions';
import './Buttons.scss';

export const CreateUiButton = ({ onCreateUi }) => {



  return (
    <Tippy theme='light' placement='bottom' interactive={true} content={
    <div className='bg-white m-4 tippy-inner'>
      <div className='flex justify-between'>
    <h1 className="text-xl font-bold">Create UI (coming soon)</h1>

    <span className='h-7 w-7'><CreateUI className='h-6 w-6' fillColor='black'/></span>
    </div>
    <p>Create a UI from the flow you built then share it with others.</p>
    <img className='' src='/bagpipe-UI.jpg'></img>
    </div>
    }>
    <button 
      className="top-bar-buttons flex items-center" 
      onClick={onCreateUi} 
    >
      
      <CreateUI className='h-5 w-5' fillColor='#007bff' />      
      {/* <span className='ml-2'>Create UI</span> */}
    </button>
    </Tippy>
  );
}

export default CreateUiButton;