// Copyright 2024 Bagpipes license, see LICENSE.md 


import { Button } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OpenSelectWallet, WalletContext } from './Wallet/contexts';
import ThemeContext from '../contexts/ThemeContext';
import { WalletIcon } from './Icons/icons'
import ThemeToggleButton from './Theme/ThemeToggleButton'
import'./styles/Header.scss';

interface Props {
  open?: boolean;
  theme: string;

}

function Header ({ open }: Props): React.ReactElement<Props> {
  const navigate = useNavigate();  
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);
  const wallet = walletContext.wallet || walletContext.evmWallet;
  const { theme } = React.useContext(ThemeContext);
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
      navigate('/builder') ;
    };
    // Function to navigate to /builder
    const goToParachains = () => {
    navigate('/parachains') ;
    };

          // Function to navigate to /builder
    const goToLab = () => {
      navigate('/lab');
    };

      return (
        <header className={`header header-wrapper ${theme}`}>
          <div className={'boxed-container'}>
            <div className={'wallet-header-content flex justify-left'}>
              <img src={logoSrc} className='bagpipe-logo' alt="Bagpipe Logo" />
  
              {/* <Button
                className='xcm-send-btn  button-header'
                onClick={goToBagpipes}
                type={'primary'}
              >
                <span className='button-header-text'>Builder</span>
              </Button>
              <Button
                className='xcm-send-btn  button-header'
                onClick={goToParachains}
                type={'primary'}
              >
                <span className='button-header-text'>Parachains</span>
              </Button>
              <Button
                className='xcm-send-btn xcm-send-btn-small-size button-header'
                onClick={goToLab}
                type={'primary'}
                >
                <span className='button-header-text'>Lab</span>
              </Button> */}
              <button
                className='xcm-send-btn-wallet'
                onClick={selectWallet.open}
                // type={'primary'}
              >
                <span className='mr-2'><WalletIcon /></span>Wallet
             </button>
              <div className="absolute top-0 right-0">
              <ThemeToggleButton />
        </div> 
          </div>
            </div>
        </header>
      );
      
}

export default Header;
