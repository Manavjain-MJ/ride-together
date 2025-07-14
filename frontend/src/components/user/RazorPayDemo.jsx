import React, { useState } from 'react';
import axios from 'axios';

export const RazorPayDemo = () => {

    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            // Step 1: Create an order on the server-side
            const { data } = await axios.post('/payments/create_order', {
                amount: 1500, // Amount in INR (500 for 5.00 INR)
                currency: 'INR',
                receipt: 'receipt#1',
            });

            const options = {
                key: 'rzp_test_xLITjHmCvR82HS', 
                amount: data.amount, // Amount in paise
                currency: data.currency,
                name: 'RideTogether',
                description: 'Test Payment',
                order_id: data.id,
                handler: async (response) => {
                    // Step 2: Verify the payment signature on server-side
                    const verification = await axios.post('/payments/verify_order', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verification.data.status === 'success') {
                        alert('Payment Successful');
                    } else {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9876543210',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (error) {
            console.error('Error creating order', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Pay with Razorpay</h2>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

