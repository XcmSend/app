
import config from '../config';

async function callCreateWebhookAPI() {
  try {
    console.log("Calling createWebhook API...");
    // const response = await axios.post(`${baseURL}/api/createWebhook`, { withCredentials: true });
const response = await fetch(`${config.baseURL}/api/webhook/createWebhook`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',

    // No CORS headers should be here
  },
  // Include body if required
});
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("createWebhook API response...");

    const data = await response.json();
    return data.uuid;
  } catch (error) {
    console.error("Failed to create webhook:", error);
  }
}

export default callCreateWebhookAPI;
