import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
}

export class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress: string;

  constructor() {
    this.fromAddress = process.env.SMTP_FROM || 'Oneallhost Billing <billing@oneallhost.com>';

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: {
          user,
          pass,
        },
      });
    }
  }

  /**
   * Send transactional email via real Google SMTP
   */
  public async sendMail(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (!this.transporter) {
        console.log(`[SMTP Mailer Notice] Real SMTP not yet configured with App Password. Logged email to ${options.to}: ${options.subject}`);
        return { success: true, messageId: `mock-${Date.now()}` };
      }

      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      console.log(`[SMTP Mailer Success] Email delivered to ${options.to}, MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('[SMTP Mailer Error]', error);
      return { success: false };
    }
  }

  /**
   * Send Official Domain Purchase Tax Invoice Receipt
   */
  public async sendInvoiceReceipt(
    toEmail: string,
    clientName: string,
    invoiceNumber: string,
    domainName: string,
    amountUsd: number,
    amountXaf: number,
    paymentRail: string
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #EBEBE7; border-radius: 12px; background: #ffffff;">
        <div style="border-bottom: 2px solid #0D3B85; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="color: #0D3B85; margin: 0; font-size: 22px;">ONEALLHOST INC.</h1>
          <p style="color: #6B6E68; margin: 4px 0 0 0; font-size: 12px;">ICANN Accredited Infrastructure • Tax Receipt</p>
        </div>

        <h2 style="color: #111111; font-size: 16px; margin-bottom: 12px;">Payment Receipt: ${invoiceNumber}</h2>
        <p style="font-size: 13px; color: #444444; line-height: 1.5;">
          Hello <strong>${clientName}</strong>,<br/>
          Thank you for choosing Oneallhost. Your domain registration payment has been settled successfully.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background: #0D3B85; color: #ffffff;">
              <th style="padding: 10px; text-align: left;">Item Description</th>
              <th style="padding: 10px; text-align: right;">Amount (USD)</th>
              <th style="padding: 10px; text-align: right;">Amount (XAF)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #EBEBE7;">
              <td style="padding: 10px;">Domain Registration: <strong>${domainName}</strong></td>
              <td style="padding: 10px; text-align: right;">$${amountUsd.toFixed(2)}</td>
              <td style="padding: 10px; text-align: right;">${amountXaf.toLocaleString()} XAF</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #F8FAF6; padding: 12px; border-left: 4px solid #7CB342; margin-bottom: 20px; font-size: 12px; color: #333333;">
          <strong>Payment Rail:</strong> ${paymentRail} (Settled)<br/>
          <strong>Status:</strong> Anycast DNS Zone Active • Sub-3-min Global Propagation
        </div>

        <p style="font-size: 11px; color: #888888; text-align: center; margin-top: 24px; border-top: 1px solid #EBEBE7; padding-top: 12px;">
          Oneallhost Inc. • Yaoundé, Cameroon • support@oneallhost.com
        </p>
      </div>
    `;

    return this.sendMail({
      to: toEmail,
      subject: `[Receipt] Oneallhost Domain Registration: ${domainName} (${invoiceNumber})`,
      html,
    });
  }
}

export const mailerService = new MailerService();
