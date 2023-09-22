import React from 'react';
import { ActionData } from '../ActionNode/ActionInterface';

interface TransactionProps {
  target: ActionData;
  source: ActionData;
  actionType: string;
  summary: any; 
}

interface TransactionReviewProps {
  transactions: TransactionProps[];
  onAccept: () => void;
  onDecline: () => void;
}

export const TransactionReview: React.FC<TransactionReviewProps> = ({ transactions, onAccept, onDecline }) => {
  return (
    <div className="transaction-review-modal">
      <h2>Review Transactions</h2>
      {transactions.map(tx => (
    <div key={tx.actionType} className="transaction-item">
        <p>Action Type: {tx.actionType}</p>
        <p>Source Chain: {tx.source.chain}</p>
        <p>Source Asset: {tx.source.assetId}</p>
        <p>Source Address: {tx.source.address}</p>
        <p>Target Chain: {tx.target.chain}</p>
        <p>Target Asset: {tx.target.assetId}</p>
        <p>Target Address: {tx.target.address}</p>
    </div>
))}
      <button onClick={onAccept}>Accept</button>
      <button onClick={onDecline}>Cancel</button>
    </div>
  );
}
