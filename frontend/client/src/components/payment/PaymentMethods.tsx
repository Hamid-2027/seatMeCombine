import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import JazzCashPayment from './JazzCashPayment';
import './styles/paymentMethods.css';

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <div className="payment-methods">
      <h2>Choose Payment Method</h2>
      <div className="method-buttons">
        <button 
          className={selectedMethod === 'stripe' ? 'active' : ''}
          onClick={() => setSelectedMethod('stripe')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <span>Card Payment</span>
        </button>
        <button 
          className={selectedMethod === 'jazzcash' ? 'active' : ''}
          onClick={() => setSelectedMethod('jazzcash')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
            <path d="M12 12h4"></path>
            <path d="M8 12h1"></path>
          </svg>
          <span>JazzCash</span>
        </button>
      </div>
      {selectedMethod && (
        <div className="payment-form">
          {selectedMethod === 'stripe' && <CheckoutForm />}
          {selectedMethod === 'jazzcash' && <JazzCashPayment />}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
