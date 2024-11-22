// Copyright 2019-2023 @subwallet authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Wallet, WalletAccount } from '../connect-wallet/src/types';
import { EvmWallet } from '../connect-wallet/src/types';


export type WalletStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'authorizing'
  | 'signing'
  | 'signed'
  | 'sending'
  | 'success'
  | 'error'
  | 'cancelled';

export interface WalletContextInterface {
  wallet?: Wallet,
  evmWallet?: EvmWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
  walletType: 'substrate'|'evm';
  isWalletSelected: boolean;
  status: WalletStatus;
  setStatus: (status: WalletStatus) => void;


}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet: any, walletType: 'substrate'|'evm') => {},
  walletType: 'substrate',
  isWalletSelected: false,
  status: 'disconnected',
  setStatus: () => {},
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
