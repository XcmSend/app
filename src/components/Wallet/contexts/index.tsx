// Copyright 2019-2023 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Wallet, WalletAccount } from '@subwallet/wallet-connect/types';
import { EvmWallet } from '@subwallet/wallet-connect/types';

export interface WalletContextInterface {
  wallet?: Wallet,
  evmWallet?: EvmWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
  walletType: 'substrate'|'evm';
}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet: any, walletType: 'substrate'|'evm') => {},
  walletType: 'substrate'
});

interface OpenSelectWalletInterface {
  isOpen: boolean,
  open: () => void
  close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {}
});
