// @ts-nocheck
import React from 'react';
import { CloseIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { tippyDescriptions}  from './tippyDescriptions.jsx';

export const ClearButton = ({clearExtrinsic}) => {
    return (
        <Tippy  theme='light' placement='bottom'  interactive={true}  content={tippyDescriptions.newFlow}>
            <button 
                className="top-bar-buttons" 
                onClick={clearExtrinsic}
            >
            <CloseIcon fillColor={'#007bff'} />

            </button>
            
        </Tippy>
    );
}

export default ClearButton;

