// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Switch } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { WalletContext } from '../contexts';
import ThemeContext from '../../../contexts/ThemeContext';
import SelectWalletModal from './SelectWalletModal';
import Header from '../../Header';

import './styles/Layout.scss';

function Layout() {
  const walletContext = useContext(WalletContext);
  const [theme, setTheme] = useLocalStorage('bagpipes-theme', 'light');
  const location = useLocation(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome');
    }
    
    const isDarkMode = theme === 'dark';
    document.body.style.backgroundColor = isDarkMode ? '#020412' : '#FFF';
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [theme, navigate, walletContext]);

  const handleThemeChange = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [setTheme, theme]);

  const isCreateRoute = location.pathname === '/create';


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className='main-layout'>
        <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
          {/* Conditionally render the theme switch only if it's not the create route */}
          {!isCreateRoute && (
            <Switch
              checkedChildren='Light'
              className={(walletContext.wallet || walletContext.evmWallet) ? 'bagpipe-switch-theme with-header' : 'bagpipe-switch-theme'}
              defaultChecked={theme === 'dark'}
              onChange={handleThemeChange}
              unCheckedChildren='Dark'
            />
          )}
          {/* Conditionally render the header only if it's not the create route */}
          {!isCreateRoute && (
            <Header open={walletContext.wallet || walletContext.evmWallet} theme={theme} />
          )}
          <Outlet />
          {/* Conditionally render the modal only if it's not the create route */}
          {!isCreateRoute && (
            <SelectWalletModal theme={theme} />
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default Layout;
