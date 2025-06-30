import React, { useState } from 'react';
import axios from 'axios';
import './styles/jazzCashPayment.css';

const JazzCashPayment = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    cnic: '',
    amount: null as number | null,
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    cnic: ''
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[-\s]/g, '');
    return cleanPhone.length >= 11 && cleanPhone.length <= 12;
  };

  const validateCNIC = (cnic: string): boolean => {
    // Check for exact format XXXXX-XXXXXXX-X where X are numbers
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove non-digits
    const numbers = value.replace(/\D/g, '');
    // Limit to 12 digits
    return numbers.slice(0, 12);
  };

  const formatCNIC = (value: string): string => {
    // Remove non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format with dashes
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0,5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0,5)}-${numbers.slice(5,12)}-${numbers.slice(12,13)}`;
  };

  const isFormFilled = () => {
    return (
      formData.phoneNumber.trim() !== '' &&
      formData.cnic.trim() !== '' &&
      formData.amount !== null && formData.amount > 0
    );
  };



  

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation logic
    if (!validatePhoneNumber(formData.phoneNumber) || !validateCNIC(formData.cnic)) {
      if (!validatePhoneNumber(formData.phoneNumber)) {
        setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 11-12 digits' }));
      }
      if (!validateCNIC(formData.cnic)) {
        setErrors(prev => ({ ...prev, cnic: 'CNIC must be in format: XXXXX-XXXXXXX-X' }));
      }
      return;
    }

    setLoading(true);
    setPaymentStatus(null);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3001/api/payment/jazzcash-pay', {
        amount: formData.amount,
        mobileNumber: formData.phoneNumber,
        cnic: formData.cnic,
      });
      console.log("Response....................",JSON.stringify(res.data,null,2));

      // The backend now sends a clean status and message
      if (res.data.status === 'success') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
      }
      setMessage(res.data.message);
    } catch (error: any) {
      console.error('API Error:', error.response || error);
      setResponse({ error: error.response ? error.response.data : 'An unexpected error occurred.' });
      setPaymentStatus('error');
      setMessage(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cnic') {
      const formattedValue = formatCNIC(value);
      setFormData(prev => ({ ...prev, cnic: formattedValue }));
    } else if (name === 'phoneNumber') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, phoneNumber: cleanValue }));
    } else if (name === 'amount') {
      setFormData(prev => ({ ...prev, amount: value === '' ? null : Number(value) }));
    }
  };

  return ( 
  <div>
    <form className="jazzcash-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <div className="input-wrapper">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="03XXXXXXXXX"
            value={formData.phoneNumber}
            onChange={handleChange}
            // pattern="03[0-9]{9,10}"
            maxLength={12}
            inputMode="numeric"
            required
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cnic">CNIC</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="cnic"
            name="cnic"
            placeholder="XXXXX-XXXXXXX-X"
            value={formData.cnic}
            onChange={handleChange}
            pattern="\d{5}-\d{7}-\d{1}"
            maxLength={15}
            inputMode="numeric"
            required
          />
          {errors.cnic && <span className="error-message">{errors.cnic}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          placeholder="Enter PKR"
          value={formData.amount === null ? '' : formData.amount}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <button 
        type="submit" 
        className="submit-button" 
        disabled={loading || !isFormFilled()}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>

    {paymentStatus && (
      <div className={`payment-status ${paymentStatus === "success" ? "success" : "error"}`}>
        {message}
      </div>
    )}
  </div>
  );
};

export default JazzCashPayment;