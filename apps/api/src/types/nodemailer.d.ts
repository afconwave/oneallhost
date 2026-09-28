declare module 'nodemailer' {
  export interface Transporter {
    sendMail(mailOptions: any, callback?: (err: Error | null, info: any) => void): Promise<any>;
    [key: string]: any;
  }
  export interface SendMailOptions {
    from?: string;
    to?: string;
    subject?: string;
    html?: string;
    text?: string;
    attachments?: any[];
    [key: string]: any;
  }
  export function createTransport(options?: any, defaults?: any): Transporter;
  export function createTestAccount(callback?: any): Promise<any>;
  export function getTestMessageUrl(info: any): string | boolean;
  const nodemailer: {
    createTransport: typeof createTransport;
    createTestAccount: typeof createTestAccount;
    getTestMessageUrl: typeof getTestMessageUrl;
  };
  export default nodemailer;
}
