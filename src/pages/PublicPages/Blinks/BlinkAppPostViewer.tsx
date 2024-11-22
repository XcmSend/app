import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../../../components/Wallet/contexts';
import { useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import toast from 'react-hot-toast';
import useBlinkStore from '../../../store/useBlinkStore';
import BlinkMiniApp from './BlinkMiniApp';
import { generateUrl }  from './generateBlink';
import { fetchBlinkData } from './helpers';

import { BlinkIcon } from '../../../components/Icons/icons'; 
import WalletWidget from '../../../components/WalletWidget/WalletWidget';

import type { Action, NewActionForm} from './types';


import './Blinks.scss';

const BlinkAppPostViewer: React.FC = () => {
  const walletContext = useContext(WalletContext);

  const {  saveFetchedOnChainBlink, getFetchedOnChainBlink} = useBlinkStore(state => ({ 
    saveFetchedOnChainBlink: state.saveFetchedOnChainBlink,
    getFetchedOnChainBlink: state.getFetchedOnChainBlink
  }));
    const { fullId } = useParams();    


    useEffect(() => {
        // Listener for messages from parent
        const handleMessage = (event) => {
          if (event.data && event.data.type === 'FROM_PARENT') {
            console.log('Message from parent:', event.data.payload);
            // Handle the message as needed
          }
        };
    
        window.addEventListener('message', handleMessage);
    
        // Optional: Send a message to parent
        window.parent.postMessage({ type: 'FROM_IFRAME', payload: 'Hello Parent!' }, '*');
    
        return () => {
          window.removeEventListener('message', handleMessage);
        };
      }, []);
    

       // State initialization with default values moved into a function
    const initializeAction = () => ({
        id: 'default',
        type: "action",
        icon: "",
        title: "",
        description: "",
        label: "",
        disabled: false,
        links: { actions: [] },
        error: undefined,
        actionType: 'select',
        recipient: ''
    });


    const [action, setAction] = useState<Action<"action">>({
        id: '',
        type: "action",
        icon: "",    
        title: "",
        description: "",
        label: "",
        disabled: false,
        links: { actions: [] },
        error: undefined,
        actionType: 'select',
        recipient: ''
    });

    let formData: any;


    const [actionForms, setActionForms] = useState<NewActionForm[]>([]);
    const [actionType, setActionType] = useState<string>("select");
    const [amountTypes, setAmountTypes] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('fetching blink');
    const [error, setError] = useState<any>();
    const [selectedChain, setSelectedChain] = useState(formData?.selectedChain || '');
    const [selectedCreatorAccount, setSelectedCreatorAccount] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');


    useEffect(() => {
        async function loadBlinkData() {
    
            if (fullId) {
               
                // Split fullId into chain, blockNumber, txIndex
                const [chain, blockNumStr, txIndexStr] = fullId.split(':');
    
                
                if (chain && blockNumStr && txIndexStr) {
                  const blockNum = parseInt(blockNumStr, 10);
                  const txIdx = parseInt(txIndexStr, 10);
                   
                if (chain && blockNumStr && txIndexStr) {
    
                    const genreratedUrl = generateUrl(chain, blockNum, txIdx);
                    setGeneratedUrl(genreratedUrl);
                    console.log('BlinkAppPostViewer loading data chain:', chain, 'blockNumber:', blockNum, 'txIndex:', txIdx);
                    // Try to get the blink data from the store
                    formData = getFetchedOnChainBlink(chain, blockNum, txIdx);
                    console.log('BlinkAppPostViewer fetched formData', formData);
    
                    if (formData) {
                        console.log('BlinkAppPostViewer non-fetched formData', formData);
                        setAction(formData);
                        setActionForms(formData?.links?.actions || []);
                        setActionType(formData?.actionType);
                        // Set the amount types for each action in the array
                        if (formData?.links?.actions) {
                        const actionTypes = formData?.links.actions.map(action => action.type || ''); 
                        setAmountTypes(actionTypes);
                        }
                        setSelectedChain(formData?.selectedChain);
                        setSelectedCreatorAccount(formData?.selectedCreatorAccount);
                        
                    } else {
                    setLoading(true);
                    setLoadingMessage(`Fetching blink from asset hub ${blockNum}...`);
                    try {
                        console.log('BlinkAppPostViewer fetching data from chain:', chain, 'blockNumber:', blockNum, 'txIndex:', txIdx);
                        // Fetch from chain
                        formData = await fetchBlinkData( blockNum, txIdx);
    
                        
    
                        if (formData) {
                        saveFetchedOnChainBlink(chain, blockNum, txIdx, formData);
                        console.log('BlinkAppPostViewer formData from on-chain fetch', formData);
                        setAction(formData);
                        setActionForms(formData?.links?.actions || []);
                        setActionType(formData?.actionType);
                        // Set the amount types for each action in the array
                        if (formData?.links?.actions) {
                        const actionTypes = formData?.links.actions.map(action => action.type || ''); 
                        setAmountTypes(actionTypes);
                        }
                        setSelectedChain(formData?.selectedChain);
                        setSelectedCreatorAccount(formData?.selectedCreatorAccount);
    
                            } else {
                                console.error('Unable to fetch data from chain.');
                            }
                    } catch (error) {
                        console.error('Error loading blink data:', error);
                        setError(error);
                    } finally {
                        setLoading(false);
                        setLoadingMessage('');
                    }
                    }
                } else {
                    formData = initializeAction() as Action<"action">;
                    console.error('Invalid URL parameters');
                }
            } else {
                console.error('Invalid fullId format. Expected <chain>:<blockNumber>:<txIndex>');
              }
            } else {
              console.error('No fullId parameter found');
            }
        }
    
        loadBlinkData();
      }, [fullId]);
    
      let miniAppView = 'false';

      useEffect(() => {
        const hash = window.location.hash;
        console.log('miniAppView window.location.hash:', hash);
      
        const queryString = hash.split('?')[1];
      
        if (queryString) {
          const urlParams = new URLSearchParams(queryString);
          miniAppView = urlParams.get('miniAppView');
      
          console.log('miniAppView params:', urlParams);
      
          if (miniAppView === 'true') {
            console.log('miniAppView is enabled');
      
            // only hide specific elements
            const elementsToHide = document.querySelectorAll(' .sidebar, .blinkTitleInfo, .blinkHeader' ); // this is what to hide. 
            elementsToHide.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.display = 'none';
                console.log('Hiding element:', el);
              }
            });
      
            // Ensure .blinkMiniAppContainer is visible explicitly
            const blinkMiniAppContainer = document.querySelector('.blinkMiniAppContainer');
            if (blinkMiniAppContainer instanceof HTMLElement) {
              blinkMiniAppContainer.style.display = 'block'; 
              blinkMiniAppContainer.style.visibility = 'visible';
              blinkMiniAppContainer.style.height = '600px !important';
              blinkMiniAppContainer.style.width = '600px';
              blinkMiniAppContainer.style.padding = '10px';
              blinkMiniAppContainer.style.overflowY = 'scroll';
              blinkMiniAppContainer.style.overflowX = 'scroll';



              blinkMiniAppContainer.style.overflow = 'visible';
              blinkMiniAppContainer.style.backgroundColor = 'black';


              console.log('Explicitly setting .blinkMiniAppContainer to visible:', blinkMiniAppContainer);
            } else {
              console.log('.blinkMiniAppContainer not found or not an HTMLElement.');
            }
      
            // Scroll into view in case it's out of the viewport
            if (blinkMiniAppContainer) {
              blinkMiniAppContainer.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            console.log('miniAppView is not enabled');
          }
        } else {
          console.log('No query parameters in the hash');
        }
      }, []);


      useEffect(() => {
        // Listener for messages from the parent
        const handleMessage = (event: MessageEvent) => {
          const allowedOrigins = ['http://localhost:5173', 'https://blink.bagpipes.io'];
          
          // Only process messages from allowed origins
          if (!allowedOrigins.includes(event.origin)) {
            console.warn(`Ignored message from origin: ${event.origin}`);
            return;
          }
          console.log('Message from parent:', event);
      
          const { type, payload } = event.data;
          
          console.log(`iframe received message: type=${type}, payload=${JSON.stringify(payload)}`);
      
          // Handle different message types
          switch (type) {
            case 'TEST_RESPONSE':
              console.log(`Received TEST_RESPONSE: ${payload}`);
              break;
      
            case 'WALLET_CONNECT_RESPONSE':
              console.log(`Received WALLET_CONNECT_RESPONSE:`, payload);
              // Update the WalletContext with the received wallet data
              // Assuming `walletContext` is available and defined properly
              walletContext.setWallet(payload.wallet, payload.walletType);
              break;
      
            default:
              console.warn(`Unhandled message type: ${type}`);
          }
        };
      
        window.addEventListener('message', handleMessage);
      
        // Send a test message to the parent
        window.parent.postMessage(
          { type: 'TEST_MESSAGE', payload: 'Hello from iframe!' },
          'http://localhost:5173' // Use the same origin for messaging
        );
      
        return () => {
          window.removeEventListener('message', handleMessage);
        };
      }, [walletContext]);
      



      // useEffect(() => {
      //   // Listener for messages from the parent
      //   const handleMessage = (event) => {
      //     // Verify the origin of the message
      //     if (event.origin !== 'http://localhost:5173') {
      //       console.warn(`Ignored message from origin: ${event.origin}`);
      //       return;
      //     }
    
      //     const { type, payload } = event.data;
    
      //     console.log(`iframe received message: type=${type}, payload=${JSON.stringify(payload)}`);
    
      //     // Handle different message types
      //     switch (type) {
      //       case 'TEST_RESPONSE':
      //         console.log(`Received TEST_RESPONSE: ${payload}`);
      //         break;
    
      //       case 'WALLET_CONNECT_RESPONSE':
      //         console.log(`Received WALLET_CONNECT_RESPONSE:`, payload);
      //         // Update the WalletContext with the received wallet data
      //         walletContext.setWallet(payload.wallet, payload.walletType);
      //         break;
    
      //       default:
      //         console.warn(`Unhandled message type: ${type}`);
      //     }
      //   };
    
      //   window.addEventListener('message', handleMessage);
    
      //   // Send a test message to the parent
      //   window.parent.postMessage(
      //     { type: 'TEST_MESSAGE', payload: 'Hello from iframe!' },
      //     'http://localhost:5173'
      //   );
    
      //   // Optionally, request wallet connection on mount
      //   window.parent.postMessage(
      //     { type: 'WALLET_CONNECT_REQUEST', payload: { /* any necessary data */ } },
      //     'http://localhost:5173'
      //   );
    
      //   return () => {
      //     window.removeEventListener('message', handleMessage);
      //   };
      // }, [walletContext]);
      


  return (
    <>
    
      <div className='blinkHeader'>

      <div className='blinkTitleInfo'> 
        <h1>Mini App</h1>
        <span className='font-mono'>On-Chain Blink:<span className='font-mono'>({fullId})</span></span>
        
        </div>
      </div>
      <div className='blinkMiniAppContainer'>


        <div 
          className='viewerWrapper'
          style={miniAppView === 'true' ? { margin: '0 auto' } : {}}
       >
        
        <span className='cutOutLabel'>Blink Mini App injected </span>
      <div className='visibleApp'>

        <BlinkMiniApp action={action} generatedUrl={generatedUrl} />

        {loading && (
          <div className='loading flex text-xl font-semibold mt-4 items-center bg-white p-3 rounded'>
            <Spin size='small' />
            <div className='ml-3  text-slate-700 '>{loadingMessage}</div>
            </div>
        )}

      </div>
      </div>

    </div>

    </>
  );
};

export default BlinkAppPostViewer;




