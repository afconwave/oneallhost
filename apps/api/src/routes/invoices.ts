import { Router, Request, Response } from 'express';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const invoiceRouter = Router();

// 1. Generate sequential PDF invoice (ONH-YYYY-XXXXXX)
invoiceRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      invoiceNumber = `ONH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName = 'Altonixa Client',
      itemDescription = 'Domain Registration: example.com (1 Year)',
      amount = 13.99,
      currency = 'USD',
      paymentMethod = 'card',
      paymentRef = 'ALX-TRANS-98214',
    } = req.body;

    const doc = new jsPDF();
    doc.setTextColor(17, 17, 17);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Oneallhost', 20, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 110, 104);
    doc.text('Oneallhost Inc. - Yaoundé, Cameroon', 20, 27);
    doc.text('NIU: M012612345678X | billing@oneallhost.com', 20, 31);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(13, 59, 133);
    doc.text('OFFICIAL INVOICE & RECEIPT', 130, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text(`Invoice No: ${invoiceNumber}`, 130, 29);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 130, 34);
    doc.text(`Payment: ${paymentMethod.toUpperCase()} (${paymentRef})`, 130, 39);

    autoTable(doc, {
      startY: 50,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: [[itemDescription, '1', `${currency} ${amount}`, `${currency} ${amount}`]],
      theme: 'plain',
      headStyles: { fillColor: [250, 250, 249], textColor: [17, 17, 17], fontStyle: 'bold' },
    });

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
    return res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. Generate linked Credit Note for Refunds / Rebates (CN-YYYY-XXXXXX) (§8f)
invoiceRouter.post('/credit-note', async (req: Request, res: Response) => {
  try {
    const {
      creditNoteNumber = `CN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      originalInvoiceNumber = 'ONH-2026-000142',
      customerName = 'Altonixa Client',
      refundReason = 'Subdomain Rental Purchase Conversion Rebate',
      amount = 7.99,
      currency = 'USD',
    } = req.body;

    const doc = new jsPDF();
    doc.setTextColor(17, 17, 17);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Oneallhost', 20, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 110, 104);
    doc.text('Oneallhost Inc. - Yaoundé, Cameroon', 20, 27);
    doc.text('NIU: M012612345678X | billing@oneallhost.com', 20, 31);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(124, 179, 66);
    doc.text('OFFICIAL CREDIT NOTE', 130, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text(`Credit Note: ${creditNoteNumber}`, 130, 29);
    doc.text(`Linked Invoice: ${originalInvoiceNumber}`, 130, 34);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 130, 39);

    autoTable(doc, {
      startY: 50,
      head: [['Credit Item Description', 'Original Invoice', 'Credit Amount']],
      body: [[refundReason, originalInvoiceNumber, `-${currency} ${amount}`]],
      theme: 'plain',
      headStyles: { fillColor: [250, 250, 249], textColor: [17, 17, 17], fontStyle: 'bold' },
    });

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${creditNoteNumber}.pdf`);
    return res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
