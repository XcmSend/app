// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Buttons.scss';
import Button from './Button.jsx';
import { buttonDescriptions}  from './buttonDescriptions';

const StartButton = ({ startScenario }) => {
    return (
        <Tippy theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.runOnce}>
            <button 
                className="top-bar-buttons start-button text-white flex items-center" 
                onClick={startScenario} 
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