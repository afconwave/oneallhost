import nodemailer from 'nodemailer';

// Use Ethereal for testing or configure real SMTP from env variables
const createTransporter = async () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendTransactionEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"Oneallhost Billing" <billing@oneallhost.com>',
      to,
      subject,
      html,
    });
    console.log(`[MAILER] Message sent: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[MAILER] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    console.error('[MAILER] Failed to send email:', error);
  }
};
