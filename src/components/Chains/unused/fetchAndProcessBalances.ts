import { toUnit } from '../utils';

// Define a common output structure
interface StandardizedBalance {
    free: string;
    reserved: string;
    frozen?: string;
    total: string;
}

interface RawBalanceHydraDxNative {
    feeFrozen: string;
    free: string;
    miscFrozen: string;
    reserved: string;
}

interface RawBalanceHydraDxAssets {
    free: string;
    frozen: string;
    reserved: string;
}

// For HydraDx native balance
async function fetchHydraDxNativeBalance(accountId: string, signal?: AbortSignal): Promise<RawBalanceHydraDxNative> {
    // Fetch the balance using the specific api.query
    // ... 
}

function processHydraDxNativeBalance(raw: RawBalanceHydraDxNative): StandardizedBalance {
    const free = toUnit(raw.free);
    const reserved = toUnit(raw.reserved);
    const frozen = toUnit(raw.feeFrozen) + toUnit(raw.miscFrozen);
    return {
        free,
        reserved,
        frozen: frozen.toString(),
        total: (free + reserved + frozen).toString(),
    };
}

// For HydraDx assets
async function fetchHydraDxAssetBalance(assetId: number, accountId: string, signal?: AbortSignal): Promise<RawBalanceHydraDxAssets> {
    // Fetch the balance using the specific api.query
    // ...
}

function processHydraDxAssetBalance(raw: RawBalanceHydraDxAssets): StandardizedBalance {
    const free = toUnit(raw.free);
    const reserved = toUnit(raw.reserved);
    const frozen = toUnit(raw.frozen);
    return {
        free,
        reserved,
        frozen: frozen.toString(),
        total: (free + reserved + frozen).toString(),
    };
}

// Your main function
export async function getAssetBalanceForChain(chain: string, assetId: number, accountId: string, signal?: AbortSignal): Promise<StandardizedBalance> {
    let standardizedBalance: StandardizedBalance;

    if (signal && signal.aborted) {
        throw new Error('Operation was aborted');
    }

    switch (chain) {
        case "hydraDx": {
            if (assetId === NATIVE_ASSET_ID) {
                const raw = await fetchHydraDxNativeBalance(accountId, signal);
                standardizedBalance = processHydraDxNativeBalance(raw);
            } else {
                const raw = await fetchHydraDxAssetBalance(assetId, accountId, signal);
                standardizedBalance = processHydraDxAssetBalance(raw);
            }
            break;
        }
        // ... handle other chains here
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }

    return standardizedBalance;
}
