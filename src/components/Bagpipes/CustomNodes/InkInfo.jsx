import React, { useState } from 'react';
import { query_contract, contract_info  } from '../../../../src/Chains/DraftTx/DraftInk';


const InfoDivider = ({ label, value }) => (
    <div className="p-3 m-2 bg-gray-100 rounded border border-gray-300 flex justify-between ">
       <span className='px-1'>{label}:</span> <strong>{" "}  {value} </strong>
    </div>
);

const ConversionDivider = ({ label, value, label2, value2 }) => (
    <div className="p-3 m-2 bg-gray-100 rounded border border-dotted border-gray-300 snap-center flex justify-center">
        <strong>{label} {value} {label2} {value2} </strong>
    </div>
);
const AbiShow = ({ api, address, abidata }) => {
    const [messages, setMessages] = useState([]);
    console.log(`showing abi!!`);
    useEffect(() => {
        const fetchContractInfo = async () => {
            try {
                const messageList = await contract_info(api, address, abidata);
                setMessages(messageList);
            } catch (error) {
                console.error('Error fetching contract info:', error);
            }
        };

        fetchContractInfo();
    }, [api, address, abidata]);

    return (
        <div className="p-3 m-2 bg-gray-100 rounded border border-dotted border-gray-300 snap-center flex flex-col">
            <strong>Functions: </strong>
            {messages.length > 0 ? (
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
                            <strong>Method:</strong> {msg.method} <br />
                            <strong>Selector:</strong> {msg.selector} <br />
                            <strong>Mutates:</strong> {msg.mutates ? 'Yes' : 'No'} <br />
                            <strong>Arguments:</strong>
                            <ul>
                                {msg.args.map((arg, idx) => (
                                    <li key={idx}>
                                        {arg.name}: {arg.type}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No messages found</p>
            )}
        </div>
    );
};

const InkInfo = ({ sourceInfo, targetInfo, contract_address, abi }) => {
    const [showDetails, setShowDetails] = useState(false);
    const api = getApiInstance('rococo_assethub');
    console.log(`InkInfo: input:`, contract_address, abi);
    return (
        <div className="sell-price-info mt-4 bg-gray-100 p-2 rounded border border-gray-300 text-gray-700 mt-1 p-3 m-2 snap-x" style={{ maxWidth: '300px' }}>
            <ConversionDivider label="" value="" label2="->" value2="" />
            <InfoDivider label="Loading ink contract..." />
            {api && abi && (
                <AbiShow api={api} address={contract_address} abidata={abi} />
            )}
            <InfoDivider label="Address:" value={contract_address} /> 
            <div className="mt-2 flex justify-end underline">
         
            </div>
        </div>
    );
}

export default InkInfo;

