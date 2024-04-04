// @ts-nocheck
import React from 'react';
import { StopIcon } from '../../Icons/icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Buttons.scss';
import Button from './Button.jsx';
import { buttonDescriptions}  from './buttonDescriptions';

const StopButton = ({ stopScenario }) => {
    return (
        <Tippy theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.stopScenario}>
            <button 
                className="top-bar-buttons stop-button flex items-center" 
                onClick={stopScenario} 
                style={{ zIndex: 1000 }}
            >
            
            <StopIcon />
            {/* <span className='ml-2 '>Start Draft</span> */}
            {/* Draft */}
            </button>
        </Tippy>
    );
}

export default StopButton;