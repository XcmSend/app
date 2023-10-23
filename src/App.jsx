// Copyright 2019-2023 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect } from 'react';
import ReactFlow from 'reactflow';

import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css'; // Import Ant Design styles

// import EvmWalletInfo from './components/Wallet/pages/EvmWalletInfo';
import { WalletContextProvider } from './components/Wallet/providers/WalletContextProvider';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import BagpipesFlowRoute from './routes/BagpipesFlowRoute';
import Lab from './pages/Lab/Lab';
import SocketContext from './contexts/SocketContext';
import { AddressBookProvider } from './contexts/AddressBookContext';
import { io } from "socket.io-client";
import Layout from './components/Wallet/components/Layout';
import Welcome from './components/Wallet/components/Welcome';
import Builder from './components/Builder';
import TransactionMain  from './components/Bagpipes/CustomNodes/TransactionReview/TransactionMain';
import ReactTestFlow from './ReactTestFlow';
import WalletInfo from './components/Wallet/pages/WalletInfo';
import initializeKeyring from './services/initializeKeyring';
import Notifications from './components/toasts/Notifications';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { useToaster } from 'react-hot-toast';
import './App.scss';
import 'tippy.js/dist/tippy.css';
import { Socket } from 'socket.io-client';
import ThemeContext from './contexts/ThemeContext';
import NodeToast from './components/toasts/NodeToast';
// import NodeNotifications from './components/toasts/NodeNotifications';
import useAppStore from './store/useAppStore';
import MainLayout from './components/MainLayout';


export function App () {

  
 
  const [socket, setSocket] = useState(null);

    async function setupKeyring() {
      try {
        await initializeKeyring();
        console.log("Keyring initialized");
      } catch (error) {
          console.error("Failed to initialize keyring:", error);
      }
    }
    setupKeyring();


    return (
      <div style={{ width: '100vw', height: '100vh' }}>
      <ThemeContext.Provider value={{ theme: 'dark' }}>
        <WalletContextProvider>
          <SocketContext.Provider value={socket}>
            <ConfigProvider>
              {/* <Toaster /> */}
                {/* <button onClick={testToast}>Show Test Toast</button>
                <button className='toast-button'onClick={() => toast("Hello World!")}>Add Toast</button> */}

              <AddressBookProvider>

              {/* <Toaster
                  containerStyle={{ position: 'absolute', ...toastPosition }} 
                  toastOptions={{
                  className: 'toast-styles',
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  }
                }}
              > 
                {(t) => (
                  <ToastBar toast={t}>
                    {({ icon, message }) => (
                      <>
                        {icon}
                        {message}
                        {t.type !== 'loading' && (
                          <button className='toast-button' onClick={() => toast.dismiss(t.id)}>dismiss</button>
                        )}
                      </>
                    )}
                  </ToastBar> 
              )}
              </Toaster> */}
 
              <MainLayout/>
            </AddressBookProvider>
            </ConfigProvider>
          </SocketContext.Provider>
        </WalletContextProvider>
        </ThemeContext.Provider>
      </div>
    );
  }
  