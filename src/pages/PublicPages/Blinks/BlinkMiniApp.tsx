import React, { useState, useContext, useEffect } from 'react';
import type { BlinkMetadata} from './types';
import { WalletContext } from '../../../components/Wallet/contexts';
import { getAssetBalanceForChain } from '../../../Chains/Helpers/AssetHelper';
import { listChains} from '../../../Chains/ChainsInfo';
import { Dropdown, message, Space, Tooltip, Typography } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import CreatorIdentity from './CreatorIdentity';
import { broadcastToChain } from '../../../Chains/api/broadcastToChain';
import { createCallParams } from './executeBlink/createCallParams';
import toast  from 'react-hot-toast';
import ChainRpcService from '../../../services/ChainRpcService';
import './Blinks.scss';
import WalletWidget from '../../../components/WalletWidget/WalletWidget';
import { Button } from 'antd';
import { BlinkIcon } from '../../../components/Icons/icons';

const { Link, Text } = Typography;

export interface BlinkViewerProps {
  action: BlinkMetadata<"action">;
  showConnectWallet?: boolean;
  generatedUrl?: string;
}


const BlinkMiniApp: React.FC<BlinkViewerProps> = ({ action, showConnectWallet=false, generatedUrl }) => {

console.log('BlinkMiniApp action:', action);
  let formData = action;

  const walletContext = useContext(WalletContext);
  console.log('BlinkMiniApp walletContext:', walletContext);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [chainSymbol, setChainSymbol] = useState('');
  const [balance, setBalance] = useState(null);
  const [selectedSenderAddress, setSelectedSenderAddress] = useState(formData?.selectedUserAddress || walletContext.accounts[0]?.address || '');
  const [selectedSenderAddressName, setSelectedSenderAddressName] = useState(formData?.selectedUserAddressName || walletContext.accounts[0]?.name || '');
  const [chain, setChain] = useState(null);

  // const [selectedCreatorAccount, setSelectedCreatorAccount] = useState(formData?.selectedCreatorAccount || null);
  let selectedCreatorAccount = formData?.selectedCreatorAccount || null;

  useEffect(() => {
    selectedCreatorAccount = formData?.selectedCreatorAccount || null;
  }, [formData?.selectedCreatorAccount]);

  useEffect(() => {
    console.log('BlinkMiniApp useEffect selectedSenderAddress:', selectedSenderAddress, 'formData:', formData);
    const controller = new AbortController();
    const signal = controller.signal;

    if (selectedSenderAddress && formData.selectedChain) {
      console.log('BlinkMiniApp useEffect fetchBalance selectedSenderAddress:', selectedSenderAddress, 'formData:', formData);
      fetchBalance(signal);
    }
    return () => controller.abort();
  }, [selectedSenderAddress]);

  useEffect(() => {
    // we should fetch chainInfo from listChains()
    const chainsArray = Object.values(listChains()); // Convert to array if originally an object
    const chain = chainsArray.find(c => c.name.toLowerCase() === formData?.selectedChain?.toLowerCase());
    setChain(chain);

      }, [formData?.selectedChain]);
 
  const fetchBalance = async (signal) => {
    // console.log('getAssetBalanceForChain fetchBalance address:', address, 'chain:', chain);
    // if (!address || !chain) return;
    const chainKey = formData?.selectedChain;
    setIsFetchingBalance(true);
    const chainsArray = Object.values(listChains()); // Convert to array if originally an object
    const chain = chainsArray.find(c => c.name.toLowerCase() === chainKey.toLowerCase());
    console.log('fetchBalance chain:', chain);
    setChainSymbol(chain.symbol || '');
    console.log('fetchBalance chain symbol:', chain.symbol);
      if (!chain) {
      console.error("No chain information available for:", chainKey);
      return;
    }
    try {
      const fetchedBalance = await getAssetBalanceForChain(formData?.selectedChain, 0, selectedSenderAddress);
      setBalance(fetchedBalance);
      if (!signal.aborted) {
        setBalance(fetchedBalance);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error("Failed to fetch balance", error);
      }
    } finally {
      if (!signal.aborted) {
        setIsFetchingBalance(false);
      }
    }
  };

  const handleUserButtonClick = (e) => {
    message.info(`Selected Address: ${selectedSenderAddress}`);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selected = walletContext.accounts.find(acc => acc.address === e.key);
    // setSelectedCreatorAccount(selected || null);
    setSelectedSenderAddress(selected?.address || '');
    setSelectedSenderAddressName(selected?.name || '');
    message.info(`Selected Address: ${selected?.address || ''}`);
    // Fetch balance for the selected address
    // fetchBalance(selected?.address);

    // we need the 

  // saveBlinkMetadata(activeBlinksId, {...formData, selectedSenderAddress: selected?.address, selectedSenderAddressName: selected?.name});

};
const renderInfoMessage = () => (
  <div className="info-message p-1 text-sm">
    <Text type="secondary">
      Want to add connected account? Visit the{' '}
      <Link href={generatedUrl} target="_blank" rel="noopener noreferrer">
        Blink URL
      </Link>{' '}
      directly, or navigate to your extension settings.
    </Text>
  </div>
);

// Create a menu items array based on wallet accounts
const accountItems: MenuProps['items'] = walletContext.accounts.map(acc => ({
  label: (
    <div className="flex items-center">
      <UserOutlined style={{ marginRight: 8 }} />
      <span>{`${acc.name} (${acc.address})`}</span>
    </div>
  ),
  key: acc.address,
}));

// Append a divider and the informational message to the menu items
const items: MenuProps['items'] = [
  {
    type: 'divider',
  },
  {
    key: 'info-message',
    label: renderInfoMessage(),
    disabled: false, // Disable click on this item
  },
  ...accountItems,

];


const menuProps = {
  items,
  
  onClick: handleMenuClick,
};


  const renderAddressBox = () => {
    
    if (!walletContext || walletContext.accounts.length === 0) {
      return <div className='connect-message '>Please <span className=''><a className='connectAnchor' href=''>connect</a></span> Wallet.</div>;
    }
    return (
      <>
      <Space wrap>
      <Dropdown.Button
        menu={menuProps}
        onClick={handleUserButtonClick}
        className="custom-dropdown-button"
        icon={<UserOutlined />}
        buttonsRender={([rightButton, leftButton]) => [
          <Tooltip title={renderCustomContent()} color={'white'} key="leftButton">
             {leftButton}
          </Tooltip>,
          React.cloneElement(rightButton as React.ReactElement<any, string>, { loading: isFetchingBalance }),
        ]}
            >
      {selectedSenderAddress ? (
        <span className='account-info '>

          <span className="font-bold">{selectedSenderAddressName}</span>
          {/* {' - '}
          <span className="font-semibold">{balance?.total} {chainSymbol}</span>  */}
          <span className="text-gray-600"> {selectedSenderAddress.slice(0, 4)}...{selectedSenderAddress.slice(-4)}</span>
        </span>
      ) : 'Select an Account'}

      </Dropdown.Button>
      
    </Space>
    
    </>
    );
  };

  // const renderInfoMessage = (
  //   <div className="info-message mt-2 p-2 bg-gray-100 rounded">
  //   If you want to add a connected account, please visit the <a href="https://blink.url" className="text-blue-500 underline">Blink URL</a> directly or navigate to your extension settings.
  // </div>
  // );

  const renderCustomContent = () => (
    <>
    <div className="bg-white text-xss tippy-chain flex flex-wrap p-1">
    <div className="w-1/2 font-semibold">Available:</div> 
    <div className="w-1/2 font-semibold">{balance?.free} {chainSymbol}</div>
    <div className="w-1/2 font-semibold">Reserved:</div> 
    <div className="w-1/2">{balance?.reserved } {chainSymbol}</div>
    <div className="w-1/2 font-semibold">Total:</div> 
    <div className="w-1/2">{balance?.total} {chainSymbol}</div>
</div>
</>
  );
  const handleAddressChange = (event) => {
    setSelectedSenderAddress(event.target.value);
  };


  const handleInputChange = (index, paramName, value) => {
    const newLinks = [...action.links.actions];
    const parameters = newLinks[index].parameters.map(param => {
      if (param.name === paramName) {
        return { ...param, value };
      }
      return param;
    });
  
    newLinks[index] = {...newLinks[index], parameters};
   
    console.log('New links:', newLinks);

      formData = {...formData, links: { ...formData.links, actions: newLinks }};
    // saveBlinkMetadata(activeBlinksId, {
    //   ...formData,
    //   links: { ...formData.links, actions: newLinks }
    // });
  };




const executeTransaction = async (formData, chain) => {
  try {
    console.log('executeTransaction formData:', formData);
    const methodData = createCallParams(formData, chain.token_decimals);
    console.log('executeTransaction methodData:', methodData);
    const signedExtrinsic = await ChainRpcService.executeChainTxBlinkRenderedMethod({
      chainKey: formData?.selectedChain,
      palletName: methodData.section, 
      methodName: methodData.method,
      params: methodData.arguments,
      signerAddress: selectedSenderAddress,
      signer: walletContext?.wallet?.signer
      
    });

    // Now broadcast to chain
    await broadcastToChain(formData.selectedChain, signedExtrinsic, {
      onInBlock: (blockHash: any) => {
        toast.success(`Transaction included at blockHash: ${blockHash}`);
      },
      onFinalized: (blockHash: any) => {
        toast.success(`Transaction finalized at blockHash: ${blockHash}`);
      },
      onError: (error: { message: any; }) => {
        toast.error(`Transaction failed: ${error.message}`);
      }
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    toast.error(`Error executing transaction: ${error.message}`);
  }
};



useEffect(() => {
  // Listener for messages from parent
  const handleMessage = (event: MessageEvent) => {
    // Validate the origin
    if (event.origin !== 'https://x.com') return; // Replace with actual parent origin

    if (event.data && event.data.type === 'WALLET_CONNECT_RESPONSE') {
      console.log('Received wallet data from parent:', event.data.payload);
      const { wallet, walletType } = event.data.payload;
      walletContext.setWallet(wallet, walletType);
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, [walletContext]);

// Request wallet connection on mount
useEffect(() => {
  window.parent.postMessage({
    type: 'WALLET_CONNECT_REQUEST',
    payload: { /* any necessary data */ }
  }, 'https://x.com'); // Replace with actual parent origin
}, []);

  
  return (   
    <div className='blinkViewer'>
      <div className='relative'>
      <div className='miniAppMenu absolute top-0 right-0 p-1'>
      <Button
            icon={<BlinkIcon className='h-5 w-5' fillColor='white' />}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(generatedUrl);
                toast.success(`Copied ${generatedUrl} to clipboard`);
              } catch (err) {
                toast.error('Failed to copy');
                console.error('Failed to copy text: ', err);
              }
            }}
            type='primary'
            style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
            className='share-button bg-black text-white'
        >
          {/* <a className='blink-url' href={generatedUrl} target="_blank" rel="noopener noreferrer">
                  {generatedUrl}
          </a> */}
        </Button>
                 {/* <a className='' href={generatedUrl} target="_blank" rel="noopener noreferrer">
                      {generatedUrl}
                    </a> */}
        <WalletWidget showAsButton={false} />
      </div>
      {showConnectWallet &&  <WalletWidget showAsButton={true} /> }
        {action.icon && (
          <img src={action.icon} alt={action.title} className='blink-icon' />
        )}
        <div className="blink-container items-center">
    

          <div className="link-section">
     
          {renderAddressBox()}
            {/* <BlinkIcon className="icon ml-0 mr-0 h-3 w-3" fillColor="grey" />
            <span className="blink-title">https://blink.polkadot.network/</span> */}
          </div>
          <div className="creator-section">
            <CreatorIdentity chain={formData?.selectedChain} accountId={selectedCreatorAccount} />
          </div>
        </div>

        <h1 className=''>{action.title}</h1>
        <p>{action.description}</p>
        {/* <button disabled={action.disabled}>{action.label}</button> */}
    
        <div className='action-group-style'>
          {action?.links?.actions?.map((linkedAction, index) => (
            <div key={index} className="action-wrapper">
           
           {linkedAction.parameters.filter(param => param.userEditable).map((param, paramIndex) => (
            <>
            {/* <div className='label-style'>{param.label}</div> */}
              <input 
                className='action-input'
                key={paramIndex} 
                placeholder={param.label} 
                defaultValue={param.value || ''}                 
                type={param.type === 'u128' ? 'number' : 'text'}
                onChange={(e) => handleInputChange(index, param.name, e.target.value)}
                min={0} 
                step = {0.5}
              />
              </>
            ))}

            <button className='action-button'onClick={() => executeTransaction(formData, chain)}>
              {linkedAction.label}
            </button>
          </div>
        ))}
      </div>

        {action.error && <p style={{ color: 'red' }}>{action.error.message}</p>}
      </div>
      </div>

  );
};

export default BlinkMiniApp;

