import React, { useContext } from 'react';
import { WalletContext, OpenSelectWallet } from '../Wallet/contexts';
import { WalletIcon } from '../Icons/icons';
import './WalletWidget.scss';
import { title } from 'process';

interface WalletWidgetProps {
  showAsButton?: boolean;
}


function WalletWidget({ showAsButton = true }: WalletWidgetProps): React.ReactElement {
  const { open: openSelectWallet } = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);

  const wallet = walletContext.wallet || walletContext.evmWallet;

  const walletTitle = wallet ? wallet.title : 'Connect';
  const walletLogoSrc = wallet?.logo?.src;
  const status = walletContext.status;

console.log("WalletWidget", walletTitle, walletLogoSrc, status);

  const displayStatus = () => {
    console.log("displayStatus", status);
    switch (status) {
      case 'authorizing':
        return 'Authorizing...';
      case 'signing':
        return 'Awaiting Signature...';
      case 'sending':
        return 'Sending Transaction...';
      case 'success':
        return 'Transaction Successful';
      case 'error':
        return 'Error Occurred';
      case 'cancelled':
        return 'Transaction Cancelled';
      default:
        return '';
    }
  };

  if (!showAsButton) {
    // Naked mode, only display the icon
    return (
      <button onClick={openSelectWallet} className="buttonIcon">
        <span className="icon-and-text">
          <span className="">
            {walletLogoSrc ? (
              <img src={walletLogoSrc} alt={walletTitle} className="wallet-logo-small" />
            ) : (
              <WalletIcon className="h-5 w-5" fillColor="white" />
            )}
          </span>
        </span>   
      </button>
    );
  }


  return (
    <div className="widget-container">
      <button onClick={openSelectWallet} className="widget-btn items-center mb-4">
        <span className="icon-and-text">
          <span className="icon">
            {walletLogoSrc ? (
              <img src={walletLogoSrc} alt={walletTitle} className="wallet-logo-small" />
            ) : (
              <WalletIcon className="h-5 w-5" fillColor="black" />
            )}
          </span>
          <span className="text">
         
            <span className="connect">{walletTitle}</span>
          
            {status !== 'connected' && status !== 'disconnected' && (
              <span className="status">{displayStatus()}</span>
            )}
          </span>
        </span>
      </button>
    </div>
  );
}

export default WalletWidget;
