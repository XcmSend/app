// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Switch } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { WalletContext } from '../contexts';
import ThemeContext from '../../../contexts/ThemeContext'
import SelectWalletModal from './SelectWalletModal';
import Header from '../../Header';

import './styles/Layout.scss';



function Layout () {
  const walletContext = useContext(WalletContext);
  const [theme, setTheme] = useLocalStorage('bagpipes-theme', 'light');
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!walletContext.wallet) {
      navigate('/welcome');
    }

    const isDark = theme === 'dark';

    document.body.style.backgroundColor = isDark ? '#020412' : '#FFF';
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [theme, navigate, walletContext]);

  const _onChangeTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
}, [setTheme, theme]);


  return (
   <ThemeContext.Provider value={{ theme, setTheme }}>
  <div className={'main-layout '}>
   
    <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
      <Switch
        checkedChildren='Light'
        className={(!!walletContext.wallet || !!walletContext.evmWallet) ? 'bagpipe-switch-theme with-header' : 'bagpipe-switch-theme'}
        defaultChecked={theme === 'dark'}
        onChange={_onChangeTheme}
        unCheckedChildren='Dark'
      />
      <Header open={!!walletContext.wallet || !!walletContext.evmWallet} theme={theme} />
      <Outlet />
      <SelectWalletModal theme={theme} />
    </div>
  </div>
  </ThemeContext.Provider>
  )

}

export default Layout;
