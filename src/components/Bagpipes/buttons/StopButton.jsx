// @ts-nocheck
import React from 'react';
import { StopIcon } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Buttons.scss';
import Button from './Button.jsx';
import { tippyDescriptions}  from './tippyDescriptions';

const StopButton = ({ stopScenario }) => {
    return (
        <Tippy theme='light' placement='bottom'  interactive={true}  content={tippyDescriptions.stopScenario}>
            <button 
                className="top-bar-buttons stop-button flex items-center" 
                onClick={stopScenario} 
                style={{ zIndex: 1000 }}
            >
            
            <StopIcon  />

            </button>
        </Tippy>
    );
}

export default StopButton;