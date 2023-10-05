//@ts-nocheck
import React, { useEffect } from 'react';
import { ActionData } from '../ActionNode/ActionInterface';
import styled from 'styled-components';
import { getPaymentInfo, PaymentInfo } from '../../../../Chains/Helpers/FeeHelper';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import ThemeContext from '../../../../contexts/ThemeContext';
import '../../styles.module.css';
import '../../../../index.css';
import './TransactionReview.scss';

const JSONContainer = styled.div`
  max-height: 400px;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: var(--bg);
`;

interface TransactionProps {
  target: Object;
  source: Object;
  actionType: string;
  formData: ActionData; 
  summary: any; 
  draftedExtrinsic: any; 
  status: any;
}


interface TransactionReviewProps {
  transactions: TransactionProps[];
  onAccept: () => void;
  onDecline: () => void;
  signExtrinsic: (transaction: any, address: string) => Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;
  setSignedExtrinsics: React.Dispatch<React.SetStateAction<any[]>>;
}


export const TransactionReview: React.FC<TransactionReviewProps> = ({ transactions, onAccept, onDecline }) => {
  const { theme } = React.useContext(ThemeContext);
  const [fees, setFees] = React.useState<{ [key: string]: PaymentInfo }>({});

  console.log('transactions', transactions);

  useEffect(() => {
    const fetchFees = async () => {
        const newFees: { [key: string]: PaymentInfo } = {};

        for (let txWithData of transactions) {
          console.log("txWithData:", txWithData);
            const feeInfo = await getPaymentInfo(txWithData.draftedExtrinsic, txWithData.formData.source.address, txWithData.formData.source.chain );
            if (feeInfo) { // Check if feeInfo is defined
              newFees[txWithData.formData.nodeId] = feeInfo;
            }        
          }

        setFees(newFees);
    }

    fetchFees();
}, [transactions]);

  return (
    <div className={`${theme}`}>
     
      <div className="container">
         <h2 className='m-2 font-semibold'>Review Transactions</h2>
      <div className='m-2'>Check the drafted transactions and accept or cancel them before signing. </div>
      {transactions.map(txWithData => (
          <div key={txWithData.formData.actionType} className="draft-transaction-item">
            <div className='flex justify-between align-center'>
                <p>Node ID: <strong>{txWithData.formData.nodeId}</strong></p>
                <p>Status: <strong className={txWithData.status === 'drafted' ? 'status-drafted' : txWithData.status === 'signed' ? 'status-signed' : ''}>
                {txWithData.status}
            </strong></p>            
            </div>
               
            <JSONContainer key={txWithData.formData.nodeId}>
              <pre>{JSON.stringify(txWithData.draftedExtrinsic.toHuman(), null, 2)}</pre>
            </JSONContainer>
            <div className='mt-3 mb-3 transaction-review-data'>
            
            <p>Action Type: <strong>{txWithData.formData.actionType}</strong></p>
            <p>Source Chain: <strong>{txWithData.formData.source.chain}</strong></p>
            <p>Source AssetId: <strong>{txWithData.formData.source.assetId}</strong></p>
            <p>Source Address: <strong>{txWithData.formData.source.address}</strong></p>
            <p>Target Chain: <strong>{txWithData.formData.target.chain}</strong></p>
            <p>Target AssetId: <strong>{txWithData.formData.target.assetId}</strong></p>
            <p>Target Address:<strong> {txWithData.formData.target.address}</strong></p>
            <p>Amount: <strong>{txWithData.formData.source.amount} {txWithData.formData.source.symbol}</strong> </p>
            <p>Fees:<strong> {fees[txWithData.formData.nodeId]?.partialFee || 'Fetching...'}</strong></p>

          </div>
          <div className={``}>
         <button className={`button mr-2`} onClick={onAccept}>Accept</button>
         <button className={`button`} onClick={onDecline}>Cancel</button>
       </div>

        </div>
      ))}
       
    </div>
    </div>
  );
}




