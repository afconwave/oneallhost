import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class MailerService {
  private transporter: any = null;
  private fromAddress: string;

  constructor() {
    this.fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'Oneallhost <noreply@oneallhost.com>';
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: { user, pass },
      });
    }
  }

  configured() {
    return Boolean(this.transporter);
  }

  public async sendMail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return { success: false, error: 'SMTP_USER and SMTP_PASS are not configured (Google App Password)' };
    }
    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      return { success: false, error: error.message || 'SMTP send failed' };
    }
  }

  public sendOtp(to: string, code: string) {
    return this.sendMail({
      to,
      subject: 'Oneallhost sign-in code',
      text: `Your Oneallhost code is ${code}. It expires in 10 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #EBEBE7;border-radius:12px">
        <div style="background:#091F44;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;margin:-24px -24px 20px">
          <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.7">Oneallhost</p>
          <h1 style="margin:6px 0 0;font-size:20px">Sign-in code</h1>
        </div>
        <p style="color:#333;font-size:14px">Use this code to continue on a remembered device. It expires in 10 minutes.</p>
        <p style="font-size:32px;letter-spacing:.2em;font-weight:800;color:#0D3B85;text-align:center">${code}</p>
        <p style="font-size:12px;color:#6B6E68">If you did not request this, ignore the email.</p>
      </div>`,
    });
  }
}

export const mailerService = new MailerService();
