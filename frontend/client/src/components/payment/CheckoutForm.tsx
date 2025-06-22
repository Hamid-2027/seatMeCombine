import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import './styles/checkoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); // Success or Failure

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setMessage("Stripe.js has not loaded.");
      setLoading(false);
      return;
    }

    try {
      // Get PaymentIntent clientSecret from backend
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("Invalid clientSecret");
      }

      // Confirm Payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: 'Jenny Rosen',
          },
        },
      });

      if (error) {
        setMessage(`❌ Payment failed: ${error.message}`);
        setPaymentStatus("failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful!");
        setPaymentStatus("success");
        
        // Send invoice to user
        await fetch("http://localhost:5000/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "hamidhussain2027@gmail.com", amount: 10.00, paymentId: paymentIntent.id }),
        });
      } else {
        setMessage("⚠️ Payment was canceled.");
        setPaymentStatus("canceled");
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setPaymentStatus("failed");
    }

    setLoading(false);
  };

  const commonOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1a1f36',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#c53030',
        iconColor: '#c53030',
      },
    },
    showIcon: true,
    iconStyle: 'solid'
  };

  return (
    <form className="stripe-form" onSubmit={handleSubmit}>
      <div className="card-input-wrapper">
        <div className="form-group card-number-group">
          <label>Card number</label>
          <div className="card-input-container">
            <CardNumberElement options={commonOptions} />
          </div>
        </div>

        <div className="card-row">
          <div className="form-group expiry-group">
            <label>Expiration</label>
            <div className="card-input-container">
              <CardExpiryElement options={commonOptions} />
            </div>
          </div>

          <div className="form-group cvc-group">
            <label>Security code</label>
            <div className="card-input-container">
              <CardCvcElement options={commonOptions} />
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className={loading ? 'loading' : ''}
      >
        {loading && <div className="spinner" />}
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {paymentStatus && (
        <div className={`payment-status ${paymentStatus === "success" ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
