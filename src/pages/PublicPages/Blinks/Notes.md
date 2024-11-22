// const sortedActions = [...(action?.links?.actions || [])].sort((a, b) => {
//   const typeA = a.parameters?.some(param => param.type === 'inputAmount') ? 1 : 0;
//   const typeB = b.parameters?.some(param => param.type === 'inputAmount') ? 1 : 0;
//   return typeA - typeB;
// });



        {/* {sortedActions.length > 0 && (
          <div className='button-group-style'>
            <ul>
              {sortedActions.map((linkedAction, index) => (
                <li key={index} className={linkedAction.parameters?.some(param => param.type === 'inputAmount') ? 'input-wrapper' : 'fixed-wrapper'}>
                  <button className='action-button' onClick={() => console.log('Action URL:', linkedAction.href)}>
                    {linkedAction.label}
                  </button>
                  {linkedAction.parameters?.map((param, paramIndex) => (
                    <div key={paramIndex} className={param.type === 'inputAmount' ? 'input-amount-style' : 'fixed-amount-style'}>
                      <input placeholder={param.label} defaultValue={param.name} />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )} */}











ok we have lets inputs be saved for linkedActions. 

import React, { useState, useContext, useEffect } from 'react';
import './Blinks.scss';
import { Action } from './BlinkBuilder';
import { BlinkIcon, VerificationIcon } from '../../../components/Icons/icons';
import { WalletContext } from '../../../components/Wallet/contexts';
import BalanceTippy from '../../../components/Bagpipes/Forms/PopupForms/ChainForms/ChainTxForm/BalanceTippy';
import { getAssetBalanceForChain } from '../../../Chains/Helpers/AssetHelper';
import { listChains} from '../../../Chains/ChainsInfo';
import useBlinkStore from '../../../store/useBlinkStore';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import CreatorIdentity from './CreatorIdentity';
export interface BlinkViewerProps {
  action: Action<"action">;
}

const BlinkViewer: React.FC<BlinkViewerProps> = ({ action }) => {

  const { blinks, activeBlinksId, getBlinkMetadata, saveBlinkMetadata  } = useBlinkStore(state => ({ 
    blinks: state.blinks,
    activeBlinksId: state.activeBlinksId,
    getBlinkMetadata: state.getBlinkMetadata,
    saveBlinkMetadata: state.saveBlinkMetadata, 
   
  }));


  const walletContext = useContext(WalletContext);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [chainSymbol, setChainSymbol] = useState('');
  const [balance, setBalance] = useState(null);
  const [selectedUserAddress, setSelectedUserAddress] = useState(walletContext.accounts[0]?.address || '');
  const [selectedAccount, setSelectedAccount] = useState(walletContext.accounts[0] || null);

  const formData = getBlinkMetadata(activeBlinksId);
  const creatorAddress = formData?.selectedUserAddress || 'Unknown';


  useEffect(() => {
    console.log('BlinkViewer useEffect selectedUserAddress:', selectedUserAddress, 'formData:', formData);
    const controller = new AbortController();
    const signal = controller.signal;

    if (selectedUserAddress && formData.selectedChain) {
console.log('BlinkViewer useEffect fetchBalance selectedUserAddress:', selectedUserAddress, 'formData:', formData);
    fetchBalance(signal);
    }
    return () => controller.abort();
  }, [selectedUserAddress]);
 
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
      const fetchedBalance = await getAssetBalanceForChain(formData?.selectedChain, 0, selectedUserAddress);
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

  const handleButtonClick = (e) => {
    message.info(`Selected Address: ${selectedUserAddress}`);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selected = walletContext.accounts.find(acc => acc.address === e.key);
    setSelectedAccount(selected || null);
    setSelectedUserAddress(selected?.address || '');
    message.info(`Selected Address: ${selected?.address || ''}`);
    // Fetch balance for the selected address
    // fetchBalance(selected?.address);

  saveBlinkMetadata(activeBlinksId, {...formData, selectedUserAddress: selected?.address, selectedAccount: selected});

};
 // Create a menu items array based on wallet accounts
 const items: MenuProps['items'] = walletContext.accounts.map(acc => ({
    label: `${acc.name} (${acc.address})`,
    key: acc.address,
    icon: <UserOutlined />,
  }));

const menuProps = {
  items,
  onClick: handleMenuClick,
};


  const renderAddressBox = () => {
    if (!walletContext || walletContext.accounts.length === 0) {
      return <div>No wallet accounts available. Please connect Wallet.</div>;
    }
    return (
      <Space wrap>
      <Dropdown.Button
        menu={menuProps}
        onClick={handleButtonClick}
        className="custom-dropdown-button"
        icon={<UserOutlined />}
        buttonsRender={([rightButton, leftButton]) => [
          <Tooltip title={renderCustomContent()} color={'white'} key="leftButton">
             {leftButton}
          </Tooltip>,
          React.cloneElement(rightButton as React.ReactElement<any, string>, { loading: isFetchingBalance }),
        ]}
            >
      {selectedUserAddress ? (
        <span className='account-info'>
          <span className="font-bold">{selectedAccount.name}</span>
          {/* {' - '}
          <span className="font-semibold">{balance?.total} {chainSymbol}</span>  */}
          <span className="text-gray-600"> {selectedUserAddress.slice(0, 4)}...{selectedUserAddress.slice(-4)}</span>
        </span>
      ) : 'Select an Account'}

      </Dropdown.Button>
    </Space>
    );
  };

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
    setSelectedUserAddress(event.target.value);
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

    saveBlinkMetadata(activeBlinksId, {
      ...formData,
      links: { ...formData.links, actions: newLinks }
    });
  };

  
  return (
    <div className='viewerWrapper'>
      <div className='blinkViewer'>
     
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
            <CreatorIdentity chain={formData?.selectedChain} accountId={creatorAddress} />
          </div>
        </div>
       

        <h1 className=''>{action.title}</h1>
        <p>{action.description}</p>
        {/* <button disabled={action.disabled}>{action.label}</button> */}
      
       

        <div className='action-group-style'>
         
          
          {action.links.actions.map((linkedAction, index) => (
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

            

              <button className='action-button'onClick={() => console.log(linkedAction.href)}>
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

export default BlinkViewer;



and here is how our formData looks:

