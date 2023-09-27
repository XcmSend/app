import { getHydraDxSpotPrice, getHydraDxSellPrice } from '../Helpers/PriceHelper.js';  

export async function testFunctions() {
    const assetIn = "5"; 
    const assetOut = "10"; 

    const amount = 100;

    console.log('Testing getHydraDxSpotPrice...');
    const spotPrice = await getHydraDxSpotPrice(assetIn, assetOut);
    console.log(`getHydraDxSpotPrice Spot Price: ${spotPrice}`);

    console.log('\nTesting getHydraDxSellPrice...');
    const sellDetails = await getHydraDxSellPrice(assetIn, assetOut, amount);
    console.log(`getHydraDxSellPrice Sell Details:`, sellDetails.toHuman());
}

testFunctions()
    .then(() => {
        console.log('Tests completed.');
    })
    .catch((error) => {
        console.error('Error encountered during tests:', error);
    });
