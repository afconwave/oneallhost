'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, toast } from '@oneallhost/ui';
import { Settings, Save, Server, Globe, Plus, Trash2 } from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    adminFetch('/api/admin/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pricing) setPricing(data.pricing);
        else if (data.error) toast.error(data.error);
      })
      .catch(() => toast.error('Failed to load pricing config'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setPricing((prev: any) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleDomainChange = (index: number, field: string, value: string) => {
    setPricing((prev: any) => {
      const newDomains = [...(prev.domain_extensions || [])];
      newDomains[index] = { ...newDomains[index], [field]: field === 'tld' ? value : parseFloat(value) || 0 };
      return { ...prev, domain_extensions: newDomains };
    });
  };

  const addDomain = () => {
    setPricing((prev: any) => ({
      ...prev,
      domain_extensions: [...(prev.domain_extensions || []), { tld: '.new', base: 0, markup: 0 }],
    }));
  };

  const removeDomain = (index: number) => {
    setPricing((prev: any) => ({
      ...prev,
      domain_extensions: (prev.domain_extensions || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await adminFetch('/api/admin/pricing', {
        method: 'PUT',
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (data.success) toast.success('Pricing updated');
      else toast.error(data.error || 'Failed to update pricing');
    } catch {
      toast.error('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-sm text-[#6B6E68]">Loading pricing…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium">Pricing</h1>
          <p className="text-xs text-[#6B6E68]">Staff JWT required. Values persist through pricingRepo.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#0D3B85] text-white">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#EBEBE7] space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold flex items-center gap-2"><Globe className="w-4 h-4" /> Domain TLDs</h2>
            <Button variant="outline" size="sm" onClick={addDomain} className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> Add TLD</Button>
          </div>
          {(pricing.domain_extensions || []).map((dom: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end bg-[#FAFAF9] p-3 rounded-xl">
              <div className="col-span-4"><label className="text-xs">TLD</label><Input value={dom.tld} onChange={(e) => handleDomainChange(index, 'tld', e.target.value)} /></div>
              <div className="col-span-3"><label className="text-xs">Base</label><Input type="number" step="0.01" value={dom.base ?? ''} onChange={(e) => handleDomainChange(index, 'base', e.target.value)} /></div>
              <div className="col-span-3"><label className="text-xs">Markup</label><Input type="number" step="0.01" value={dom.markup ?? ''} onChange={(e) => handleDomainChange(index, 'markup', e.target.value)} /></div>
              <div className="col-span-2"><button type="button" onClick={() => removeDomain(index)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EBEBE7] space-y-3">
            <h2 className="text-sm font-bold flex items-center gap-2"><Server className="w-4 h-4" /> Hosting</h2>
            {['hosting_starter', 'hosting_pro', 'hosting_enterprise'].map((key) => (
              <div key={key}>
                <label className="text-xs font-bold block mb-1">{key}</label>
                <Input type="number" step="0.01" value={pricing[key] || ''} onChange={(e) => handleChange(key, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EBEBE7]">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-2"><Settings className="w-4 h-4" /> Lease base $/week</h2>
            <Input type="number" step="0.01" value={pricing.rental_base || ''} onChange={(e) => handleChange('rental_base', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
