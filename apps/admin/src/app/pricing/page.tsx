'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, toast } from '@oneallhost/ui';
import { Settings, Save, Server, Globe, Plus, Trash2 } from 'lucide-react';

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/pricing')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.pricing) {
          setPricing(data.pricing);
        }
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load pricing config');
        setIsLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setPricing((prev: any) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleDomainChange = (index: number, field: string, value: string) => {
    setPricing((prev: any) => {
      const newDomains = [...(prev.domain_extensions || [])];
      if (field === 'tld') {
        newDomains[index][field] = value;
      } else {
        newDomains[index][field] = parseFloat(value) || 0;
      }
      return { ...prev, domain_extensions: newDomains };
    });
  };

  const addDomain = () => {
    setPricing((prev: any) => ({
      ...prev,
      domain_extensions: [...(prev.domain_extensions || []), { tld: '.new', base: 0, markup: 0 }]
    }));
  };

  const removeDomain = (index: number) => {
    setPricing((prev: any) => ({
      ...prev,
      domain_extensions: (prev.domain_extensions || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Pricing successfully updated!');
      } else {
        toast.error('Failed to update pricing');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 animate-pulse text-sm text-[#6B6E68]">Loading pricing configuration...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111] font-display">Dynamic Pricing Engine</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Manage base prices and markup margins for domains, hosting tiers, and subdomain leases.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#0D3B85] text-white">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOMAINS */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#EBEBE7] space-y-6">
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-3">
            <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7CB342]" /> Domain Pricing & Margins
            </h2>
            <Button variant="outline" size="sm" onClick={addDomain} className="h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Add TLD
            </Button>
          </div>

          <div className="space-y-4">
            {(pricing.domain_extensions || []).map((dom: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end bg-[#FAFAF9] p-3 rounded-xl border border-[#EBEBE7]">
                <div className="col-span-4">
                  <label className="text-xs font-bold text-[#6B6E68] block mb-1">TLD</label>
                  <Input type="text" value={dom.tld} onChange={e => handleDomainChange(index, 'tld', e.target.value)} />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-bold text-[#6B6E68] block mb-1">Base ($)</label>
                  <Input type="number" step="0.01" value={dom.base === 0 ? '' : dom.base} onChange={e => handleDomainChange(index, 'base', e.target.value)} />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-bold text-[#111111] block mb-1">Markup ($)</label>
                  <Input type="number" step="0.01" value={dom.markup === 0 ? '' : dom.markup} onChange={e => handleDomainChange(index, 'markup', e.target.value)} />
                </div>
                <div className="col-span-2 pb-1">
                  <button onClick={() => removeDomain(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full flex justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold">
            Final domain price is dynamically calculated as Base Cost + Markup.
          </div>
        </div>

        {/* HOSTING & RENTALS */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#EBEBE7] space-y-6">
            <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2 border-b border-[#EBEBE7] pb-3">
              <Server className="w-4 h-4 text-[#1B6FC9]" /> Cloud Hosting Plans
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Starter Tier ($/mo)</label>
                <Input type="number" step="0.01" value={pricing.hosting_starter || ''} onChange={e => handleChange('hosting_starter', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Professional Tier ($/mo)</label>
                <Input type="number" step="0.01" value={pricing.hosting_pro || ''} onChange={e => handleChange('hosting_pro', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Enterprise Tier ($/mo)</label>
                <Input type="number" step="0.01" value={pricing.hosting_enterprise || ''} onChange={e => handleChange('hosting_enterprise', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#EBEBE7] space-y-6">
            <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2 border-b border-[#EBEBE7] pb-3">
              <Settings className="w-4 h-4 text-purple-600" /> Subdomain Leases
            </h2>

            <div>
              <label className="text-xs font-bold text-[#111111] block mb-1">Base Rental Price ($/week)</label>
              <Input type="number" step="0.01" value={pricing.rental_base || ''} onChange={e => handleChange('rental_base', e.target.value)} />
              <p className="text-[10px] text-[#6B6E68] mt-1">This price is charged for the staging lease and rebated upon domain purchase.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
