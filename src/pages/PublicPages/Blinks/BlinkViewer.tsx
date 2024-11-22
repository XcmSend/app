import React, { useState, useContext, useEffect } from 'react';
import './Blinks.scss';
import './BlinkViewer.scss';
import type { Action } from './types';
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
import { getApiInstance } from 'src/Chains/api/connect';
import { signExtrinsicUtil } from 'src/components/Bagpipes/utils/signExtrinsicUtil';
import { broadcastToChain } from '../../../Chains/api/broadcastToChain';
import { createCallParams } from './executeBlink/createCallParams';
import toast  from 'react-hot-toast';
import { actionSubmittableStructure } from './actions';
import ChainRpcService from '../../../services/ChainRpcService';

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

  const formData = getBlinkMetadata(activeBlinksId);

  const walletContext = useContext(WalletContext);
  console.log('BlinkViewer walletContext:', walletContext);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [chainSymbol, setChainSymbol] = useState('');
  const [balance, setBalance] = useState(null);
  const [selectedUserAddress, setSelectedUserAddress] = useState(formData?.selectedUserAddress || walletContext.accounts[0]?.address || '');
  const [selectedUserAddressName, setSelectedUserAddressName] = useState(formData?.selectedUserAddressName || walletContext.accounts[0]?.name || '');
  const [chain, setChain] = useState(null);
  // const [selectedCreatorAccount, setSelectedCreatorAccount] = useState(formData?.selectedCreatorAccount || null);
  let selectedCreatorAccount = formData?.selectedCreatorAccount || null;

  useEffect(() => {
    selectedCreatorAccount = formData?.selectedCreatorAccount || null;
  }
  , [formData?.selectedCreatorAccount]);

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

  const handleUserButtonClick = (e) => {
    message.info(`Selected Address: ${selectedUserAddress}`);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selected = walletContext.accounts.find(acc => acc.address === e.key);
    // setSelectedCreatorAccount(selected || null);
    setSelectedUserAddress(selected?.address || '');
    setSelectedUserAddressName(selected?.name || '');
    message.info(`Selected Address: ${selected?.address || ''}`);
    // Fetch balance for the selected address
    // fetchBalance(selected?.address);

    // we need the 

  saveBlinkMetadata(activeBlinksId, {...formData, selectedUserAddress: selected?.address, selectedUserAddressName: selected?.name});

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
      return <div className='connect-message '>Please connect Wallet.</div>;
    }
    return (
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
      {selectedUserAddress ? (
        <span className='account-info '>
          <span className="font-bold">{selectedUserAddressName}</span>
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
      signerAddress: formData.selectedUserAddress,
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




  
  return (
    <div className='viewerBuilderWrapper'>
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

export default BlinkViewer;

