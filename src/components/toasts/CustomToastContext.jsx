import React from 'react';
import SwapSVG from '/swap.svg';
import RemarkSVG from '/remark.svg';
import xTransferSVG from '/xTransfer.svg';
import { HttpIcon, WebhookIcon } from '../Icons/icons';
import { listChains } from '../../Chains/ChainsInfo';

// Mapping of node types to their respective icons
const nodeTypeIcons = {
  http: HttpIcon,
  webhook: WebhookIcon,
};

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
    } else if (type === 'remark') {
        imageSrc = RemarkSVG;
        altText = "System remark"
    } 
    else if (type === 'xTransfer') {
        imageSrc = xTransferSVG;
        altText = 'xTransfer Action';
    }
    console.log('imageSrc', imageSrc);

    return (
      <div style={{ display: 'flex', alignItems: 'center', overflowWrap: 'break-word', maxWidth: '100%' }}>
          <img src={imageSrc} alt={altText} style={{ width: "30px", height: "30px", marginRight: "5px" }} />
          <div style={{ maxWidth: 'calc(100% - 40px)' }}>
              <div>{message}</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0 }}>{JSON.stringify(signedExtrinsic, null, 2)}</pre>
              </div>
          </div>
      </div>
  );
};

// Custom toast content for HTTP requests
export const HttpToastContent = ({ url, method, message }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {/* <HttpIcon /> */}
            <img src={HttpIcon} alt="HTTP Request" style={{ width: "30px", height: "30px", marginRight: "5px" }} /> 
            <div>
                <div>{message}</div>
                <div>{method}: {url}</div>
            </div>
        </div>
    );
};

export const CustomToastContext = ({ nodeType, eventUpdates }) => {
  const IconComponent = nodeTypeIcons[nodeType];
  const altText = `${nodeType} Node`;

  return (
    <div className="customToastContent" style={{ display: 'flex', alignItems: 'center', overflowWrap: 'break-word' }}>
      {IconComponent && (
        <div alt={altText} style={{ width: '30px', height: '30px', marginRight: '10px' }}>
          <IconComponent />
          </div>
      )}
      <div>
        {eventUpdates.map((update, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <strong>Timestamp:</strong> {update.timestamp}
            <div>
              {/* Assuming eventData is always an object or array */}
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(update.eventData, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};





// export default { ChainToastContent, ActionToastContent };

// // Using the toast:
// toast(<ChainToastContent chainName="polkadot" />);
// toast(<ActionToastContent type="swap" />);
