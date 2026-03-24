import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// API route to create a Cashfree session for the frontend drop-in modal
app.post('/api/create-cashfree-session', async (req, res) => {
  try {
    const { amount, serviceName, customerName, customerEmail, customerPhone } = req.body;

    const orderId = 'ORDER_' + crypto.randomBytes(8).toString('hex');
    const cashfreeOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        // Direct amount from frontend which is naturally already in INR
        order_amount: amount,
        order_currency: 'INR',
        order_id: orderId,
        customer_details: {
          customer_id: 'CUST_' + Date.now().toString().slice(-6),
          customer_name: customerName || 'John Doe',
          customer_email: customerEmail || 'johndoe@example.com',
          customer_phone: customerPhone || '9999999999',
        },
        order_meta: {
          // Requires return_url for orders (Production API strictly requires https://)
          return_url: 'https://localhost:3000/?order_id={order_id}',
        },
        order_note: `Payment for ${serviceName || 'Consultation'}`
      }),
    };

    // Use Cashfree Production URL
    const response = await fetch('https://api.cashfree.com/pg/orders', cashfreeOptions);
    const data = await response.json();

    if (response.ok) {
      // Return payment_session_id to securely initialize client SDK
      res.json({ paymentSessionId: data.payment_session_id, orderId: data.order_id });
    } else {
      res.status(400).json({ error: data.message || 'Failed to create Cashfree order' });
    }
  } catch (error) {
    console.error('Error creating cashfree session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Cashfree Backend API Server running on port ${PORT}`);
});
