// @ts-nocheck
import React from 'react';
import { CloseIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { buttonDescriptions}  from './buttonDescriptions.jsx';

export const ClearButton = ({clearExtrinsic}) => {
    return (
        <Tippy  theme='light' placement='bottom'  interactive={true}  content={buttonDescriptions.newFlow}>
            <button 
                className="top-bar-buttons" 
                onClick={clearExtrinsic}
            >
            <CloseIcon />

            </button>
            
        </Tippy>
    );
}

export default ClearButton;

