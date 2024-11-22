import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types/create';
import { getApiInstance } from '../../../Chains/api/connect';
import './Blinks.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';
import {  VerificationIcon } from '../../../components/Icons/icons';


const CreatorIdentity = ({ chain, accountId }) => {
    const [creatorInfo, setCreatorInfo] = useState({
        name: '',
        icon: '',
        display: '',
        tooltipInfo: ''
      });

      useEffect(() => {
        async function fetchIdentity() {
          const apiChain =
            chain === 'polkadot'
              ? 'people'
              // : chain === 'kusama'
              // ? 'people_kusama'
              : null;

              if (!apiChain) {
                setCreatorInfo({ name: accountId });
                return;
              }

      const api = await getApiInstance(apiChain);
      const registry = new TypeRegistry();


      try {
        console.log('Fetching identity for account:', accountId);
        const identityRaw = await api.query.identity.identityOf(accountId);

        if (identityRaw.isSome) {
            console.log('Identity found:', identityRaw.toHuman());
            const identity = identityRaw.toHuman();
            const { info, judgements } = identity[0];            
            console.log('Identity:', identity);

            const displayName = info.display.Raw || 'Unknown'; 

            const tooltipInfo = JSON.stringify(identity[0], null, 2);

          let icon = 'grey';
          if (judgements?.some(j => j[1] === 'Reasonable' || j[1] === 'KnownGood')) {
            icon = 'green';
          } else if (judgements?.some(j => j[1] === 'OutOfDate' || j[1] === 'LowQuality')) {
            icon = 'yellow';
          }


          // display info is a component that will be rendered on display containing an icon and the display name
          const displayInfo = (
            <div className='creator-identity'>
                <span>Creator:</span>

              <VerificationIcon className="icon ml-1 mr-0 h-3 w-3 mr-1" fillColor={icon} />
              <span style={{color: icon}}>  {displayName}</span>
            
            </div>
          );


          setCreatorInfo({
            display: displayInfo,
            name: displayName,
            icon: icon,
            tooltipInfo: tooltipInfo
          });
        } else {
            const slicedCreatorAddress = accountId ? `${accountId.slice(0, 4)}...${accountId.slice(-4)}` : '';

            console.log('No identity found for account:', slicedCreatorAddress);
            setCreatorInfo({
                display: `Creator: ${slicedCreatorAddress}`,
                name: accountId,
                icon: 'grey',
                tooltipInfo: 'No identity found'
              });        
        }
      } catch (error) {
        console.error('Failed to fetch identity:', error);
        setCreatorInfo({
            name: accountId,
            icon: 'grey',
            tooltipInfo: 'Failed to fetch identity'
          });      } finally {
        api.disconnect();
      }
    }

    fetchIdentity();

  }, [chain, accountId]);

  return (
    <Tippy overflow='scroll' theme="light" interactive='true' content={creatorInfo.tooltipInfo}>
    <div className={`creator-identity`} 
     style={{
        overflowY: 'auto', // Enable vertical scrolling
      }}
      >
    {creatorInfo.display}
    </div>
  </Tippy>
  );
};

export default CreatorIdentity;
