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
import TransactionMain  from './components/Bagpipes/CustomNodes/transactionReview/TransactionMain';
import ReactTestFlow from './ReactTestFlow';
import WalletInfo from './components/Wallet/pages/WalletInfo';
import initializeKeyring from './services/initializeKeyring';
import Notifications from './components/Notifications';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import './App.scss';
import 'tippy.js/dist/tippy.css';
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



  // useEffect(() => {
  //   const newSocket = io("http://localhost:5001");
  //   setSocket(newSocket);
  //   console.log("[socket] Socket initialized");

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    <WalletContextProvider>
      <SocketContext.Provider value={socket}>
      <ConfigProvider>
       
        {/* <Notifications /> */}
        <AddressBookProvider>
        <Toaster
        
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 20000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button onClick={() => toast.dismiss(t.id)}>dismiss</button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster> 
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
               <Route
                element={<TransactionMain />}
                path='/transaction/review'
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
