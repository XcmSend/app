// Copyright 2019-2023 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactFlow from 'reactflow';

// import EvmWalletInfo from './components/Wallet/pages/EvmWalletInfo';
import { WalletContextProvider } from './components/Wallet/providers/WalletContextProvider';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Wallet/components/Layout';
import Welcome from './components/Wallet/components/Welcome';
import Builder from './components/Wallet/components/Builder';
import ReactTestFlow from './ReactTestFlow';
// import BagpipesFlow from './components/Bagpipes/BagpipesFlow';

import WalletInfo from './components/Wallet/pages/WalletInfo';

import './App.scss';

// Add new example wallet
// doAddWallet();




export function App () {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>

    <WalletContextProvider>
      <HashRouter>
        <Routes>
          <Route
            element={<Layout />}
            path='/'
          >
          
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
                <Route
              element={<Builder />}
              path='/builder'
            />
               {/* <Route
              element={<BagpipesFlow />}
              path='/bagpipes'
            /> */}
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
      </HashRouter>
    </WalletContextProvider>
    </div>
  );
}
