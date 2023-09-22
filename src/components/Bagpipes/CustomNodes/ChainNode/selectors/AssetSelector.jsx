export const AssetSelector = ({ assets, handleAssetChange, selectedAsset, isLoading }) => {
    return (
        <div className="asset-selection mb-2">
            <h3 className="text-xxs text-gray-400 primary-font mb-1">Asset</h3>
            {isLoading ? <div className="spinner"></div> : (
                <select 
                    className="asset-selector text-black border border-gray-300 p-2 rounded font-semibold"
                    onChange={handleAssetChange}
                    value={selectedAsset}
                >
                    <option value="">Select an asset</option>
                    {assets.map(asset => (
                        <option key={asset.assetId} value={asset.asset.name}>
                            {asset.asset.name} | AssetId: {asset.assetId}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};
