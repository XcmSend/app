import React, { useState } from 'react';

const InfoDivider = ({ label, value }) => (
    <div className="p-2 m-1 bg-gray-50 rounded border border-gray-400">
        <strong>{label}:</strong> {value}
    </div>
);

const PriceInfo = ({ sourceInfo, targetInfo, priceInfo }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="sell-price-info mt-4 bg-gray-100 p-2 rounded border border-gray-300 text-gray-700 mt-1 p-3 m-2" style={{ maxWidth: '300px' }}>
            <InfoDivider label="Source" value={`${priceInfo.amountIn} (${sourceInfo.asset.name})`} />
            <InfoDivider label="Target" value={`${priceInfo.amountOut} (${targetInfo.asset.name})`} />
            <InfoDivider label="Type" value={priceInfo.type} />
            <InfoDivider label="Spot Price" value={priceInfo.spotPrice} />


            {showDetails && (
                <>
                    <InfoDivider label="Amount In" value={priceInfo.amountIn} />
                    <InfoDivider label="Amount Out" value={priceInfo.amountOut} />
                    <InfoDivider label="Description" value={`Selling ${priceInfo.amountIn} ${sourceInfo.asset.name}, for ${priceInfo.amountOut} ${targetInfo.asset.name}`} />
                    <InfoDivider label="Trade Fee" value={priceInfo.tradeFee} />
                    <InfoDivider label="Price Impact (%)" value={priceInfo.priceImpactPct} />
                    <InfoDivider label="Trade Fee (%)" value={priceInfo.tradeFeePct} />
                </>
            )}

            <div className="mt-2 flex justify-end underline">
                <span
                    onClick={() => setShowDetails(!showDetails)}
                    className="primary-font cursor-pointer hover:underline hover:no-outline"
                    role="button"
                    tabIndex="0"
                >
                    {showDetails ? 'less' : 'more'}
                </span>
            </div>
        </div>
    );
}

export default PriceInfo;

