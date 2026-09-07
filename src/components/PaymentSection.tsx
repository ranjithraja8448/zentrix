'use client';

import React, { useRef, useState } from 'react';
import { 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Trash2,
  AlertCircle,
  HelpCircle,
  QrCode
} from 'lucide-react';

interface PaymentSectionProps {
  type?: 'internal' | 'external';
  pricePerHead: number; // 150 for internal, 200 for external
  totalMembers: number;
  transactionId: string;
  onTransactionIdChange: (val: string) => void;
  screenshotFile: File | null;
  screenshotPreview: string | null;
  onFileSelect: (file: File | null, preview: string | null) => void;
  isSubmittedAttempt: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  type = 'external',
  pricePerHead,
  totalMembers,
  transactionId,
  onTransactionIdChange,
  screenshotFile,
  screenshotPreview,
  onFileSelect,
  isSubmittedAttempt,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isInternal = type === 'internal';
  const totalAmount = totalMembers * pricePerHead;
  const upiId = 'vasukixlnc@okaxis';
  const accountHolder = 'Vasuki Rajkumar';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onFileSelect(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border-2 backdrop-blur-xl relative overflow-hidden transition-all ${
      isInternal
        ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.15)]'
        : 'bg-slate-900/90 border-pink-500/50 shadow-[0_0_35px_rgba(255,0,127,0.15)]'
    }`}>
      {/* Decorative ambient glow */}
      <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none ${
        isInternal ? 'bg-cyan-500/15' : 'bg-pink-500/15'
      }`} />

      {/* Header & Prominent Fee Display */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-1 ${
            isInternal ? 'text-cyan-400' : 'text-pink-400'
          }`}>
            <CreditCard className="w-4 h-4" />
            <span>{isInternal ? 'Day 1: Inter College Registration Desk' : 'Day 2: External College Registration Desk'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Registration Fee & Verification
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isInternal 
              ? 'TKEC students registration fee: ₹150/- per head. Complete UPI verification below.'
              : 'External college delegates registration fee: ₹200/- per head. Complete UPI verification below.'}
          </p>
        </div>

        {/* Big Prominent Fee Badge */}
        <div className={`flex flex-col items-start md:items-end p-4 rounded-2xl border ${
          isInternal
            ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
            : 'bg-gradient-to-br from-pink-950/80 via-purple-950/60 to-slate-900 border-pink-500/60 shadow-[0_0_20px_rgba(255,0,127,0.3)]'
        }`}>
          <span className={`text-xs uppercase tracking-widest font-semibold ${
            isInternal ? 'text-cyan-300' : 'text-pink-300'
          }`}>
            Registration Fees
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              ₹{pricePerHead}/-
            </span>
            <span className="text-xs text-slate-300">Per Head</span>
          </div>

          {totalMembers > 1 && (
            <div className={`mt-1 pt-1 border-t text-xs font-mono ${
              isInternal ? 'border-cyan-500/30 text-cyan-300' : 'border-pink-500/30 text-pink-300'
            }`}>
              Total: {totalMembers} Members × ₹{pricePerHead} = <strong className="text-white text-sm">₹{totalAmount}/-</strong>
            </div>
          )}
        </div>
      </div>

      {/* QR Code & Payment Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Real QR Code Image Card */}
        <div className="md:col-span-5 flex flex-col items-center p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center relative group">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Google Pay / PhonePe QR
            </span>
          </div>

          {/* Official QR Code Image provided by user */}
          <div className="relative p-2.5 rounded-2xl bg-white shadow-[0_0_30px_rgba(0,240,255,0.4)] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/qr-code.jpg"
              alt="UPI Payment QR Code - Vasuki Rajkumar"
              className="w-52 h-auto rounded-xl object-contain"
            />
          </div>

          <div className="mt-3 text-xs text-slate-300">
            Account Name: <strong className="text-white font-semibold">{accountHolder}</strong>
          </div>

          {/* Direct UPI ID Box with One-Click Copy */}
          <div className="mt-3 w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-left">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>UPI ID (if cannot scan):</span>
              <span className="text-cyan-400 font-medium">Click Copy</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-cyan-300 truncate">
                {upiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shrink-0"
                title="Copy UPI ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 leading-tight">
            💡 Pay ₹{totalAmount}/- using GPay, PhonePe, Paytm, or BHIM.
          </p>
        </div>

        {/* Right Column: Required Inputs (UTR & Screenshot) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-5">
          
          {/* Helpful Callout for manual UPI */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong>QR Code scan panna mudiyalana:</strong> Open your Google Pay, PhonePe, or Paytm app, click <strong>Pay via UPI ID</strong>, enter <strong>{upiId}</strong>, and send ₹{totalAmount}/-.
            </div>
          </div>

          {/* 1. Transaction ID / UTR Input */}
          <div>
            <label
              htmlFor="transaction-id-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Transaction ID / UTR Number <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <input
                id="transaction-id-input"
                type="text"
                required
                value={transactionId}
                onChange={(e) => onTransactionIdChange(e.target.value)}
                placeholder="e.g., 423984019283 (12-digit UTR)"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none transition-all ${
                  isSubmittedAttempt && !transactionId.trim()
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                    : isInternal 
                    ? 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
                    : 'border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                }`}
              />
              {transactionId.trim().length >= 8 && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
            {isSubmittedAttempt && !transactionId.trim() && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Transaction ID / UTR Number is required.
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Found on your UPI transaction receipt after paying ₹{totalAmount}/-.
            </p>
          </div>

          {/* 2. Payment Screenshot Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Payment Screenshot <span className="text-pink-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              id="payment-screenshot"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!screenshotFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  dragOver
                    ? isInternal ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]' : 'border-pink-400 bg-pink-950/30 scale-[1.01]'
                    : isSubmittedAttempt && !screenshotFile
                    ? 'border-red-500 bg-red-950/20'
                    : 'border-slate-700 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-slate-900/60'
                }`}
              >
                <div className={`p-3 rounded-2xl border mb-3 ${
                  isInternal ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-pink-500/20 border-pink-500/30 text-pink-400'
                }`}>
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Click to upload or drag & drop payment screenshot
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, or WEBP up to 5MB
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-cyan-500/40">
                {screenshotPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={screenshotPreview}
                    alt="Payment proof"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {screenshotFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(screenshotFile.size / 1024).toFixed(1)} KB • Screenshot Attached
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
                    <Check className="w-3 h-3" /> Ready for verification
                  </span>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition"
                  title="Remove image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {isSubmittedAttempt && !screenshotFile && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Please attach your payment screenshot.
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            🎟️ <strong>Note:</strong> Registration pass with pass ID will be generated instantly. Food tokens and delegate kits will be distributed at the symposium registration desk.
          </div>

        </div>

      </div>
    </div>
  );
};
