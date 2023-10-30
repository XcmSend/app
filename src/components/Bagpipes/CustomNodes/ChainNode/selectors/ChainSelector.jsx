export const ChainSelector = ({ chainList, handleChainChange, selectedChain }) => {
    return (
        <div className="chain-selection mb-2">
            <h3 className="text-xxs text-gray-400 primary-font mb-1">Chain</h3>
            <select 
                className="chain-selector font-semibold text-black border border-gray-300 p-2 rounded"
                onChange={handleChainChange}
                value={selectedChain}
            >
                <option value="" selected>Select chain</option>
                {chainList.map(ChainInfo => (
                    <option key={ChainInfo.name} value={ChainInfo.name}>
                        {ChainInfo.display}
                    </option>
                ))}
            </select>
        </div>
    );
};
