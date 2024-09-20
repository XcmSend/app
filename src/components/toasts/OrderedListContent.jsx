import React, { useContext } from 'react';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import RemarkSVG from '/remark.svg';
import VoteSVG from '/vote.svg';
import { listChains } from '../../Chains/ChainsInfo';
import { toast } from 'react-hot-toast';
import ThemeContext from '../../contexts/ThemeContext';
import { ChainQueryIcon, WebhookIcon, HttpIcon } from '../Icons/icons';
import './toast.scss';

const OrderedListContent = ({ list }) => {
    const chains = listChains();
    const { theme } = useContext(ThemeContext);

    // console.log('OrderedListContent chains', chains);
    // console.log('OrderedListContent SwapSVG', SwapSVG);

    return (
        <div className={`ordered-list-content-container flex justify-left w-full ${theme}`}>
            <div className='ordered-list-map flex justify-left' >
                {list.map((item, index) => {
                    let imageSrc, altText;
                    // console.log(`OrderedListContent item is:`, item);
                    if (item.type === 'chain') {
                        const chainInfo = Object.values(chains).find(chain => chain.name === item.name);
                        // console.log('OrderedListContent chainInfo', chainInfo);
                        return (
                            <img
                                key={index}
                                src={chainInfo?.logo}
                                alt={`${chainInfo?.name} logo`}
                                className="toast-icon"
                            />
                        );
                    }  
                    if (item.type === 'chainQuery') {
                        const chainQueryInfo = Object.values(chains).find(chain => chain.name === item.name);
                        // console.log('OrderedListContent chainQueryInfo', chainQueryInfo);
                        return (
                            <div key={index} className="toast-icon">
                                {chainQueryInfo?.name ? (
                                    <img
                                        src={chainQueryInfo?.logo || <ChainQueryIcon className="h-7 w-7" fillColor='white' />  }
                                        alt={`${chainQueryInfo?.name} logo`}
                                        className="toast-icon"
                                    />
                                ) : (
                                    <ChainQueryIcon className="h-7 w-7" fillColor='white' />                                
                                )}
                            </div>
                        );
                    } 
                    if (item.type === 'chainTx') {
                        const chainTxInfo = Object.values(chains).find(chain => chain.name === item.name);
                        // console.log('OrderedListContent chainInfo', chainTxInfo);
                        // console.log('OrderedListContent chainTx item', item);
                        return (
                            <div key={index} className="toast-icon">
                                {chainTxInfo?.name ? (
                                    <img
                                        src={chainTxInfo?.logo || <ChainQueryIcon className="h-7 w-7" fillColor='white' />  }
                                        alt={`${chainTxInfo?.name} logo`}
                                        className="toast-icon"
                                    />
                                ) : (
                                <ChainQueryIcon className="h-7 w-7" fillColor='white' />                                  )}
                            </div>
                        );
                    }
                    if (item.type === 'http') {

                        return (
                            <div key={index} className="toast-icon">
                                  
                                    <HttpIcon className="h-7 w-7" fillColor='white' />       
                                                           
                                    
                            </div>
                        );
                    }
                    if (item.type === 'webhook') {
                        return (
                            <div key={index} className="toast-icon">
                             <WebhookIcon className="h-7 w-7" fillColor='white' />
   
                            </div>
                        );
                    }
                    if (item.type === 'webhook') {
                        return (
                            <div key={index} className="toast-icon">
                                    <img
                                        src={<WebhookIcon className="h-7 w-7" fillColor='white' />  }
                                        alt={`Http logo`}
                                        className="toast-icon"
                                    />
                            </div>
                        );
                    }
                    if (item.action === 'swap') {
                        // console.log('OrderedListContent item action', item.action);
                        imageSrc = SwapSVG;
                        altText = 'Swap Action';
                        return (
                            <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                        );
                    } else if (item.action === 'Remark' || item.action === 'remark') {
                        imageSrc = RemarkSVG;
                        altText = "System Remark";
                        return (
                            <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                        );

                    } 
               else if (item.action === 'Vote' || item.action === 'vote') {
                    imageSrc = VoteSVG;
                    altText = "Vote";
                    return (
                        <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                    );
                }
                 
                else if (item.action === 'stake' || item.action === 'stake') {
                    imageSrc = VoteSVG;
                    altText = "Stake DOT";
                    return (
                        <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                    );
                }
                         

                else if (item.action === 'delegate' || item.action === 'delegate') {
                    imageSrc = VoteSVG;
                    altText = "delegate voting power";
                    return (
                        <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                    );
                }
                    


                    else if (item.action === 'xTransfer') {
                        console.log('OrderedListContent item action', item.action);
                        imageSrc = xTransferSVG;
                        altText = 'xTransfer Action';
                        return (
                            <img key={index} src={imageSrc} alt={altText} className="toast-icon" />
                        );
                    }
                    return null;  // if the item type is not recognized, return null
                })}
            </div>
        </div>
    );
};

export default OrderedListContent;
