// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {Button} from 'antd';
import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenSelectWallet, WalletContext } from '../contexts';

import './styles/Welcome.scss' ;

function Welcome (): React.ReactElement {
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletContext.wallet && walletContext.walletType === 'substrate') {
      navigate('/wallet-info');
    } else if (walletContext.evmWallet && walletContext.walletType === 'evm') {
      navigate('/evm-wallet-info');
    }
  }, [navigate, walletContext]);



  return (<div className={'welcome-wrapper'}>
    <div className={'welcome-content'}>
      <div className='welcome-content__text'>Do you pipe?</div>
      <Button
        className='xcm-send-btn xcm-send-btn-normal-size'
        onClick={
            selectWallet.open}
      >Let's play...</Button>
    </div>
  </div>);
}

export default Welcome;
