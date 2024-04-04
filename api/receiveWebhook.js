// /api/receiveWebhook.js
export default async function(req, res) {
    console.log('Received webhook data:', req.body);
  
    // Process the data as per your application's logic
    // You can store it, forward it, or trigger other actions
  
    // Send a response to acknowledge receipt
    res.status(200).json({ message: 'Webhook data received successfully' });
  }
  