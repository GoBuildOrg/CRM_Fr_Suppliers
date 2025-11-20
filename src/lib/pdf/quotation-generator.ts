export async function generateQuotationPDF(quotation: any): Promise<string> {
    // Simple HTML-based PDF generation (can be enhanced with jsPDF or pdfmake)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotation ${quotation.quotationNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #2563eb;
    }
    .company-info h1 {
      margin: 0;
      color: #2563eb;
      font-size: 28px;
    }
    .quotation-info {
      text-align: right;
    }
    .quotation-number {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #1f2937;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background-color: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .text-right {
      text-align: right;
    }
    .totals-table {
      width: 350px;
      margin-left: auto;
      margin-top: 20px;
    }
    .totals-table td {
      padding: 8px 12px;
    }
    .total-row {
      font-weight: bold;
      font-size: 18px;
      background-color: #f3f4f6;
    }
    .terms {
      margin-top: 40px;
      padding: 20px;
      background-color: #f9fafb;
      border-left: 4px solid #2563eb;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${quotation.supplierCompany.name}</h1>
      <p>${quotation.supplierCompany.email || ''}</p>
      <p>${quotation.supplierCompany.phone || ''}</p>
      ${quotation.supplierCompany.gstNumber ? `<p>GST: ${quotation.supplierCompany.gstNumber}</p>` : ''}
    </div>
    <div class="quotation-info">
      <div class="quotation-number">${quotation.quotationNumber}</div>
      <p><strong>Date:</strong> ${new Date(quotation.createdAt).toLocaleDateString()}</p>
      <p><strong>Valid Until:</strong> ${new Date(quotation.validUntil).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${quotation.status}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Bill To:</div>
    <p><strong>${quotation.customerCompany.name}</strong></p>
    <p>${quotation.customerCompany.contactPerson || ''}</p>
    <p>${quotation.customerCompany.email || ''}</p>
    <p>${quotation.customerCompany.phone}</p>
    ${quotation.customerCompany.gstNumber ? `<p>GST: ${quotation.customerCompany.gstNumber}</p>` : ''}
  </div>

  <div class="section">
    <div class="section-title">${quotation.title}</div>
    ${quotation.description ? `<p>${quotation.description}</p>` : ''}
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th style="width: 5%">#</th>
          <th style="width: 40%">Item Description</th>
          <th style="width: 15%" class="text-right">Quantity</th>
          <th style="width: 10%">Unit</th>
          <th style="width: 15%" class="text-right">Rate (₹)</th>
          <th style="width: 15%" class="text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${quotation.items.map((item: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <strong>${item.itemName}</strong>
              ${item.description ? `<br><small style="color: #6b7280;">${item.description}</small>` : ''}
            </td>
            <td class="text-right">${item.quantity.toFixed(2)}</td>
            <td>${item.unit}</td>
            <td class="text-right">${item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="text-right">${item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <table class="totals-table">
      <tr>
        <td>Subtotal:</td>
        <td class="text-right">₹ ${quotation.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td>Tax (${quotation.taxPercent}%):</td>
        <td class="text-right">₹ ${quotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      ${quotation.discount > 0 ? `
      <tr>
        <td>Discount:</td>
        <td class="text-right">- ₹ ${quotation.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      ` : ''}
      <tr class="total-row">
        <td>Total:</td>
        <td class="text-right">₹ ${quotation.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    </table>
  </div>

  ${quotation.terms ? `
  <div class="terms">
    <div class="section-title">Terms & Conditions</div>
    <p style="white-space: pre-wrap;">${quotation.terms}</p>
  </div>
  ` : ''}

  ${quotation.notes ? `
  <div class="section">
    <div class="section-title">Notes</div>
    <p style="white-space: pre-wrap;">${quotation.notes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>This is a computer-generated quotation and does not require a signature.</p>
    <p>For any queries, please contact us at ${quotation.supplierCompany.email || quotation.supplierCompany.phone}</p>
  </div>
</body>
</html>
  `;

    return html;
}

export function downloadPDF(html: string, filename: string) {
    // Create a blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
