// /api/createWebhook.js



export default async function createWebhook(req, res) {
  // res.setHeader('Access-Control-Allow-Credentials', true)
  // res.setHeader('Access-Control-Allow-Origin', '*')
  // // another common pattern
  // // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  // res.setHeader(
  //   'Access-Control-Allow-Headers',
  //   'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  // )

  // if (req.method === 'OPTIONS') {
  //   res.status(200).end()
  //   return
  // }
  // Run the middleware
  console.log('createWebhook running midleware...');


    const apiKey = process.env.WEBHOOK_SITE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    try {
      console.log('createWebhook Creating webhook...');
      const webhookEndpoint = 'https://webhook.site/token';

      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey,        
        }
        // include body if required
      });

      console.log('Response Status:', response.status);
      const rawResponse = await response.text();
      console.log('Raw Response:', rawResponse);

      if (!response.ok) {
        throw new Error(`Error from Webhook.site: ${response.statusText}`);
      }

      const webhookData = JSON.parse(rawResponse);
      res.status(200).json({ uuid: webhookData.uuid });
    } catch (error) {
      console.error('Error creating webhook:', error);
      res.status(500).json({ error: error.message });
    };
}
