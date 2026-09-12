'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import {
  CountrySelect,
  MtnMomoBadge,
  OrangeMoneyBadge,
  WaveBadge,
  MpesaBadge,
  AirtelMoneyBadge,
  MoovMoneyBadge,
  VisaMastercardBadges,
  ApplePayBadge,
  CryptoBadge,
} from '@/components/ui';
import { useGeoCurrency, detectUserGeoCurrency, GEO_CURRENCY_REGISTRY } from '@/lib/geoCurrency';
import { Card, Badge, Button, Input, toast } from '@oneallhost/ui';

import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  Download,
  ArrowRight,
  Clock,
  Wallet,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type SwychrPayoutMethod, SUPPORTED_AFRICAN_COUNTRIES } from '@oneallhost/payments';

const PREFIX_TO_COUNTRY: Record<string, string> = {
  '256': 'UG',
  '228': 'TG',
  '255': 'TZ',
  '221': 'SN',
  '250': 'RW',
  '234': 'NG',
  '227': 'NE',
  '223': 'ML',
  '254': 'KE',
  '225': 'CI',
  '224': 'GN',
  '233': 'GH',
  '241': 'GA',
  '243': 'CD',
  '242': 'CG',
  '237': 'CM',
  '226': 'BF',
  '229': 'BJ',
};

