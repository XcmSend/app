import React, { useEffect, useState } from 'react';
import toast  from "react-hot-toast";
import { listChains } from '../../Chains/ChainsInfo';
import SwapSVG from '/swap.svg';
import xTransferSVG from '/xTransfer.svg';
import ThemeContext from '../../contexts/ThemeContext';
import './toast.scss';


function NodeNotifications() {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight, dismiss } = handlers;
    const { theme } = React.useContext(ThemeContext);


    const [chainList, setChainList] = useState({});
    let imageSrc, altText, displayText;
    if (toast.nodeType === 'chain' && chainInfo) {
      imageSrc = chainInfo.logo;
      altText = `${chainInfo.name} logo`;
      displayText = chainInfo.display;
    } else if (toast.nodeType === 'action') {
      if (toast.data?.type === 'swap') {
          imageSrc = SwapSVG;
          altText = 'Swap Action';
      } else if (toast.data?.type === 'xTransfer') {
          imageSrc = xTransferSVG;
          altText = 'xTransfer Action';
      }
      // Optional: If you want to display a name/title for actions just like for chains
      displayText = toast.data?.type;
  }
  

    useEffect(() => {
        setChainList(listChains());
    }, []);

    return (
      <div className={`${theme}`}>
      <div onMouseEnter={startPause} onMouseLeave={endPause}>
          {toasts.reverse().map((toast) => { 
              const ref = (el) => {
                  if (el && typeof toast.height !== "number") {
                      const height = el.getBoundingClientRect().height;
                      updateHeight(toast.id, height);
                  }
              };

              let chainInfo;
              if (toast.data?.chain) {
                  chainInfo = Object.values(chainList).find(chain => chain.name === toast.data.chain);
              }

              const offset = calculateOffset(toast, {
                  reverseOrder: false, 
                  margin: 8
              });

              return (
                <div
                  key={toast.id}
                  ref={ref}
                  className={` toast-container`}              
                  style={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                    
                     
                      minWidth: "200px",
                      transition: "all 0.5s ease-out",
                      opacity: toast.visible ? 1 : 0,
                      zIndex: 100000,
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                      borderRadius: "8px",
                      transform: `translateY(${offset}px)`
                  }}
                >
                  {chainInfo?.logo && 
                      <img 
                          src={chainInfo.logo} 
                          alt={`${chainInfo.name} logo`} 
                          style={{ 
                              width: "30px", 
                              height: "30px", 
                              marginRight: "5px" 
                          }} 
                      />
                  }
                  <div className="ml-2" style={{ flex: 1 }}>
                    <div className='font-semibold'>
                      {chainInfo && <p style={{ marginBottom: "2px" }}>{chainInfo.display}</p>}
                    </div>
                    <span className=''>{toast.message}</span>
                  </div>
                  {/* Close button */}
                  <button onClick={() => { console.log("Toast ID to be dismissed:", toast.id); toast.dismiss(toast.id); }} style={{ marginLeft: "10px" }}>
                      ×
                  </button>
                </div>
            );
          })}
      </div>
      </div>
  );
};

export default NodeNotifications;
