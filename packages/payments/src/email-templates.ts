export interface ReceiptEmailData {
  customerName: string;
  invoiceNumber: string;
  itemDescription: string;
  amount: string;
  paymentMethod: string;
  paymentRef: string;
  issueDate: string;
}

export interface RenewalEmailData {
  customerName: string;
  domainName: string;
  expiryDate: string;
  daysRemaining: number;
  renewalPrice: string;
}

export class EmailTemplateEngine {
  public static renderReceiptHtml(data: ReceiptEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${data.invoiceNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAFAF9; color: #111111; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #EBEBE7; border-radius: 12px; padding: 36px; background: #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .header { border-bottom: 1px solid #EBEBE7; padding-bottom: 20px; margin-bottom: 24px; }
    .wordmark { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .wordmark-one { color: #111111; }
    .wordmark-all { color: #7CB342; }
    .wordmark-host { color: #1B6FC9; }
    .title { font-size: 18px; font-weight: 700; margin-top: 24px; margin-bottom: 8px; color: #0D3B85; }
    .meta { font-size: 13px; color: #6B6E68; margin-bottom: 24px; line-height: 1.7; }
    .table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 24px 0; }
    .table th { text-align: left; background: #FAFAF9; padding: 10px 14px; border: 1px solid #EBEBE7; font-weight: 600; }
    .table td { padding: 12px 14px; border: 1px solid #EBEBE7; }
    .total { font-weight: 700; color: #0D3B85; font-size: 16px; }
    .footer { font-size: 11px; color: #6B6E68; margin-top: 32px; border-top: 1px solid #EBEBE7; padding-top: 16px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="wordmark">
        <span class="wordmark-one">One</span><span class="wordmark-all">all</span><span class="wordmark-host">host</span>
      </div>
      <div style="font-size: 12px; color: #6B6E68; margin-top: 4px;">Oneallhost Inc. • Yaoundé, Cameroon • billing@oneallhost.com</div>
    </div>

    <div class="title">Official Payment Receipt & Invoice Confirmation</div>
    <div class="meta">
      <strong>Billed To:</strong> ${data.customerName}<br>
      <strong>Invoice Number:</strong> ${data.invoiceNumber}<br>
      <strong>Date:</strong> ${data.issueDate}<br>
      <strong>Payment Method:</strong> ${data.paymentMethod} (Ref: ${data.paymentRef})
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${data.itemDescription}</td>
          <td style="text-align: right; font-weight: bold;">${data.amount}</td>
        </tr>
        <tr>
          <td><strong>Total Paid</strong></td>
          <td style="text-align: right;" class="total">${data.amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      Your official PDF invoice is ready for download in your client portal.<br>
      Oneallhost Inc., Avenue Kennedy, Yaoundé, Cameroon.
    </div>
  </div>
</body>
</html>
    `;
  }

  public static renderRenewalNoticeHtml(data: RenewalEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Domain Expiration Notice - ${data.domainName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAFAF9; color: #111111; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #EBEBE7; border-radius: 12px; padding: 36px; background: #FFFFFF; }
    .wordmark { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; border-bottom: 1px solid #EBEBE7; padding-bottom: 20px; margin-bottom: 24px; }
    .title { font-size: 18px; font-weight: 700; color: #0D3B85; margin-bottom: 12px; }
    .text { font-size: 13px; color: #111111; line-height: 1.6; margin-bottom: 16px; }
    .badge { display: inline-block; padding: 4px 8px; font-size: 12px; background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; border-radius: 6px; font-weight: bold; }
    .btn { display: inline-block; background-color: #0D3B85; color: #FFFFFF; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-top: 16px; }
    .footer { font-size: 11px; color: #6B6E68; margin-top: 32px; border-top: 1px solid #EBEBE7; padding-top: 16px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="wordmark">
      <span style="color: #111111;">One</span><span style="color: #7CB342;">all</span><span style="color: #1B6FC9;">host</span>
    </div>

    <div class="title">Domain Renewal Reminder</div>
    
    <div class="text">
      Hello ${data.customerName},<br><br>
      Your domain <strong>${data.domainName}</strong> is scheduled to expire on <strong>${data.expiryDate}</strong> (<span class="badge">${data.daysRemaining} days remaining</span>).
    </div>

    <div class="text">
      To prevent interruption to your website traffic and email routing, please renew your registration now.
    </div>

    <a href="https://oneallhost.com/dashboard/domains" class="btn" style="color: #FFFFFF;">Renew Domain (${data.renewalPrice})</a>

    <div class="footer">
      Domain lifecycle reminder per ICANN registrar policy. Oneallhost Inc.
    </div>
  </div>
</body>
</html>
    `;
  }
}
