# JazzCash Merchant Account Setup Guide

## Current Issue
The error "insufficient merchant information" with response code 110 indicates that your current credentials (`MC149155`, `0xsg01dhvb`) are **sample/documentation credentials** and not actual working merchant credentials.

## Solution: Get Real Merchant Credentials

### Step 1: Register for JazzCash Merchant Account

1. **Visit JazzCash Sandbox Portal**
   - URL: https://sandbox.jazzcash.com.pk/Sandbox
   - Click "SIGN UP" button

2. **Complete Merchant Registration Form**
   - Merchant Name
   - Contact Person Name & Email
   - Phone Number
   - Business Category
   - Create Password

3. **Email Verification**
   - Check your email for verification link
   - Click the link to verify your account

### Step 2: Document Verification

#### For Individual/Sole Proprietor:
- Copy of CNIC (front & back)
- Business Declaration/Registration
- NTN Certificate

#### For Company:
- Certificate of Incorporation
- Memorandum & Articles of Association
- Board Resolution for account opening
- Directors' CNICs
- NTN Certificate

#### For Partnership:
- Partnership Deed (attested)
- All Partners' CNICs
- Authority Letter from all partners

### Step 3: Account Verification Process

1. **Upload Documents**
   - Login to merchant dashboard
   - Go to "Documents" section
   - Upload required documents
   - Submit for verification

2. **Wait for Approval**
   - Verification typically takes 3-5 business days
   - You'll receive email notifications about status

3. **Get Credentials**
   - Once approved, you'll receive:
     - Real Merchant ID
     - Real Password
     - Real Hash Key (Integrity Salt)

### Step 4: Update Your Application

Replace these values in your `.env` file:
```bash
JAZZCASH_MERCHANT_ID=your_real_merchant_id
JAZZCASH_PASSWORD=your_real_password
JAZZCASH_HASH_KEY=your_real_hash_key
```

## Alternative Solutions for Testing

### Option 1: Contact JazzCash Support
- Email: support@jazzcash.com.pk
- Phone: +92-21-111-124-444
- Request proper sandbox/test credentials

### Option 2: Try HTTP POST Integration
Instead of direct API, use page redirection method which might have different requirements:

```html
<form action="https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/" method="post">
    <input type="hidden" name="pp_Version" value="1.1">
    <input type="hidden" name="pp_TxnType" value="MWALLET">
    <input type="hidden" name="pp_Language" value="EN">
    <!-- other fields -->
    <input type="submit" value="Pay with JazzCash">
</form>
```

### Option 3: Use Different Payment Gateway
For immediate testing, consider:
- Stripe (already configured in your app)
- PayPal
- Razorpay
- Other local Pakistani gateways

## Important Notes

1. **Sample Credentials Don't Work**: The credentials in documentation are for reference only
2. **Sandbox vs Production**: Even sandbox requires real merchant registration
3. **Business Requirements**: You need a legitimate business to get approved
4. **Processing Time**: Merchant approval can take several days

## Next Steps

1. **Immediate**: Contact JazzCash support for test credentials
2. **Short-term**: Complete merchant registration process
3. **Long-term**: Move to production environment

## Troubleshooting

If you continue facing issues:
1. Verify your business registration documents
2. Ensure all uploaded documents are clear and valid
3. Contact JazzCash support with your merchant application ID
4. Consider using alternative payment methods during development

---

**Note**: The credentials currently in your system (`MC149155`) are from JazzCash documentation examples and will not work for actual transactions. 