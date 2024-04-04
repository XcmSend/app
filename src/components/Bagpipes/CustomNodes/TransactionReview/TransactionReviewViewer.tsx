//@ts-nocheck
import React, { useEffect } from 'react';
import { ActionData } from '../ActionNode/ActionInterface';
import styled from 'styled-components';
import { getPaymentInfo, PaymentInfo } from '../../../../Chains/Helpers/FeeHelper';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { getApiInstance } from '../../../../Chains/api/connect';
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
  signExtrinsic: (
    transaction: any,
    address: string,
    nonce?: number
    ) => Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;
  setSignedExtrinsics: React.Dispatch<React.SetStateAction<any[]>>;
}


export const TransactionReview: React.FC<TransactionReviewProps> = ({ transactions, onAccept, onDecline, signExtrinsic, setSignedExtrinsics }) => {
  const { theme } = React.useContext(ThemeContext);
  const [fees, setFees] = React.useState<{ [key: string]: PaymentInfo }>({});
  const feesFetched = React.useRef(false);


  console.log('transactions', transactions);

  useEffect(() => {
    if (!feesFetched.current) {
    const fetchFees = async () => {
      const newFees: { [key: string]: PaymentInfo } = {};
      
      // Process each transaction to fetch its fee information
      for (const txWithData of transactions) {
        try {
          const address = txWithData.formData.source.address.toString();
          // Get the payment info. If the API is not connected, an error will be thrown
          const feeInfo = await getPaymentInfo(txWithData.draftedExtrinsic, address, txWithData.formData.source.chain);
          if (feeInfo) { // If feeInfo is retrieved successfully
            newFees[txWithData.formData.nodeId] = feeInfo;
            console.log(`getPaymentInfo Fees for transaction ${txWithData.formData.nodeId}:`, feeInfo); // Log the fee info

          }
        } catch (error) {
          console.error(`Failed to fetch fee for transaction ${txWithData.formData.nodeId}: ${error}`);
          // Optionally, you can set a flag or update a status to reflect that fees could not be fetched
        }
      }
      
      // Update the state with the new fees, including any that may have failed to fetch
      setFees(newFees);
    }
    fetchFees();
  
    feesFetched.current = true; // Set to true after fetching
    }
  }, [transactions]); // This will still run when `transactions` changes
  
  

  return (
    <div className={`${theme}`}>
      <div className="container">
         <h2 className='m-2 font-semibold'>Review Transactions</h2>
      <div className='m-2'>Check the drafted transactions and accept or cancel them before signing. </div>
      {transactions.map(txWithData => (
          <div key={txWithData.formData.nodeId} className="draft-transaction-item">
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
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Action Type:</div> <div><strong>{txWithData.formData.actionType}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Source Chain: </div> <div><strong>{txWithData.formData.source.chain}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Source AssetId: </div> <div><strong>{txWithData.formData.source.assetId}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Source Address: </div> <div><strong>{txWithData.formData.source.address}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Target Chain: </div> <div><strong>{txWithData.formData.target.chain}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Target AssetId: </div> <div><strong>{txWithData.formData.target.assetId}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Target Address:</div> <div><strong> {txWithData.formData.target.address}</strong></div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Amount: </div> <div><strong>{txWithData.formData.source.amount} {txWithData.formData.source.symbol}</strong> </div></div>
              <div className='flex flex-row'><div className='transaction-name w-1/3'>Fees:</div> <div><strong> {fees[txWithData.formData.nodeId]?.partialFee || 'Fetching...'}</strong></div></div>
          </div>
          <div className={``}>
        
       </div>
       
        </div>
      ))}
       <button className={`button mr-2 font-bold`} onClick={onAccept}>Approve All</button>
         <button className={`button`} onClick={onDecline}>Cancel</button>
    </div>
    </div>
  );
}




