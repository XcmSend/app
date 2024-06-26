// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ExecutionIcon } from '../../Icons/icons.jsx';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../nodes.jsx';
import '../../../index.css';
import './Buttons.scss';
import { tippyDescriptions}  from './tippyDescriptions.jsx';
import { useAppStore } from '../hooks/index.js';
import { useNavigate } from 'react-router-dom';

import '../buttons/Buttons.scss';
import toast from 'react-hot-toast';

export const ExecutionsButton = ({ scenarioId}) => {
    const navigate = useNavigate();

    const { scenarios } = useAppStore((state) => ({
        scenarios: state.scenarios,
      }));    
      const [templateLink, setTemplateLink] = useState('');
      const [copied, setCopied] = useState(false);
    


      return (
        <Tippy theme='light' placement='bottom' interactive={true} content={tippyDescriptions.executionsButton}>
              <button 
                    className="lab-buttons hover:bg-blue-700 flex items-center"
                    onClick={(e) => { e.stopPropagation(); navigate(`/scenario/${scenarioId}`)}}
                    >
                    <ExecutionIcon className='h-4 w-4' />
                </button>
        </Tippy>
    );
};

export default ExecutionsButton;

