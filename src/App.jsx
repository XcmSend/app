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
import ReactTestFlow from './ReactTestFlow';


import WalletInfo from './components/Wallet/pages/WalletInfo';

import initializeKeyring from './services/initializeKeyring';

import './App.scss';
import { Socket } from 'socket.io-client';


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



  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);
    console.log("[socket] Socket initialized");

    return () => {
      newSocket.disconnect();
    };
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>

    <WalletContextProvider>
      <SocketContext.Provider value={socket}>
      <ConfigProvider>
      <AddressBookProvider>
          <Routes>
            <Route element={<Layout />} path='/' >
            <Route
                element={<Welcome />}
                index
              />
              <Route
                element={<Welcome />}
                path='/welcome'
              />
              <Route
                element={<WalletInfo />}
                path='/wallet-info'
              />
                  {/* <Route
                element={<Builder />}
                path='/builder'
              /> */}
                <Route
                element={<BagpipesFlowRoute />}
                path='/builder'
              />
                <Route element={<Lab />} path='/lab' />

                <Route
                element={<ReactTestFlow />}
                path='/test-flow'
              />
              {/* <Route
                element={<EvmWalletInfo />}
                path='/evm-wallet-info'
              /> */}
            </Route>
          </Routes>
          </AddressBookProvider>
          </ConfigProvider>
        </SocketContext.Provider>
    </WalletContextProvider>
    </div>
  );
}
