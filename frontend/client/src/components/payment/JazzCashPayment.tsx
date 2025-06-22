import React, { useState } from 'react';
import axios from 'axios';
import './styles/jazzCashPayment.css';

const JazzCashPayment = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    cnic: '',
    amount: ''
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    cnic: ''
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState('');

  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[-\s]/g, '');
    return cleanPhone.length >= 11 && cleanPhone.length <= 12;
  };

  const validateCNIC = (cnic) => {
    // Check for exact format XXXXX-XXXXXXX-X where X are numbers
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  const formatPhoneNumber = (value) => {
    // Remove non-digits
    const numbers = value.replace(/\D/g, '');
    // Limit to 12 digits
    return numbers.slice(0, 12);
  };

  const formatCNIC = (value) => {
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
      formData.amount > 0
    );
  };

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setErrors({ phoneNumber: '', cnic: '' });
    
    // Validate all fields
    let hasErrors = false;
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Phone number must be 11-12 digits'
      }));
      hasErrors = true;
    }
    
    if (!validateCNIC(formData.cnic)) {
      setErrors(prev => ({
        ...prev,
        cnic: 'CNIC must be in format: XXXXX-XXXXXXX-X'
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoading(true);
    setPaymentStatus(null);
    setMessage('');

    console.log('Processing JazzCash payment:', formData);

    const now = new Date();
    const expiryTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

    const payload = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: "MC149155",
      pp_SubMerchantID: "",
      pp_Password: "0xsg01dhvb",
      pp_BankID: "",
      pp_ProductID: "",
      pp_TxnRefNo: new Date().getTime().toString(),
      pp_Amount: formData.amount,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formatDateTime(now),
      pp_BillReference: "billref",
      pp_Description: "Description of transaction",
      pp_TxnExpiryDateTime: formatDateTime(expiryTime),
      pp_ReturnURL: "https://hamidhussainportfolio.netlify.app/",
      pp_SecureHash: "9002B96FE782C0E57315D0EkkFDC68F11881270ED38187F6AEBC3F95B9E3C475",
      ppmpf_1: formData.phoneNumber,
      ppmpf_2: "",
      ppmpf_3: "",
      ppmpf_4: "",
      ppmpf_5: ""
    };

    console.log('Payload datetime:', {
      current: payload.pp_TxnDateTime,
      expiry: payload.pp_TxnExpiryDateTime
    });

    try {
      const res = await axios.post('http://localhost:5000/process-payment', payload);
        setResponse(res.data);
        setPaymentStatus('success');
        setMessage('Payment processed successfully!');
    } catch (error) {
        setResponse({ error });
        setPaymentStatus('error');
        setMessage('Payment failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cnic') {
      const formattedValue = formatCNIC(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'phoneNumber') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
            maxLength="12"
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
            maxLength="15"
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
          value={formData.amount}
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