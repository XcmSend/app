import React from 'react';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import { listChains } from '../../Chains/ChainsInfo';

// Custom toast content for chains
export const ChainToastContent = ({ chainName }) => {
    const chainInfo = Object.values(listChains()).find(chain => chain.name === chainName);
    return (
        <React.Fragment>
            <img 
                src={chainInfo.logo} 
                alt={`${chainInfo.name} logo`} 
                style={{ width: "30px", height: "30px", marginRight: "5px" }} 
            />
            <p style={{ marginBottom: "2px" }}>{chainInfo.display}</p>
        </React.Fragment>
    );
};

// Custom toast content for actions
export const ActionToastContent = ({ type, message, signedExtrinsic }) => {
    let imageSrc, altText;
    if (type === 'swap') {
        imageSrc = SwapSVG;
        altText = 'Swap Action';
    } else if (type === 'xTransfer') {
        imageSrc = xTransferSVG;
        altText = 'xTransfer Action';
        console.log('ActionToastContent xTransferSVG',xTransferSVG);
    }
    console.log('imageSrc', imageSrc);

    return (
        <React.Fragment>

            <img src={imageSrc} alt={altText} style={{ width: "30px", height: "30px", marginRight: "5px" }} />
            <div>{message}</div>
            <div>{JSON.stringify(signedExtrinsic, null, 2)}</div>
        </React.Fragment>
    );
};

// export default { ChainToastContent, ActionToastContent };

// // Using the toast:
// toast(<ChainToastContent chainName="polkadot" />);
// toast(<ActionToastContent type="swap" />);
