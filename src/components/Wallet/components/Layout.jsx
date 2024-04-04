// Copyright 2019-2023 @subwallet authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { WalletContext } from '../contexts';
import ThemeContext from '../../../contexts/ThemeContext';
import SelectWalletModal from './SelectWalletModal';
import Header from '../../Header';
import ThemeToggleButton from '../../Theme/ThemeToggleButton';
import './styles/Layout.scss';
import '../../../index.css'

function Layout() {
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome');
    }
    
  }, [navigate, walletContext]);

  return (
      <div className='main-layout'>
        <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
           
            <Header open={walletContext.wallet || walletContext.evmWallet} theme={theme} />
            <Outlet />
            <SelectWalletModal theme={theme} />
            
        </div>
      </div>
      
  );
}

export default Layout;
