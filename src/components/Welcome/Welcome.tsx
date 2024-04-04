// Copyright 2024 Bagpipes license, see LICENSE.md 


import { Button } from 'antd';
import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenSelectWallet, WalletContext } from '../Wallet/contexts';

import './Welcome.scss' ;

function Welcome () {
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(walletContext); 

    if (walletContext.wallet && walletContext.walletType === 'substrate') {
      navigate('/builder');
    } else if (walletContext.evmWallet && walletContext.walletType === 'evm') {
      navigate('/evm-wallet-info');
    }
  }, [navigate, walletContext]);



  return (<div className={'welcome-wrapper'}>
    <div className={'welcome-content'}>
      <div className='welcome-content__text'>Wanna bagpipe?</div>
      <Button
        className='xcm-send-btn xcm-send-btn-normal-size'
        onClick={ selectWallet.open}
      >Let's play...
      </Button>
    </div>
  </div>);
}

export default Welcome;
