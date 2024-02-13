import axios from 'axios';


class WebhooksService {
    constructor() {
        this.csrfToken = null;
    }

    initialize(token) {
        this.csrfToken = token;
    }

 async fetchWebhookEvents(eventReceived) {

    if (eventReceived) {
        return; // Exit the function if an event has already been received
      }

    try {
      const response = await axios.get('http://localhost:5005/api/webhook/webhookEvents'); // Replace with your actual API endpoint
      console.log('createWebhook Received Webhook Event:', response.data); // Log the event data
      return response.data; // Return the data
    //   return response.data; // Return the data for further processing
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  async fetchLatestFromWebhookSite(uuid) {
    try {
        console.log('Fetching latest webhook data with UUID:', uuid);   
        const response = await axios.get(`http://localhost:5005/api/webhook/fetchWebhookData/${uuid}`); // Replace with your actual API endpoint
        console.log('Latest Webhook Data:', response.data); // Log the data
        console.log('Webhook event received:', response.data.data);

        return response.data; // Return the data for further processing
    } catch (error) {
        console.error('Error fetching latest webhook data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}
}

  export default new WebhooksService();
