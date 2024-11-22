import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsIcon, ChatIcon, ProjectIcon, SocialIcon, PlaygroundIcon, LabIcon, WalletIcon, BlinkIcon } from '../../Icons/icons';
import ThemeContext from '../../../contexts/ThemeContext';
import { OpenSelectWallet, WalletContext } from '../../Wallet/contexts';


import './Sidebar.scss';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useContext(ThemeContext);
  const selectWallet = useContext(OpenSelectWallet);
  const logoSrc = theme === 'dark' ? '/logo-white.svg' : '/logo.svg';

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    selectWallet.open();
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div className={`${theme} sidebar ${isExpanded ? 'expanded' : ''}`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
      <div className="sidebar-content">
      <img src={logoSrc} className='bagpipe-logo' alt="Bagpipe Logo" />

      <div className="sidebar-items" >
 {/* Wallet */}
      <div className="sidebar-item" >
      <Link to="#" onClick={openModal}>

            <WalletIcon fillColor="#757575" />
            {isExpanded && <span className="sidebar-text">Wallet</span>}
            </Link>
        </div>


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
            {isExpanded && <span className="sidebar-text">Scenarios</span>}
          </Link>
        </div>

                {/* Blinks  */}
                <div className="sidebar-item">
          <Link to="/blink-builder">
            <BlinkIcon fillColor='#757575' />
            {isExpanded && <span className="sidebar-text">Blinks</span>}
          </Link>
        </div>

        {/* Pages */}
        <div className="sidebar-item">
          <Link to="/pages">
            <ProjectIcon fillColor='#757575' />
            {isExpanded && <span className="sidebar-text">Pages</span>}
          </Link>
        </div>

        {/* Creators */}
        <div className="sidebar-item">
          <Link to="/creators">
            <SocialIcon fillColor='#757575' />
            {isExpanded && <span className="sidebar-text">Creators</span>}
          </Link>
        </div>

        {/* Chat */}
        {/* <div className="sidebar-item">
          <Link to="/contacts">
            <ChatIcon />
            {isExpanded && <span className="sidebar-text">Contacts</span>}
          </Link>
        </div> */}

        {/* Settings */}
        <div className="sidebar-item">
          <Link to="/settings">
            <SettingsIcon />
            {isExpanded && <span className="sidebar-text">Settings</span>}
          </Link>
        </div>
        </div>  
      </div>
    </div>
  );
}

export default Sidebar;
