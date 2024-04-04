import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsIcon, ChatIcon, PlaygroundIcon, LabIcon } from '../../Icons/icons';
import ThemeContext from '../../../contexts/ThemeContext';

import './Sidebar.scss';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${theme} sidebar`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
      <div className="sidebar-content">
        {/* Builder */}
        <div className="sidebar-item">
          <Link to="/builder">
            <PlaygroundIcon />
            {isExpanded && <span className="sidebar-text">Builder</span>}
          </Link>
        </div>

        {/* Lab */}
        <div className="sidebar-item">
          <Link to="/lab">
            <LabIcon />
            {isExpanded && <span className="sidebar-text">Lab</span>}
          </Link>
        </div>

        {/* Chat */}
        <div className="sidebar-item">
          <Link to="/contacts">
            <ChatIcon />
            {isExpanded && <span className="sidebar-text">Contacts</span>}
          </Link>
        </div>

        {/* Settings */}
        <div className="sidebar-item">
          <Link to="/settings">
            <SettingsIcon />
            {isExpanded && <span className="sidebar-text">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
