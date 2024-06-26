import { getApiInstance } from '../../Chains/api/connect';


async function testExtrinsicCount(api) {
  try {
    // Directly access the storage value
    const extrinsicCount = await api.query.system.extrinsicCount();

    // Log the output to see what we get
    console.log("Extrinsic Count:", extrinsicCount.toString());

    return extrinsicCount.toHuman(); // Convert to a more readable format if it's a complex type
  } catch (error) {
    console.error("Error accessing ExtrinsicCount:", error);
    throw error; // Rethrow or handle error appropriately
  }
}


async function initializeBlockchainConnection(chainKey) {
  const api = await getApiInstance(chainKey);
  return api;
}

export async function performTest() {
  try {
    const chainKey = 'polkadot'; // Replace with your actual chain key
    const api = await initializeBlockchainConnection(chainKey);
    const result = await testExtrinsicCount(api);
    console.log("Test Result:", result);
  } catch (error) {
    console.error("Failed to perform test:", error);
  }
}




const api = await getApiInstance('polkadot'); // Ensure you have a function to get or create an API instance
testExtrinsicCount(api).then(result => {
  console.log("Test Result:", result);
}).catch(error => {
  console.error("Test Failed:", error);
});
