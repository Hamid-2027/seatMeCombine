# JazzCash Payment Error Fix Guide

## Problem
You were receiving the error: "Sorry! Your transaction could not be processed due to insufficient merchant information" with response code '110' from JazzCash.

## Root Causes Identified

### 1. Missing Environment Variable
- **Issue**: `JAZZCASH_HASH_KEY` was missing from the `.env` file
- **Fix**: Added `JAZZCASH_HASH_KEY='your_hash_key_from_jazzcash_dashboard'` to `.env`

### 2. Incorrect Product Configuration
- **Issue**: Using generic test values for `pp_BankID` and `pp_ProductID`
- **Fix**: Updated to proper values:
  - `pp_BankID: "TBANK"` (for test environment)
  - `pp_ProductID: "RETL"` (retail product type)

### 3. Environment Variable Parsing
- **Issue**: Environment variables had extra quotes that could cause issues
- **Fix**: Added `.replace(/'/g, '')` to clean the values

## Changes Made

### 1. Environment File (.env)
```bash
# Added this line to your .env file:
JAZZCASH_HASH_KEY='your_hash_key_from_jazzcash_dashboard'
```

### 2. Code Improvements (index.js)
- Added environment variable cleaning to remove quotes
- Improved payload configuration with proper JazzCash values
- Added better debugging logs
- Enhanced error handling

## Required Actions for You

### 1. Get Your Actual Hash Key
You need to replace `'your_hash_key_from_jazzcash_dashboard'` with your actual hash key from JazzCash:

1. Log into your JazzCash Merchant Portal
2. Go to Integration Settings or API Settings
3. Copy the **Integrity Salt** or **Hash Key**
4. Replace it in the `.env` file:

```bash
JAZZCASH_HASH_KEY='your_actual_hash_key_here'
```

### 2. Verify Merchant Account Status
Contact JazzCash support to ensure:
- Your merchant account is fully activated
- All required merchant information is complete
- Your account has proper permissions for MWALLET transactions

### 3. Test Environment vs Production
Currently using sandbox URL: `https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction`

For production, change to: `https://payments.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction`

## Testing Steps

1. **Update the hash key** in `.env` file with your actual key
2. **Restart your server**:
   ```bash
   npm start
   ```
3. **Test a small payment** (e.g., 10 PKR)
4. **Check the logs** for improved debugging information

## Common JazzCash Response Codes

- `000`: Success
- `110`: Insufficient merchant information
- `121`: Invalid merchant ID
- `124`: Invalid hash/signature
- `101`: Declined by customer's bank

## Additional Improvements Made

### Better Error Logging
Now logs:
- Environment variable status
- Cleaned merchant credentials
- Full payload being sent to JazzCash

### Improved Payload Structure
- Proper bank ID for test environment
- Correct product type for retail transactions
- Better transaction descriptions

## If Issues Persist

1. **Verify Credentials**: Double-check all three values (Merchant ID, Password, Hash Key)
2. **Contact JazzCash**: Your merchant account might need additional configuration
3. **Check Account Status**: Ensure your merchant account is in "Active" status
4. **Review Integration Guide**: Refer to the latest JazzCash integration documentation

## Next Steps After Fix

Once working:
1. Test with various amounts
2. Test error scenarios (invalid CNIC, insufficient balance)
3. Implement proper transaction logging
4. Add webhook handling for payment status updates
5. Move to production environment when ready

---

**Note**: The test credentials you're using (MC149155) appear to be from JazzCash documentation. Make sure these are your actual assigned credentials for your merchant account. 