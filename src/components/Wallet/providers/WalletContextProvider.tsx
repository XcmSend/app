// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocalStorage } from '../hooks/useLocalStorage';
import { windowReload } from '../../../utils/window';
import { getWalletBySource } from '../connect-wallet/src/dotsama/wallets';
import { getEvmWalletBySource } from '../connect-wallet/src/evm/evmWallets';
import { EvmWallet, Wallet, WalletAccount } from '../connect-wallet/src/types';
import React, { useCallback, useEffect, useState } from 'react';

import { OpenSelectWallet, WalletContext, WalletContextInterface, WalletStatus } from '../contexts';

interface Props {
  children: React.ReactElement;
}

export function WalletContextProvider ({ children }: Props) {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [walletType, setWalletType] = useLocalStorage('wallet-type', 'substrate');
  const [currentWallet, setCurrentWallet] = useState<Wallet | EvmWallet | undefined>(getWalletBySource(walletKey));
  const [isSelectWallet, setIsSelectWallet] = useState(false);
  const [isWalletSelected, setIsWalletSelected] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [status, setStatus] = useState<WalletStatus>('disconnected');


  const afterSelectWallet = useCallback(async (wallet: Wallet) => {
    try {
      const infos = await wallet.getAccounts();
      infos && setAccounts(infos);
      setStatus('connected');
      console.log('Wallet connected:', wallet);
    } catch (error) {
      console.error('Error getting accounts:', error);
      setStatus('error');
    }
  }, []);

  const selectWallet = useCallback(
    async (wallet: Wallet) => {
      setStatus('connecting');

      setCurrentWallet(wallet);

      await wallet.enable();
      setWalletKey(wallet.extensionName);
      setIsWalletSelected(true);

      await afterSelectWallet(wallet);
    },
    [afterSelectWallet, setWalletKey]
  );

  const afterSelectEvmWallet = useCallback(async (wallet: EvmWallet) => {
    try {
      await wallet?.enable();
      setStatus('connected');
    } catch (error) {
      console.error('Error enabling EVM wallet:', error);
      setStatus('error');
    }
  }, []);


  const selectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      setStatus('connecting');
      setCurrentWallet(wallet);

      try {
        await afterSelectEvmWallet(wallet);
        setWalletKey(wallet.extensionName);
        setIsWalletSelected(true);
        windowReload();
      } catch (error) {
        console.error('Error connecting to EVM wallet:', error);
        setStatus('error');
      }
    },
    [afterSelectEvmWallet, setWalletKey]
  );

  const walletContext = {
    
    wallet: getWalletBySource(walletKey),
    evmWallet: getEvmWalletBySource(walletKey),
    accounts,
    setWallet: (wallet: Wallet | EvmWallet | undefined, type: 'substrate' | 'evm') => {
      if (type === 'substrate') {
        wallet && selectWallet(wallet as Wallet);
      } else {
        wallet && selectEvmWallet(wallet as EvmWallet);
      }

      wallet && setWalletType(type);
    },
    walletType,
    isWalletSelected,
    status,
    setStatus,
  };

  const selectWalletContext = {
    isOpen: isSelectWallet,
    open: () => {
      setIsSelectWallet(true);
    },
    close: () => {
      setIsSelectWallet(false);
    },
  };

  useEffect(() => {
    if (walletType === 'substrate') {
      console.log('Wallet key:', walletKey);
      const wallet = getWalletBySource(walletKey);
      

      if (wallet && wallet.installed) {
        console.log('Wallet is installed:', wallet);
        setStatus('connecting');
        setTimeout(() => {
          void afterSelectWallet(wallet)
            .then(() => {
              // Already set status in afterSelectWallet
            })
            .catch((error) => {
              console.error('Error connecting to wallet in useEffect:', error);
              setStatus('error');
            });
        }, 150);
      }
    } else {
      const evmWallet = getEvmWalletBySource(walletKey);

      if (evmWallet) {
        setStatus('connecting');
        evmWallet.isReady
          .then(() => {
            afterSelectEvmWallet(evmWallet)
              .then(() => {
                // Already set status in afterSelectEvmWallet
              })
              .catch((error) => {
                console.error('Error connecting to EVM wallet in useEffect:', error);
                setStatus('error');
              });
          })
          .catch((error) => {
            console.error('EVM wallet is not ready:', error);
            setStatus('error');
          });
      }
    }
  }, [afterSelectEvmWallet, afterSelectWallet, walletKey, walletType]);

  return <WalletContext.Provider value={walletContext as WalletContextInterface}>
    <OpenSelectWallet.Provider value={selectWalletContext}>
      {children}
    </OpenSelectWallet.Provider>
  </WalletContext.Provider>;
}