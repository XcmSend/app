import React, { useContext } from 'react';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import { listChains } from '../../Chains/ChainsInfo';
import { toast } from 'react-hot-toast';
import ThemeContext from '../../contexts/ThemeContext';
import './toast.scss';

const OrderedListContent = ({ list }) => {
    const chains = listChains();
    const { theme } = React.useContext(ThemeContext);

    console.log('OrderedListContent chains',chains);
    console.log('OrderedListContent SwapSVG',SwapSVG);

    return (
        <div className={`toast-container ${theme}`}>
        <div className='ordered-list-map' style={{ display: 'flex', alignItems: 'center' }}>
            {list.map((item, index) => {
                let imageSrc, altText;
                if (item.type === 'chain') {
                    
                    console.log('OrderedListContent chains',chains);
                    const chainInfo = Object.values(chains).find(chain => chain.name === item.name);
                    console.log('OrderedListContent chainInfo',chainInfo);
                    return (
                        <img
                            key={index}
                            src={chainInfo.logo}
                            alt={`${chainInfo.name} logo`}
                            className="toast-icon"
                        />
                    );
                }
                if (item.action === 'swap') {
                    console.log('OrderedListContent item action', item.action)
                    imageSrc = SwapSVG;
                    altText = 'Swap Action';
                    return (
                        <img src="/swap.svg" alt="Swap" className="toast-icon" />

                    );
                } else if (item.action === 'xTransfer') {
                    console.log('OrderedListContent item action',item.action)
                    imageSrc = xTransferSVG;
                    altText = 'xTransfer Action';
                    return (
                        <img src="/xTransfer.svg" alt="xTransfer" className="toast-icon" />

                    );
                }
                return null;  // if the item type is not recognized, return null
            })}
        </div>
        </div>
    );
};

export default OrderedListContent;

// within a toast
// toast(<OrderedListContent
//     list={[
//         { type: 'chain', name: 'polkadot' },
//         { type: 'action', action: 'xTransfer' },
//         // ... and so on
//     ]}
// />);