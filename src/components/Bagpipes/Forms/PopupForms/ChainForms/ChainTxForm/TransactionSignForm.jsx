import React, { useState, useEffect } from 'react';
import '../ChainForm.scss';
import ChainRpcService from '../../../../../../services/ChainRpcService';
import FormHeader from '../../../FormHeader';


const TransactionSignForm = ({ nodeId, nodeRef, transactionDetails, onConfirm, onCancel, signedResponse }) => {
    const { extrinsic, paymentInfo, parsedFormData, signingJob } = transactionDetails;
    const [response, setResponse] = useState(null);

    useEffect(() => {
      if (signedResponse) {
        setResponse(signedResponse);
      }
    }, [signedResponse]);

    const handleScroll = (e) => {
        e.stopPropagation();
      };

console.log('transactionDetails nodeRef.current', nodeRef);

    return (
        <div onScroll={handleScroll} >
            <FormHeader onClose={onCancel} title={`Sign & Submit (${nodeId})`} logo={'✍️'} />  
                <div className='eventSigningNotification'>
                <p>Node: <strong>{nodeId}</strong></p>

                    <h2 className='mt-2'>Transaction Details</h2>
                    <div className=' transactionDetails '>
                        <p>Chain: <strong>{parsedFormData.selectedChain}</strong></p>
                        <p>Pallet:<strong> {parsedFormData.selectedPallet}</strong></p>
                        <p>Method: <strong> {parsedFormData.selectedMethod.name}</strong></p>
                        <p>Params: <strong> {JSON.stringify(parsedFormData.params)} </strong></p>
                        <p>Partial Fee: <strong> {paymentInfo.partialFee} </strong></p>
                        <p>Weight: <strong> {paymentInfo.weight.toString() || null} </strong></p>
                    </div>


                    {response && (
                        <div className="transaction-response">
                        <h4>Transaction Response</h4>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                        </div>
                    )}


                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={onCancel} className='button button-cancel' style={{ padding: '10px 20px', background: '', color: 'white', border: 'none', borderRadius: '5px' }}>
                            Cancel
                        </button>
                        <button onClick={onConfirm} className='button button-blue' style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
                            Sign and Submit
                        </button>
                       
                    </div>
                    </div>
                </div>
    );
};

export default TransactionSignForm;
