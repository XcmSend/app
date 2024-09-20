import React from 'react';
import './Blinks.scss';
import { Action } from './BlinkBuilder';
import {BlinkIcon, VerificationIcon} from '../../../components/Icons/icons';

export interface BlinkViewerProps {
  action: Action<"action">;
}

const BlinkViewer: React.FC<BlinkViewerProps> = ({ action }) => {

  const sortedActions = action?.links?.actions?.sort((a, b) => {
    const typeA = a.parameters.some(param => param.type === 'inputAmount') ? 1 : 0;
    const typeB = b.parameters.some(param => param.type === 'inputAmount') ? 1 : 0;
    return typeA - typeB;
});


  return (
    <div className='viewerWrapper'>
    <div className='blinkViewer'>
      {action.icon && (
        <img src={action.icon} alt={action.title} className='blink-icon' />
      )}
      <div className="blink-container">
        <div className="link-section">
          <BlinkIcon className=" icon ml-0 mr-0 h-3 w-3" fillColor="grey" />
          <span className="blink-title">https://blink.polkadot.network/</span>
          <VerificationIcon className="icon ml-1 mr-0 h-3 w-3" fillColor="grey" />
        </div>
        <div className="creator-section">
          <span className='icon'>Created by:</span>
          <span className="creator-name">{`on-chain Id`}</span>
        </div>
      </div>

      <h1 className=''>{action.title}</h1>
      <p>{action.description}</p>
      <button disabled={action.disabled}>{action.label}</button>
      
      {sortedActions?.length > 0 && (
        <div className='button-group-style'>
          <ul>
          {sortedActions.map((linkedAction, index) => (
              

              <li key={index} className={` ${linkedAction.parameters.some(param => param.type === 'inputAmount') ? 'input-wrapper' : 'fixed-wrapper'}`}>


                <button className='action-button' onClick={() => console.log('Action URL:', linkedAction.href)}>
                  {linkedAction.label}
                </button>
                {linkedAction.parameters.map((param, paramIndex) => (
                <div key={paramIndex} className={param.type === 'inputAmount' ? 'input-amount-style' : 'fixed-amount-style'}>
                    <div key={paramIndex} className=''>
                    <input placeholder={param.name} />
                  </div>

                  </div>
                ))}
              </li>
            )
            )}
          </ul>
        </div>
      )}
      {action.error && <p style={{ color: 'red' }}>{action.error.message}</p>}
    </div>
    </div>
  );
};

export default BlinkViewer;
