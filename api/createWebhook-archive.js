// /api/createWebhook.js



async function createWebhook(req, res) {
  
  const apiKey = process.env.WEBHOOK_SITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    console.log('Creating webhook...');
    // Webhook.site API endpoint to create a new webhook
    const webhookEndpoint = 'https://webhook.site/token';

    const response = await fetch(webhookEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json', // This is important to receive the response in JSON format
        'Content-Type': 'application/json',
        'api-key': apiKey // This is the API key you configured in the .env file
      }

    // const response = {
    //   status: 201,
    //   text: "test",
    //   uuid: 'test'
    // };
    //   body: JSON.stringify({
    //     // Additional configuration or payload as per Webhook.site's API documentation
    //   })
    });
    console.log('Response Status:', response.status); // Log the status
    const rawResponse = await response.text(); // Get the raw response text
    console.log('Raw Response:', rawResponse); // Log the raw response


    if (!response.ok) {
      throw new Error(`Error from Webhook.site: ${response.statusText}`);
    }

     // Parse the raw response to JSON
     const webhookData = JSON.parse(rawResponse);
     res.status(200).json({ uuid: webhookData.uuid });
   } catch (error) {
     console.error('Error creating webhook:', error);
     res.status(500).json({ error: error.message });
   }
 }

 export default createWebhook;
