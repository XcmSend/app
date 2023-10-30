// Copyright 2019-2023 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import SocketContext from './contexts/SocketContext';
import { AddressBookProvider } from './contexts/AddressBookContext';
import initializeKeyring from './services/initializeKeyring';
import './App.scss';
import { Socket } from 'socket.io-client';
import ThemeContext from './contexts/ThemeContext';
import MainLayout from './components/MainLayout';
import { WalletContextProvider } from './components/Wallet/providers/WalletContextProvider';
import 'tippy.js/dist/tippy.css';
import 'antd/dist/antd.css';


export function App () {
  const [socket, setSocket] = useState(null);
  const location = useLocation();


    async function setupKeyring() {
      try {
        await initializeKeyring();
        console.log("Keyring initialized");
      } catch (error) {
          console.error("Failed to initialize keyring:", error);
      }
    }
    setupKeyring();

  
    useEffect(() => {
      console.log('location', location);
    }, [location]);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
      <ThemeContext.Provider value={{ theme: 'dark' }}>
        <WalletContextProvider>
          <SocketContext.Provider value={socket}>
            <ConfigProvider>
              <AddressBookProvider>
              <MainLayout/>
            </AddressBookProvider>
            </ConfigProvider>
          </SocketContext.Provider>
        </WalletContextProvider>
        </ThemeContext.Provider>
      </div>
    );
  }
  