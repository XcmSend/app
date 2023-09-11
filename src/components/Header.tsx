// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { OpenSelectWallet, WalletContext } from './Wallet/contexts';

import'./styles/Header.scss';

interface Props {
  open?: boolean;
  theme: string;

}



function Header ({ open, theme }: Props): React.ReactElement<Props> {
  const navigate = useNavigate();  // Add this line to get the navigate function
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);

  const wallet = walletContext.wallet || walletContext.evmWallet;
  const logoSrc = theme === 'dark' ? '/logo-white.svg' : '/logo.svg';

  if (!open) {
    return (<></>);
  }

    // Function to navigate to /builder
    const goToBuilder = () => {
      navigate('/builder');
    };
       // Function to navigate to /builder
       const goToBagpipes = () => {
        navigate('/bagpipes') ;
      };
  

      return (
        <header className={'wallet-header-wrapper'}>
          <div className={'boxed-container'}>
            <div className={'wallet-header-content'}>
              <img src={logoSrc} className='bagpipe-logo' alt="Bagpipe Logo" />
      
                <Button
                  className='xcm-send-btn xcm-send-btn-small-size'
                  onClick={goToBuilder}
                  type={'primary'}
                >Builder</Button>
                   <Button
                  className='xcm-send-btn xcm-send-btn-small-size'
                  onClick={goToBagpipes}
                  type={'primary'}
                >Bagpipes</Button>
      
                <Button
                  className='xcm-send-btn-wallet xcm-send-btn-small-size'
                  onClick={selectWallet.open}
                  type={'primary'}
                >Select Wallet</Button>
            </div>
          </div>
        </header>
      );
      
}

export default Header;
