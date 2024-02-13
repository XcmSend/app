// Copyright 2019-2023 @bagpipes/xcm-send authors & contributors
// Bagpipes license, read license.md 
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import SocketContext from './contexts/SocketContext';
import { AddressBookProvider } from './contexts/AddressBookContext';
import initializeKeyring from './services/initializeKeyring';
import './App.scss';
import { Socket } from 'socket.io-client';
import ThemeProvider from './components/Theme/ThemeProvider';
import { WalletContext } from './components/Wallet/contexts';
import ThemeContext from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Bagpipes/Sidebar/Sidebar';
import MainLayout from './components/MainLayout/MainLayout';
import SelectWalletModal from './components/Wallet/components/SelectWalletModal';
import { WalletContextProvider } from './components/Wallet/providers/WalletContextProvider';
import 'tippy.js/dist/tippy.css';
import 'antd/dist/antd.css';
import { TippyProvider, PanelTippyProvider} from './contexts/tooltips/TippyContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App () {
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();
  
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

    // useEffect(() => {
    //   if (!walletContext.wallet) {
    //     navigate('/welcome');
    //   }
    // }, [navigate, walletContext]);

    return (
      <ThemeProvider value={{ theme: 'dark' }}>
        <DndProvider backend={HTML5Backend}>
          <WalletContextProvider>
            <SocketContext.Provider value={socket}>
              <ConfigProvider>
                <AddressBookProvider>
                  <TippyProvider>
                  <PanelTippyProvider>

                  <div className='absolute top-0 left-0'>
                </div>
                <Header open={true} />

                {/* <Header open={walletContext.wallet || walletContext.evmWallet} /> */}

              <div className='main-container'>
                <Sidebar />
                <MainLayout theme={'dark'} />
                </div>
                {/* <SelectWalletModal theme={'dark'} /> */}
                <SelectWalletModal />
                </PanelTippyProvider>
                </TippyProvider> 
              </AddressBookProvider>
              </ConfigProvider>
            </SocketContext.Provider>
          </WalletContextProvider>
        </DndProvider>
      </ThemeProvider>
    );
  }

  export default App;
  
