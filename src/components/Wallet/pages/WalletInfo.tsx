// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet } from '@subwallet/wallet-connect/types';
import React, { useContext } from 'react';

import AccountList from '../components/AccountList';
import WalletMetadata from '../components/WalletMetadata';
import { WalletContext } from '../contexts';

import './WalletInfo.scss' ;

function WalletInfo (): React.ReactElement {
  const walletContext = useContext(WalletContext);

  const wallet = walletContext.wallet || walletContext.evmWallet;

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
    <div>
          <img
            alt={wallet?.logo?.alt}
            className={'wallet-logo'}
            src={wallet?.logo?.src}
          />
        </div>
        <div className={'wallet-title'}>
          {wallet?.title}
        </div>
      <div className='wallet-info-page__title'>Version: {(walletContext?.wallet as Wallet)?.extension?.version}</div>
      <div className='wallet-info-page__text wallet-info-page__account-list'>Account List</div>
      <AccountList />
      <div className='wallet-info-page__text'>Metadata</div>
      <WalletMetadata />
    </div>
  </div>;
}

export default WalletInfo;
