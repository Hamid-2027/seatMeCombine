const puppeteer = require("puppeteer");
const fs = require("fs");

const generateInvoicePDF = async (invoiceData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const invoiceHTML = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #333; }
        .invoice-box { border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; }
        .invoice-header { text-align: center; font-size: 24px; font-weight: bold; }
        .invoice-details { margin-top: 20px; }
        .invoice-footer { margin-top: 20px; text-align: center; font-size: 12px; color: #555; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="invoice-header">Payment Invoice</div>
        <div class="invoice-details">
          <p><strong>Transaction ID:</strong> ${invoiceData.paymentId}</p>
          <p><strong>Customer Email:</strong> ${invoiceData.email}</p>
          <p><strong>Amount:</strong> $${invoiceData.amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="invoice-footer">
          <p>Thank you for your payment!</p>
        </div>
      </div>
    </body>
    </html>`;

  await page.setContent(invoiceHTML);
  const filePath = `invoice_${invoiceData.paymentId}.pdf`;
  await page.pdf({ path: filePath, format: "A4" });

  await browser.close();
  return filePath; // Return the generated PDF path
};

// Export function for CommonJS
module.exports = generateInvoicePDF;
