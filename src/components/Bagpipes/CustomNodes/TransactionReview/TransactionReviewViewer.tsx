import React, { useEffect } from 'react';
import { ActionData, PaymentInfo } from '../ActionNode/ActionInterface';
import styled from 'styled-components';
import { getPaymentInfo } from '../../../../Chains/Helpers/FeeHelper';

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
  background-color: #f4f4f4;
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
  signExtrinsic: (transaction: any, address: string) => Promise<void>; 
  setSignedExtrinsics: React.Dispatch<React.SetStateAction<any[]>>;
}


export const TransactionReview: React.FC<TransactionReviewProps> = ({ transactions, onAccept, onDecline }) => {
  const [fees, setFees] = React.useState<{ [key: string]: PaymentInfo }>({});

  console.log('transactions', transactions);

  useEffect(() => {
    const fetchFees = async () => {
        const newFees: { [key: string]: PaymentInfo } = {};

        for (let txWithData of transactions) {
          console.log("txWithData:", txWithData);
            const feeInfo = await getPaymentInfo(txWithData.draftedExtrinsic, txWithData.formData.source.address, txWithData.formData.source.chain );
            newFees[txWithData.formData.nodeId] = feeInfo;
        }

        setFees(newFees);
    }

    fetchFees();
}, [transactions]);

  return (
    <div className="transaction-review-modal">
      <h2>Review Transactions</h2>
      {transactions.map(txWithData => (
          <div key={txWithData.formData.actionType} className="transaction-item">
            <JSONContainer key={txWithData.formData.nodeId}>
              <pre>{JSON.stringify(txWithData.draftedExtrinsic.toHuman(), null, 2)}</pre>
            </JSONContainer>
            <div className='mt-3 mb-3'>
            <p>Status: {txWithData.status}</p>
            <p>Action Type: {txWithData.formData.actionType}</p>
            <p>Source Chain: {txWithData.formData.source.chain}</p>
            <p>Source Asset: {txWithData.formData.source.assetId}</p>
            <p>Source Address: {txWithData.formData.source.address}</p>
            <p>Target Chain: {txWithData.formData.target.chain}</p>
            <p>Target Asset: {txWithData.formData.target.assetId}</p>
            <p>Target Address: {txWithData.formData.target.address}</p>
            <p>Amount: {txWithData.formData.source.amount} {txWithData.formData.source.symbol} </p>
            <p>Fees: {fees[txWithData.formData.nodeId]?.partialFee || 'Fetching...'}</p>

          </div>

        </div>
      ))}
      <button onClick={onAccept}>Accept</button>
      <button onClick={onDecline}>Cancel</button>
    </div>
  );
}




