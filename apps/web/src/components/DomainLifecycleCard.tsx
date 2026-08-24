import React from 'react';
import { Card, Badge } from '@oneallhost/ui';
import { Clock, ShieldAlert, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export interface DomainLifecycleCardProps {
  domainName: string;
  expiresAt: string;
  daysRemaining: number;
}

export const DomainLifecycleCard: React.FC<DomainLifecycleCardProps> = ({
  domainName,
  expiresAt,
  daysRemaining,
}) => {
  return (
    <Card elevation="surface-1" className="p-6 space-y-5 border-[#EBEBE7]">
      <div>
        <div className="flex items-center justify-between">
          <Badge variant="info">ICANN Registry Policy</Badge>
          <span className="font-mono text-xs text-[#6B6E68]">Domain Expiry: {expiresAt}</span>
        </div>
        <h3 className="text-sm font-medium text-[#111111] mt-2">
          Explicit Lifecycle Schedule for <span className="font-mono text-[#0D3B85]">{domainName}</span>
        </h3>
        <p className="text-xs text-[#6B6E68] mt-0.5">
          Understanding the 4 stages of domain renewal, recovery fees, and registry release.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {/* Stage 1: Active & Reminders */}
        <div className="p-3 bg-white border border-[#EBEBE7] rounded space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#0D3B85]">STAGE 1</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB342]" />
          </div>
          <div className="font-medium text-[#111111]">Active Registration</div>
          <p className="text-[11px] text-[#6B6E68] leading-tight">
            Email & in-app renewal reminders at 30, 15, and 1 day before expiration.
          </p>
          <div className="font-mono text-[10px] text-[#4E7525]">Standard Price ($13.99)</div>
        </div>

        {/* Stage 2: Grace Period */}
        <div className="p-3 bg-white border border-[#EBEBE7] rounded space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-amber-700">STAGE 2</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="font-medium text-[#111111]">Grace Period (Days 1–30)</div>
          <p className="text-[11px] text-[#6B6E68] leading-tight">
            Site traffic paused, but the domain remains renewable at normal price without penalties.
          </p>
          <div className="font-mono text-[10px] text-[#92400E]">No Late Penalty</div>
        </div>

        {/* Stage 3: Redemption Period */}
        <div className="p-3 bg-white border border-[#EBEBE7] rounded space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-red-700">STAGE 3</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="font-medium text-[#111111]">Redemption (Days 31–60)</div>
          <p className="text-[11px] text-[#6B6E68] leading-tight">
            Domain deleted by registry. Restorable only with mandatory registry redemption surcharge.
          </p>
          <div className="font-mono text-[10px] text-red-700">Registry Fee: $80.00</div>
        </div>

        {/* Stage 4: Release */}
        <div className="p-3 bg-white border border-[#EBEBE7] rounded space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#6B6E68]">STAGE 4</span>
            <XCircle className="w-3.5 h-3.5 text-[#6B6E68]" />
          </div>
          <div className="font-medium text-[#111111]">Final Release & Loss</div>
          <p className="text-[11px] text-[#6B6E68] leading-tight">
            Domain is dropped back into public availability and can be registered by any third party.
          </p>
          <div className="font-mono text-[10px] text-[#6B6E68]">Public Drop</div>
        </div>
      </div>
    </Card>
  );
};
