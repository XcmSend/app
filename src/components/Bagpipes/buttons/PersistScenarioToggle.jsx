


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
import Toggle from '../../../components/Bagpipes/Forms/Toggle';


import '../buttons/Buttons.scss';
import toast from 'react-hot-toast';

const PersistScenarioToggle = ({ scenarioId, isToggled, onToggleChange }) => {
  const navigate = useNavigate();

  return (
    <Tippy theme='light' placement='bottom' interactive={true} content={'Toggle persist scenario'}>
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle
          title="Persist Scenario"
          isToggled={isToggled}
          onToggleChange={(checked) => onToggleChange(scenarioId, checked)}
        />
      </div>
    </Tippy>
  );
};

export default PersistScenarioToggle;
