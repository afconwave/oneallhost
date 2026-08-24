'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, Badge, Button, Input } from '@oneallhost/ui';
import {
  CreditCard,
  Smartphone,
  Bitcoin,
  ShieldCheck,
  CheckCircle2,
  Download,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { swychrClient, SwychrPayoutMethod } from '@oneallhost/payments';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const domain = searchParams.get('domain') || 'mybusiness.com';
  const rawAmountUsd = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : 13.99;

  // Customer info state
  const [countryCode, setCountryCode] = useState<string>('CM');
  const [customerName, setCustomerName] = useState<string>('Aloah Milton');
  const [customerEmail, setCustomerEmail] = useState<string>('aloahmilton9@gmail.com');
  const [mobileNumber, setMobileNumber] = useState<string>('675405180');
  const [passDigitalCharge, setPassDigitalCharge] = useState<boolean>(true);

  // Payment methods state
  const [paymentRail, setPaymentRail] = useState<'momo_direct' | 'card' | 'crypto'>('momo_direct');
  const [availableMethods, setAvailableMethods] = useState<SwychrPayoutMethod[]>([
    { payment_method: 'MTN', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
    { payment_method: 'ORANGE', mobile_format: '6XXXXXXXX', applicable_mobileno_length: '9' },
  ]);
  const [selectedMethodName, setSelectedMethodName] = useState<string>('MTN');

  // Processing & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');

  const xafRate = 615.5;
  const amountXaf = Math.round(rawAmountUsd * xafRate);
  const digitalChargeFee = passDigitalCharge ? Math.round(amountXaf * 0.025) : 0;
  const totalChargeXaf = amountXaf + digitalChargeFee;

  useEffect(() => {
    async function loadMethods() {
      try {
        const res = await swychrClient.getPayoutMethods(countryCode);
        if (res && res.payment_methods && res.payment_methods.length > 0) {
          setAvailableMethods(res.payment_methods);
          setSelectedMethodName(res.payment_methods[0].payment_method);
        }
      } catch (err) {
        console.warn('Could not load live payout methods, using defaults');
      }
    }
    loadMethods();
  }, [countryCode]);

  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const txnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTransactionId(txnId);

    try {
      if (paymentRail === 'momo_direct') {
        await swychrClient.createPaymentRequest({
          country_code: countryCode,
          name: customerName,
          email: customerEmail,
          mobile: mobileNumber,
          transaction_id: txnId,
          amount: amountXaf,
          payment_method: selectedMethodName,
          description: `Domain Registration: ${domain}`,
          pass_digital_charge: passDigitalCharge,
          source: 'Oneallhost-Swychr',
        });

        setIsSubmitting(false);
        setIsPendingConfirmation(true);

        setTimeout(() => {
          const invNo = `ONH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
          setInvoiceNumber(invNo);
          setIsPendingConfirmation(false);
          setIsCompleted(true);
        }, 3000);
      } else {
        setTimeout(() => {
          const invNo = `ONH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
          setInvoiceNumber(invNo);
          setIsSubmitting(false);
          setIsCompleted(true);
        }, 1200);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      alert(`Payment error: ${error.message}`);
    }
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setTextColor(17, 17, 17);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Oneallhost', 20, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 110, 104);
    doc.text('Oneallhost Inc. • Yaoundé, Cameroon', 20, 27);
    doc.text('Tax NIU: M012612345678X | billing@oneallhost.com', 20, 31);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(13, 59, 133);
    doc.text('OFFICIAL INVOICE & RECEIPT', 130, 22);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text(`Invoice No: ${invoiceNumber}`, 130, 29);
    doc.text(`Issue Date: ${new Date().toLocaleDateString('en-GB')}`, 130, 34);
    doc.text(`Payment: Swychr Direct (${selectedMethodName})`, 130, 39);
    doc.text(`Ref: ${transactionId}`, 130, 44);

    autoTable(doc, {
      startY: 55,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: [
        [
          `Domain Registration: ${domain} (1 Year) with Free WHOIS Privacy`,
          '1',
          `${totalChargeXaf.toLocaleString()} XAF ($${rawAmountUsd.toFixed(2)})`,
          `${totalChargeXaf.toLocaleString()} XAF`,
        ],
      ],
      theme: 'plain',
      headStyles: { fillColor: [250, 250, 249], textColor: [17, 17, 17], fontStyle: 'bold' },
    });

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {isCompleted ? (
          <Card elevation="surface-1" className="p-8 max-w-2xl mx-auto text-center space-y-5 border-[#D6E8C2] bg-[#F3F8EC]">
            <CheckCircle2 className="w-12 h-12 text-[#4E7525] mx-auto" />
            
            <div>
              <Badge variant="success">Payment Settled via Swychr Direct API</Badge>
              <h1 className="mt-3 text-2xl font-medium text-[#111111]">
                Registration Provisioned!
              </h1>
              <p className="mt-1 text-xs text-[#6B6E68]">
                Your domain <strong className="font-mono text-[#0D3B85]">{domain}</strong> is active on Oneallhost nameservers.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#DCDDD8] rounded text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6E68]">Invoice Number:</span>
                <span className="font-mono text-[#111111] font-medium">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E68]">Swychr Transaction ID:</span>
                <span className="font-mono text-[#111111]">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E68]">Rail / Method:</span>
                <span className="text-[#111111]">{selectedMethodName} Mobile Money</span>
              </div>
              <div className="pt-2 border-t border-[#EBEBE7] flex justify-between font-medium text-sm text-[#0D3B85]">
                <span>Total Settled:</span>
                <span className="font-mono">{totalChargeXaf.toLocaleString()} XAF (${rawAmountUsd.toFixed(2)})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2" onClick={handleDownloadInvoice}>
                <Download className="w-4 h-4" />
                <span>Download PDF Invoice</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-2"
                onClick={() => router.push('/dashboard/domains')}
              >
                <span>Manage in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ) : isPendingConfirmation ? (
          <Card elevation="surface-1" className="p-8 max-w-xl mx-auto text-center space-y-4 border-[#CCE2FA] bg-[#EDF5FD]">
            <Clock className="w-12 h-12 text-[#1B6FC9] mx-auto animate-pulse" />
            <Badge variant="info">Waiting for Phone PIN Confirmation</Badge>
            <h2 className="text-xl font-medium text-[#111111]">Approve Request on Your Phone</h2>
            <p className="text-xs text-[#6B6E68] max-w-md mx-auto leading-relaxed">
              We have dispatched a collection request of <strong className="font-mono text-[#0D3B85]">{totalChargeXaf.toLocaleString()} XAF</strong> to <strong>{mobileNumber}</strong> ({selectedMethodName}).
            </p>
            <div className="p-3 bg-white border border-[#CCE2FA] rounded font-mono text-xs text-[#135194]">
              Transaction Ref: {transactionId}
            </div>
            <div className="text-[11px] text-[#6B6E68]">
              Do not close this page. Once confirmed on your mobile device, your domain will provision automatically.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Summary Column */}
            <div className="md:col-span-1 space-y-4">
              <Card elevation="surface-1" className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#0D3B85] uppercase">Order Summary</span>
                  <Badge variant="info">1 Year</Badge>
                </div>

                <div>
                  <div className="text-sm font-medium font-mono text-[#111111]">{domain}</div>
                  <div className="text-xs text-[#6B6E68] mt-0.5">ICANN Accredited Registration</div>
                </div>

                <div className="pt-3 border-t border-[#EBEBE7] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B6E68]">Standard Fee:</span>
                    <span className="font-mono">{amountXaf.toLocaleString()} XAF</span>
                  </div>
                  {passDigitalCharge && (
                    <div className="flex justify-between text-[#6B6E68]">
                      <span>Digital Collection (2.5%):</span>
                      <span className="font-mono">+{digitalChargeFee.toLocaleString()} XAF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#4E7525]">
                    <span>WHOIS Privacy:</span>
                    <span>FREE</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBEBE7]">
                  <div className="flex justify-between items-baseline font-medium text-[#111111]">
                    <span>Total:</span>
                    <div className="text-right">
                      <div className="font-mono text-base text-[#0D3B85]">{totalChargeXaf.toLocaleString()} XAF</div>
                      <div className="font-mono text-[11px] text-[#6B6E68]">(${rawAmountUsd.toFixed(2)} USD)</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#EBEBE7] rounded text-[11px] text-[#6B6E68] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#4E7525] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Direct API Encryption</span>
                  </div>
                  <p>Processed securely via Swychr Direct Mobile Money Rails.</p>
                </div>
              </Card>
            </div>

            {/* Payment Initiation Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-xl font-medium text-[#111111]">Swychr Direct API Payment</h1>
                <p className="text-xs text-[#6B6E68] mt-0.5">
                  Direct mobile money collection across 18 African countries without external page redirects.
                </p>
              </div>

              {/* Rails Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentRail('momo_direct')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
                    paymentRail === 'momo_direct'
                      ? 'bg-white border-[#1B6FC9] ring-1 ring-[#1B6FC9]'
                      : 'bg-[#FAFAF9] border-[#EBEBE7]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#0D3B85]" />
                  <div className="mt-2 text-xs font-medium text-[#111111]">Mobile Money</div>
                  <div className="text-[10px] text-[#6B6E68]">Direct API (Swychr)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('card')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
                    paymentRail === 'card'
                      ? 'bg-white border-[#1B6FC9] ring-1 ring-[#1B6FC9]'
                      : 'bg-[#FAFAF9] border-[#EBEBE7]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#1B6FC9]" />
                  <div className="mt-2 text-xs font-medium text-[#111111]">Credit / Debit Card</div>
                  <div className="text-[10px] text-[#6B6E68]">Visa & Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('crypto')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
                    paymentRail === 'crypto'
                      ? 'bg-white border-[#1B6FC9] ring-1 ring-[#1B6FC9]'
                      : 'bg-[#FAFAF9] border-[#EBEBE7]'
                  }`}
                >
                  <Bitcoin className="w-4 h-4 text-[#7CB342]" />
                  <div className="mt-2 text-xs font-medium text-[#111111]">Cryptocurrency</div>
                  <div className="text-[10px] text-[#6B6E68]">USDT / BTC</div>
                </button>
              </div>

              {/* Form Card */}
              <Card elevation="surface-1" className="p-6">
                <form onSubmit={handleDirectPayment} className="space-y-4">
                  {/* Country Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#111111] block mb-1">Country</label>
                      <select
                        value={countryCode}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)}
                        className="w-full h-[38px] px-3 bg-white border border-[#DCDDD8] rounded text-xs focus:outline-none focus:border-[#1B6FC9]"
                      >
                        <option value="CM">Cameroon (CM)</option>
                        <option value="CI">Côte d'Ivoire (CI)</option>
                        <option value="SN">Senegal (SN)</option>
                        <option value="BF">Burkina Faso (BF)</option>
                        <option value="ML">Mali (ML)</option>
                        <option value="TG">Togo (TG)</option>
                        <option value="BJ">Benin (BJ)</option>
                        <option value="GA">Gabon (GA)</option>
                        <option value="CD">DR Congo (CD)</option>
                        <option value="CG">Congo Brazzaville (CG)</option>
                        <option value="GH">Ghana (GH)</option>
                        <option value="NG">Nigeria (NG)</option>
                        <option value="KE">Kenya (KE)</option>
                        <option value="RW">Rwanda (RW)</option>
                        <option value="TZ">Tanzania (TZ)</option>
                        <option value="UG">Uganda (UG)</option>
                        <option value="ZM">Zambia (ZM)</option>
                        <option value="MW">Malawi (MW)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#111111] block mb-1">Full Name</label>
                      <Input
                        value={customerName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {paymentRail === 'momo_direct' && (
                    <div className="space-y-4 pt-2 border-t border-[#EBEBE7]">
                      <div>
                        <label className="text-xs font-medium text-[#111111] block mb-1.5">
                          Available Payment Operator in {countryCode}
                        </label>
                        <div className="flex gap-2">
                          {availableMethods.map((m) => (
                            <button
                              key={m.payment_method}
                              type="button"
                              onClick={() => setSelectedMethodName(m.payment_method)}
                              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                                selectedMethodName === m.payment_method
                                  ? 'bg-white border-[#1B6FC9] text-[#0D3B85]'
                                  : 'bg-[#FAFAF9] border-[#EBEBE7] text-[#6B6E68]'
                              }`}
                            >
                              {m.payment_method} ({m.mobile_format})
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-[#111111] block mb-1">
                            Mobile Number (format: {availableMethods.find(m => m.payment_method === selectedMethodName)?.mobile_format || '6XXXXXXXX'})
                          </label>
                          <Input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value)}
                            placeholder="651791902"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-[#111111] block mb-1">Customer Email</label>
                          <Input
                            type="email"
                            value={customerEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={passDigitalCharge}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassDigitalCharge(e.target.checked)}
                          className="rounded border-[#DCDDD8] text-[#0D3B85] focus:ring-[#1B6FC9]"
                        />
                        <span className="text-xs text-[#6B6E68]">
                          Include 2.5% digital cash processing surcharge in mobile collection
                        </span>
                      </label>
                    </div>
                  )}

                  {paymentRail === 'card' && (
                    <div className="space-y-3 pt-2 border-t border-[#EBEBE7]">
                      <div>
                        <label className="text-xs font-medium text-[#111111] block mb-1">Card Number</label>
                        <Input placeholder="4000 1234 5678 9010" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-[#111111] block mb-1">MM/YY</label>
                          <Input placeholder="08/28" required />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#111111] block mb-1">CVC</label>
                          <Input type="password" placeholder="123" maxLength={4} required />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentRail === 'crypto' && (
                    <div className="space-y-3 pt-2 border-t border-[#EBEBE7]">
                      <div className="p-3 bg-white border border-[#DCDDD8] rounded font-mono text-xs text-[#111111] break-all">
                        TNV19xK94pMz8Q48h30aLv492OneAllHostUSDT
                      </div>
                      <p className="text-[11px] text-[#6B6E68]">
                        Send exactly <strong className="text-[#111111]">${rawAmountUsd.toFixed(2)} USDT (TRC-20)</strong>.
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#EBEBE7]">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full font-medium"
                      isLoading={isSubmitting}
                    >
                      {paymentRail === 'momo_direct'
                        ? `Authorize ${totalChargeXaf.toLocaleString()} XAF on ${selectedMethodName}`
                        : `Pay $${rawAmountUsd.toFixed(2)} USD`}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#6B6E68]">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
