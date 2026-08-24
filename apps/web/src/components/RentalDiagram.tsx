import React from 'react';
import { Clock, Globe, Repeat, ArrowRight, Check } from 'lucide-react';
import { Card, Badge } from '@oneallhost/ui';

export const RentalDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 1: Rent */}
        <Card elevation="surface-1" className="p-6 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#0D3B85] font-medium">STEP 01</span>
              <Badge variant="info">Flexible Term</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-white border border-[#EBEBE7] flex items-center justify-center text-[#0D3B85]">
                <Clock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">Short-term Lease</h3>
            </div>
            <p className="mt-3 text-xs text-[#6B6E68] leading-relaxed">
              Reserve subdomains or event names for days, weeks, or months without long-term annual registrar lock.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EBEBE7] font-mono text-[11px] text-[#111111] flex items-center justify-between">
            <span className="text-[#6B6E68]">From</span>
            <span>$1.50 / day (920 XAF)</span>
          </div>
        </Card>

        {/* Step 2: Use & Deploy */}
        <Card elevation="surface-1" className="p-6 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#0D3B85] font-medium">STEP 02</span>
              <Badge variant="success">Instant Live</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-white border border-[#EBEBE7] flex items-center justify-center text-[#7CB342]">
                <Globe className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">Deploy & Route</h3>
            </div>
            <p className="mt-3 text-xs text-[#6B6E68] leading-relaxed">
              Route traffic instantly to your marketing funnels, temporary event portals, or pilot web applications.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EBEBE7] font-mono text-[11px] text-[#4E7525] flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Automatic SSL Included</span>
          </div>
        </Card>

        {/* Step 3: Convert to Purchase */}
        <Card elevation="surface-1" className="p-6 relative flex flex-col justify-between border-[#1B6FC9]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#1B6FC9] font-medium">STEP 03</span>
              <Badge variant="info">100% Credit</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-white border border-[#CCE2FA] flex items-center justify-center text-[#1B6FC9]">
                <Repeat className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">Convert to Purchase</h3>
            </div>
            <p className="mt-3 text-xs text-[#6B6E68] leading-relaxed">
              Transition seamlessly to full domain ownership. All previous rental payments are credited toward your purchase.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EBEBE7] font-mono text-[11px] text-[#135194] flex items-center justify-between">
            <span className="text-[#6B6E68]">Upsell Credit</span>
            <span>100% Lease Rebate</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
