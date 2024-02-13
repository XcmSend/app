// @ts-nocheck
import React from 'react';
import { DraftIcon, PlayIcon } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Buttons.scss';
import Button from './Button.jsx';
import { buttonDescriptions}  from './buttonDescriptions';

const StartButton = ({ draftTransactions }) => {
    return (
        <Tippy theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.draft}>
        <button 
      className="start-stop-create-button flex items-center" 
      onClick={draftTransactions} 
            style={{ zIndex: 1000 }}
        >
          
            <PlayIcon />
            {/* <span className='ml-2 '>Start Draft</span> */}
            {/* Draft */}
        </button>
        </Tippy>
    );
}

export default StartButton;