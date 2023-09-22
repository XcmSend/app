const PriceInfo = ({ sellPriceInfo }) => {

}
return (
    <div className="sell-price-info mt-4 bg-white p-2 rounded border border-gray-300 text-gray-700">
    <div><strong>Type:</strong> {sellPriceInfo.type}</div>
    <div><strong>Amount In:</strong> {sellPriceInfo.amountIn}</div>
    <div><strong>Amount Out:</strong> {sellPriceInfo.amountOut}</div>
    <div><strong>Spot Price:</strong> {sellPriceInfo.spotPrice}</div>
    <div><strong>Trade Fee:</strong> {sellPriceInfo.tradeFee}</div>
    <div><strong>Price Impact (%):</strong> {sellPriceInfo.priceImpactPct}</div>
    <div><strong>Trade Fee (%):</strong> {sellPriceInfo.tradeFeePct}</div>
   
</div>
)}
)


export default PriceInfo;