function detectCountryFromPhone(phoneNum: string): string | null {
  const clean = phoneNum.replace(/[^0-9]/g, '');
  for (const prefix of Object.keys(PREFIX_TO_COUNTRY)) {
    if (clean.startsWith(prefix)) {
      return PREFIX_TO_COUNTRY[prefix];
    }
  }
  return null;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { geoConfig } = useGeoCurrency();

  const domain = searchParams.get('domain') || 'mybusiness.com';
  const rawAmountUsd = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : 13.99;

  // Customer info state with immediate geolocation auto-detection
  const [countryCode, setCountryCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const detected = detectUserGeoCurrency();
      return detected?.countryCode || 'CM';
    }
    return 'CM';
  });
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [passDigitalCharge, setPassDigitalCharge] = useState<boolean>(true);
  const [userBalanceUsd, setUserBalanceUsd] = useState<number>(0);
  const [userBalanceXaf, setUserBalanceXaf] = useState<number>(0);

  // Nigeria bank payment details state
  const [nigerianBanks, setNigerianBanks] = useState<any[]>([]);
  const [bankCode, setBankCode] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');

  // Payment methods state
  const [paymentRail, setPaymentRail] = useState<'momo_direct' | 'card' | 'crypto' | 'wallet_balance'>('momo_direct');
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
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');

  // Exchange rate & Currency dynamically mapped from SUPPORTED_AFRICAN_COUNTRIES
  const countryConfig = SUPPORTED_AFRICAN_COUNTRIES[countryCode] || {
    exchangeRate: 615.5,
    currencyCode: 'XAF',
    currencyName: 'Central African CFA Franc',
  };
  const exchangeRate = countryConfig.exchangeRate;
  const currencyCode = countryConfig.currencyCode;

  const amountLocal = Math.round(rawAmountUsd * exchangeRate);
  const digitalChargeFee = passDigitalCharge ? Math.round(amountLocal * 0.025) : 0;
  const totalChargeLocal = amountLocal + digitalChargeFee;

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPendingConfirmation && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isPendingConfirmation && timeLeft === 0) {
      setIsPendingConfirmation(false);
      setIsExpired(true);
    }
    return () => clearInterval(timer);
  }, [isPendingConfirmation, timeLeft]);

  // Initial country from URL param or client auto-detection
  useEffect(() => {
    const urlCountry = searchParams.get('country');
    if (urlCountry && (SUPPORTED_AFRICAN_COUNTRIES[urlCountry] || urlCountry === 'US')) {
      setCountryCode(urlCountry);
    } else if (geoConfig && geoConfig.countryCode) {
      setCountryCode(geoConfig.countryCode);
      if (!geoConfig.isAfricanRail) {
        setPaymentRail('card');
      }
    }
  }, [searchParams, geoConfig]);

  // Pre-populate user profile on mount & auto-detect country from profile phone
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setCustomerName(data.user.name || '');
            setCustomerEmail(data.user.email || '');
            setUserBalanceUsd(data.user.balanceUsd || 0);
            setUserBalanceXaf(data.user.balanceXaf || 0);
            if (data.user.phone) {
              setMobileNumber(data.user.phone);
              const detected = detectCountryFromPhone(data.user.phone);
              if (detected) {
                setCountryCode(detected);
              }
            }
          }
        }
      } catch (err) {
        // User is not authenticated yet or guest checkout
      }
    }
    loadProfile();
  }, []);

  // Fetch payout methods when country changes
  useEffect(() => {
    async function loadMethods() {
      try {
        const response = await fetch('/api/payments/payout-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country_code: countryCode }),
        });
        if (!response.ok) throw new Error('Failed to fetch payout methods');
        const resJson = await response.json();
        const res = resJson.success ? resJson.data : null;
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

  // Load Nigeria banks list if BANK_TRANSFER method is selected
  useEffect(() => {
    async function loadBanks() {
      if (selectedMethodName === 'BANK_TRANSFER' && nigerianBanks.length === 0) {
        try {
          const res = await fetch('/api/payments/nigeria-banks');
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              setNigerianBanks(json.data);
            }
          }
        } catch (err) {
          console.warn('Failed to load Nigerian banks list');
        }
      }
    }
    loadBanks();
  }, [selectedMethodName, nigerianBanks]);

  const handlePhoneChange = (val: string) => {
    setMobileNumber(val);
    const detected = detectCountryFromPhone(val);
    if (detected) {
      setCountryCode(detected);
    }
  };

  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const txnId = `ONH-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTransactionId(txnId);

    try {
      if (paymentRail === 'wallet_balance') {
        const response = await fetch('/api/users/wallet/pay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountUsd: rawAmountUsd,
            item: `Domain Registration: ${domain}`,
            reference: txnId,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Insufficient wallet balance or payment error');
        }

        const invNo = data.payment?.reference || `ONH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        setInvoiceNumber(invNo);
        setIsSubmitting(false);
        setIsCompleted(true);
      } else if (paymentRail === 'momo_direct') {
        const response = await fetch('/api/payments/create-direct-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country_code: countryCode,
            name: customerName,
            email: customerEmail,
            mobile: mobileNumber,
            transaction_id: txnId,
            amount: amountLocal,
            payment_method: selectedMethodName,
            description: `Domain Registration: ${domain}`,
            pass_digital_charge: passDigitalCharge,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || errData.message || 'Payment initiation failed');
        }

        setIsSubmitting(false);
        setIsPendingConfirmation(true);

        // In a real app we would poll the backend here. For demo, we'll let it countdown unless a webhook is manually triggered.
        setTimeLeft(180);
        setIsExpired(false);
        setIsPendingConfirmation(true);
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
      toast.error(`Payment error: ${error.message}`);
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
    doc.text(`Payment: Online Settlement (${selectedMethodName})`, 130, 39);
    doc.text(`Ref: ${transactionId}`, 130, 44);

    autoTable(doc, {
      startY: 55,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: [
        [
          `Domain Registration: ${domain} (1 Year) with Free WHOIS Privacy`,
          '1',
          `${totalChargeLocal.toLocaleString()} ${currencyCode} ($${rawAmountUsd.toFixed(2)})`,
          `${totalChargeLocal.toLocaleString()} ${currencyCode}`,
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
              <Badge variant="success">Payment Settled Successfully</Badge>
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
                <span className="text-[#6B6E68]">Transaction Reference:</span>
                <span className="font-mono text-[#111111]">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6E68]">Rail / Method:</span>
                <span className="text-[#111111]">{selectedMethodName} Mobile Money</span>
              </div>
              <div className="pt-2 border-t border-[#EBEBE7] flex justify-between font-medium text-sm text-[#0D3B85]">
                <span>Total Settled:</span>
                <span className="font-mono">{totalChargeLocal.toLocaleString()} {currencyCode} (${rawAmountUsd.toFixed(2)})</span>
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
          isExpired ? (
          <Card elevation="surface-1" className="p-8 max-w-xl mx-auto text-center space-y-4 border-[#FADCD9] bg-[#FDF1F0]">
            <Badge variant="danger">Transaction Expired</Badge>
            <h2 className="text-xl font-medium text-[#111111]">Payment Request Timeout</h2>

            <p className="text-xs text-[#6B6E68]">The 3-minute window to complete this transaction has elapsed. Please try again.</p>
            <Button onClick={() => { setIsExpired(false); setIsSubmitting(false); }}>Retry Payment</Button>
          </Card>
        ) : (
          <Card elevation="surface-1" className="p-8 max-w-xl mx-auto text-center space-y-4 border-[#CCE2FA] bg-[#EDF5FD]">
            <Clock className="w-12 h-12 text-[#1B6FC9] mx-auto animate-pulse" />
            <Badge variant="info">Waiting for Phone PIN Confirmation</Badge>
            <h2 className="text-xl font-medium text-[#111111]">Approve Request on Your Phone</h2>
            <p className="text-xs text-[#6B6E68] max-w-md mx-auto leading-relaxed">
              We have dispatched a collection request of <strong className="font-mono text-[#0D3B85]">{totalChargeLocal.toLocaleString()} {currencyCode}</strong> to <strong>{mobileNumber}</strong> ({selectedMethodName}).
            </p>
            <div className="p-3 bg-white border border-[#CCE2FA] rounded font-mono text-xs text-[#135194]">
              Transaction Ref: {transactionId}
            </div>
            <div className="text-[11px] text-[#6B6E68]">
              Do not close this page. Once confirmed on your mobile device, your domain will provision automatically.
            </div>
            <div className="mt-4 text-2xl font-mono text-[#0D3B85]">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </Card>
        )
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Summary Column */}
            <div className="md:col-span-1 space-y-4">
              <Card elevation="surface-1" className="p-5 space-y-4 bg-[#F0F7FF] border-[#BAE6FD] rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0D3B85] uppercase tracking-wider">Order Summary</span>
                  <Badge variant="info">1 Year</Badge>
                </div>

                <div>
                  <div className="text-base font-bold font-mono text-[#0D3B85]">{domain}</div>
                  <div className="text-xs text-[#526B88]">Domain Registration</div>
                </div>

                <div className="pt-3 border-t border-[#BAE6FD]/70 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#526B88]">Domain Price:</span>
                    <span className="font-mono font-semibold text-[#111111]">{amountLocal.toLocaleString()} {currencyCode}</span>
                  </div>
                  {passDigitalCharge && (
                    <div className="flex justify-between text-[#526B88]">
                      <span>Processing (2.5%):</span>
                      <span className="font-mono text-[#111111]">+{digitalChargeFee.toLocaleString()} {currencyCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>WHOIS Privacy:</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#BAE6FD]/70">
                  <div className="flex justify-between items-baseline font-bold text-[#111111]">
                    <span className="text-[#0D3B85]">Total:</span>
                    <div className="text-right">
                      <div className="font-mono text-lg text-[#0D3B85]">{totalChargeLocal.toLocaleString()} {currencyCode}</div>
                      <div className="font-mono text-[11px] text-[#526B88]">(${rawAmountUsd.toFixed(2)} USD)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Initiation Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">Checkout</h1>
                <p className="text-xs text-[#6B6E68] mt-0.5">
                  Select your payment method to complete registration.
                </p>
              </div>

              {/* Rails Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentRail('wallet_balance')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentRail === 'wallet_balance'
                      ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 shadow-xs'
                      : 'bg-[#FAFAF9] border-[#EBEBE7] hover:border-gray-300'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-[#0D3B85]" />
                  <div className="mt-2 text-xs font-bold text-[#111111]">Account Balance</div>
                  <div className="text-[10px] text-[#7CB342] font-semibold">${userBalanceUsd.toFixed(2)} USD</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('momo_direct')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentRail === 'momo_direct'
                      ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 shadow-xs'
                      : 'bg-[#FAFAF9] border-[#EBEBE7] hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#0D3B85]" />
                  <div className="mt-2 text-xs font-bold text-[#111111]">Mobile Money</div>
                  <div className="text-[10px] text-[#6B6E68]">MTN / Orange / Wave</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentRail === 'card'
                      ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 shadow-xs'
                      : 'bg-[#FAFAF9] border-[#EBEBE7] hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#0D3B85]" />
                  <div className="mt-2 text-xs font-bold text-[#111111]">Card</div>
                  <div className="text-[10px] text-[#6B6E68]">Visa / Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentRail('crypto')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentRail === 'crypto'
                      ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 shadow-xs'
                      : 'bg-[#FAFAF9] border-[#EBEBE7] hover:border-gray-300'
                  }`}
                >
                  <img
                    src="/images/payments/usdt-svgrepo-com.png"
                    alt="Tether USDT"
                    className="w-5 h-5 object-contain"
                  />
                  <div className="mt-2 text-xs font-bold text-[#111111]">Tether USDT</div>
                  <div className="text-[10px] text-[#6B6E68]">TRC-20 / ERC-20</div>
                </button>
              </div>

              {/* Form Card */}
              <Card elevation="surface-1" className="p-6">
                <form onSubmit={handleDirectPayment} className="space-y-4">
                  {/* Country Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-1">Country</label>
                      <CountrySelect value={countryCode} onChange={setCountryCode} />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#111111] block mb-1">Full Name</label>
                      <Input
                        value={customerName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  {paymentRail === 'wallet_balance' && (
                    <div className="space-y-3 pt-2 border-t border-[#EBEBE7]">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#091F44] to-[#0D3B85] text-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                            Available Account Balance
                          </span>
                          <span className="text-xs font-mono font-bold text-[#7CB342]">
                            ${userBalanceUsd.toFixed(2)} USD
                          </span>
                        </div>
                        <div className="text-xs text-blue-100">
                          Domain purchase cost: <strong>${rawAmountUsd.toFixed(2)} USD</strong> (≈ {amountLocal.toLocaleString()} XAF)
                        </div>
                        {userBalanceUsd >= rawAmountUsd ? (
                          <div className="text-[11px] text-[#7CB342] font-semibold pt-1 border-t border-white/10">
                            ✓ Sufficient balance available for instant settlement.
                          </div>
                        ) : (
                          <div className="text-[11px] text-red-300 font-semibold pt-1 border-t border-white/10">
                            ⚠ Balance insufficient (${(rawAmountUsd - userBalanceUsd).toFixed(2)} needed). Please top up in dashboard or use Mobile Money.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {paymentRail === 'momo_direct' && (
                    <div className="space-y-4 pt-2 border-t border-[#EBEBE7]">
                      <div>
                        <label className="text-xs font-bold text-[#111111] block mb-2">
                          Select Operator
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableMethods.map((m) => {
                            const isSelected = selectedMethodName === m.payment_method;
                            const pm = m.payment_method.toUpperCase();
                            return (
                              <button
                                key={m.payment_method}
                                type="button"
                                onClick={() => setSelectedMethodName(m.payment_method)}
                                className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white border-[#0D3B85] ring-2 ring-[#0D3B85]/20 shadow-xs'
                                    : 'bg-[#FAFAF9] border-[#EBEBE7] hover:border-gray-300'
                                }`}
                              >
                                {pm.includes('MTN') && <MtnMomoBadge size="sm" />}
                                {pm.includes('ORANGE') && <OrangeMoneyBadge size="sm" />}
                                {pm.includes('WAVE') && <WaveBadge size="sm" />}
                                {(pm.includes('MPESA') || pm.includes('VODACOM')) && <MpesaBadge size="sm" />}
                                {pm.includes('AIRTEL') && <AirtelMoneyBadge size="sm" />}
                                {pm.includes('MOOV') && <MoovMoneyBadge size="sm" />}
                                {!pm.includes('MTN') && !pm.includes('ORANGE') && !pm.includes('WAVE') && !pm.includes('MPESA') && !pm.includes('VODACOM') && !pm.includes('AIRTEL') && !pm.includes('MOOV') && (
                                  <span className="text-xs font-bold text-[#111111]">{m.payment_method}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#111111] block mb-1">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePhoneChange(e.target.value)}
                            placeholder="6XXXXXXXX"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#111111] block mb-1">Email</label>
                          <Input
                            type="email"
                            value={customerEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                            placeholder="name@domain.com"
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
                          Include 2.5% processing fee
                        </span>
                      </label>
                    </div>
                  )}

                  {paymentRail === 'card' && (
                    <div className="space-y-3 pt-2 border-t border-[#EBEBE7]">
                      <div>
                        <label className="text-xs font-bold text-[#111111] block mb-1">Card Number</label>
                        <Input placeholder="4000 1234 5678 9010" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#111111] block mb-1">Expiry (MM/YY)</label>
                          <Input placeholder="08/28" required />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#111111] block mb-1">CVV</label>
                          <Input type="password" placeholder="123" maxLength={4} required />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentRail === 'crypto' && (
                    <div className="space-y-3 pt-2 border-t border-[#EBEBE7]">
                      <div className="p-3 bg-[#FAFAF9] border border-[#DCDDD8] rounded-xl font-mono text-xs text-[#111111] break-all">
                        TNV19xK94pMz8Q48h30aLv492OneAllHostUSDT
                      </div>
                      <p className="text-xs text-[#6B6E68]">
                        Send <strong className="text-[#111111]">${rawAmountUsd.toFixed(2)} USDT (TRC-20)</strong> to the address above.
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#EBEBE7]">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full font-bold bg-[#DE3723] hover:bg-[#C52D1C] text-white rounded-xl h-11"
                      isLoading={isSubmitting}
                      disabled={paymentRail === 'wallet_balance' && userBalanceUsd < rawAmountUsd}
                    >
                      {paymentRail === 'wallet_balance'
                        ? `Pay with Balance ($${rawAmountUsd.toFixed(2)} USD)`
                        : paymentRail === 'momo_direct'
                        ? `Pay ${totalChargeLocal.toLocaleString()} ${currencyCode}`
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
