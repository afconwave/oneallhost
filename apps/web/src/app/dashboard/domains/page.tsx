'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import {
  Globe,
  ShieldCheck,
  Lock,
  Settings2,
  Plus,
  Trash2,
  KeyRound,
  Server,
  X,
  Check,
  Copy,
  ArrowRight,
} from 'lucide-react';
import { DomainSearchBar } from '../../../components/DomainSearchBar';
import { BulkDomainSearch } from '../../../components/BulkDomainSearch';

interface DnsRecord {
  id: string;
  type: string;
  host: string;
  value: string;
  ttl: number;
  priority?: number;
}

export default function DomainsManagementPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'register' | 'bulk'>('inventory');
  const [ownedDomains, setOwnedDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Domain Modal State
  const [managingDomain, setManagingDomain] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'dns' | 'nameservers' | 'security' | 'epp'>('dns');
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);

  // New DNS Record Form
  const [newRecType, setNewRecType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'>('A');
  const [newRecHost, setNewRecHost] = useState('@');
  const [newRecValue, setNewRecValue] = useState('');
  const [newRecTtl, setNewRecTtl] = useState(3600);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  // Nameservers state
  const [nsMode, setNsMode] = useState<'default' | 'custom'>('default');
  const [customNs1, setCustomNs1] = useState('ns1.cloudflare.com');
  const [customNs2, setCustomNs2] = useState('ns2.cloudflare.com');

  // EPP Auth code
  const [eppCode, setEppCode] = useState('');
  const [isGeneratingEpp, setIsGeneratingEpp] = useState(false);
  const [copiedEpp, setCopiedEpp] = useState(false);

  // Fetch domains dynamically on mount
  const fetchDomains = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/api/v1/users/domains')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.domains)) {
          setOwnedDomains(data.domains);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // Fetch DNS records when opening modal
  const handleOpenManageModal = (domain: any) => {
    setManagingDomain(domain);
    setModalTab('dns');
    setEppCode('');
    setCopiedEpp(false);

    fetch(`http://localhost:4000/api/v1/domains/${domain.id}/dns`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.records)) {
          setDnsRecords(data.records);
        } else {
          setDnsRecords([]);
        }
      })
      .catch(() => setDnsRecords([]));
  };

  const handleCloseModal = () => {
    setManagingDomain(null);
  };

  // Add DNS Record via live API
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingDomain || !newRecValue) return;

    setIsSavingRecord(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/domains/${managingDomain.id}/dns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newRecType,
          host: newRecHost || '@',
          value: newRecValue,
          ttl: Number(newRecTtl),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDnsRecords((prev) => [...prev, data.record]);
        setNewRecValue('');
      }
    } finally {
      setIsSavingRecord(false);
    }
  };

  // Delete DNS Record via live API
  const handleDeleteRecord = async (recId: string) => {
    if (!managingDomain) return;
    try {
      const res = await fetch(`http://localhost:4000/api/v1/domains/${managingDomain.id}/dns/${recId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDnsRecords((prev) => prev.filter((r) => r.id !== recId));
      }
    } catch {}
  };

  // Toggle WHOIS Privacy via live API
  const handleToggleWhoisPrivacy = async () => {
    if (!managingDomain) return;
    const updatedStatus = !managingDomain.whoisPrivacy;
    try {
      await fetch(`http://localhost:4000/api/v1/domains/${managingDomain.id}/whois`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: updatedStatus }),
      });
      setManagingDomain({ ...managingDomain, whoisPrivacy: updatedStatus });
      setOwnedDomains((prev) =>
        prev.map((d) => (d.id === managingDomain.id ? { ...d, whoisPrivacy: updatedStatus } : d))
      );
    } catch {}
  };

  // Toggle Transfer Lock via live API
  const handleToggleTransferLock = async () => {
    if (!managingDomain) return;
    const updatedStatus = !managingDomain.transferLock;
    try {
      await fetch(`http://localhost:4000/api/v1/domains/${managingDomain.id}/lock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: updatedStatus }),
      });
      setManagingDomain({ ...managingDomain, transferLock: updatedStatus });
      setOwnedDomains((prev) =>
        prev.map((d) => (d.id === managingDomain.id ? { ...d, transferLock: updatedStatus } : d))
      );
    } catch {}
  };

  // Generate EPP Code via live API
  const handleGenerateEpp = async () => {
    if (!managingDomain) return;
    setIsGeneratingEpp(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/domains/${managingDomain.id}/epp`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setEppCode(data.authCode);
      }
    } finally {
      setIsGeneratingEpp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Domain Names & DNS Infrastructure
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Manage your ICANN registrations, Anycast nameservers, zone files, and transfer locks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAFAF9] rounded-xl border border-[#EBEBE7] shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-[#0D3B85] shadow-xs'
                : 'text-[#6B6E68] hover:text-[#111111]'
            }`}
          >
            My Domains ({ownedDomains.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-white text-[#0D3B85] shadow-xs'
                : 'text-[#6B6E68] hover:text-[#111111]'
            }`}
          >
            + Register New
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'bulk'
                ? 'bg-white text-[#0D3B85] shadow-xs'
                : 'text-[#6B6E68] hover:text-[#111111]'
            }`}
          >
            Bulk Search
          </button>
        </div>
      </div>

      {/* TAB 1: DOMAINS INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
            {ownedDomains.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>WHOIS Privacy</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ownedDomains.map((dom) => (
                      <TableRow key={dom.id} className="hover:bg-[#FAFAF9]/80 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0D3B85] shrink-0">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#111111]">{dom.name}</div>
                              <div className="text-[11px] text-[#6B6E68]">Registered: {dom.registeredAt}</div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs text-[#111111] font-medium">{dom.expiresAt}</div>
                        </TableCell>

                        <TableCell>
                          {dom.whoisPrivacy ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5" /> Protected
                            </span>
                          ) : (
                            <span className="text-xs text-[#6B6E68]">Public WHOIS</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenManageModal(dom)}
                            className="h-8 px-3 text-xs gap-1.5 font-semibold text-[#0D3B85] border-[#DCDDD8] hover:bg-blue-50"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <Globe className="w-8 h-8 text-[#6B6E68] mx-auto opacity-40" />
                <div className="text-sm font-semibold text-[#111111]">No domains registered yet</div>
                <p className="text-xs text-[#6B6E68] max-w-sm mx-auto">
                  Search and register permanent domains with instant Anycast DNS propagation and free WHOIS privacy.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D3B85] text-white rounded-xl text-xs font-bold hover:bg-[#1B6FC9]"
                >
                  <span>Search Domains</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER NEW DOMAIN (Live Namecheap XML Search Bar) */}
      {activeTab === 'register' && (
        <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-[#111111] font-display">
              Register New Domain Name
            </h3>
            <p className="text-xs text-[#6B6E68]">
              Search and register live domain names across 400+ extensions with instant Anycast provisioning.
            </p>
          </div>
          <DomainSearchBar />
        </div>
      )}

      {/* TAB 3: BULK SEARCH */}
      {activeTab === 'bulk' && <BulkDomainSearch />}

      {/* =========================================================================
          DEDICATED DOMAIN MANAGEMENT MODAL
         ========================================================================= */}
      {managingDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-[#EBEBE7] max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EBEBE7] flex items-center justify-between bg-[#FAFAF9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111111]">{managingDomain.name}</h3>
                  <div className="text-[11px] text-[#6B6E68] flex items-center gap-2">
                    <span>Expires: {managingDomain.expiresAt}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Anycast Connected</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white border border-[#EBEBE7] flex items-center justify-center text-[#6B6E68] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#EBEBE7] px-6 gap-6 text-xs font-bold text-[#6B6E68] bg-white">
              <button
                type="button"
                onClick={() => setModalTab('dns')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'dns'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent hover:text-[#111111]'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>DNS Zone Records</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('nameservers')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'nameservers'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent hover:text-[#111111]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Nameservers</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('security')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'security'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent hover:text-[#111111]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WHOIS & Transfer Lock</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('epp')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'epp'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent hover:text-[#111111]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>EPP Auth-Code</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
              {/* TAB 1: DNS RECORDS */}
              {modalTab === 'dns' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#111111]">DNS Zone File Records</h4>
                      <p className="text-[11px] text-[#6B6E68]">Direct Anycast edge resolution within 3 minutes.</p>
                    </div>
                  </div>

                  {/* Add Record Form */}
                  <form onSubmit={handleAddRecord} className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-3">
                    <div className="text-xs font-bold text-[#111111]">Add New DNS Record</div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <select
                        value={newRecType}
                        onChange={(e) => setNewRecType(e.target.value as any)}
                        className="h-10 px-2.5 rounded-lg border border-[#DCDDD8] text-xs font-semibold bg-white"
                      >
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="TXT">TXT</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Host (@, www)"
                        value={newRecHost}
                        onChange={(e) => setNewRecHost(e.target.value)}
                        className="h-10 px-3 rounded-lg border border-[#DCDDD8] text-xs font-mono bg-white"
                      />

                      <input
                        type="text"
                        placeholder="Target Value / IP"
                        required
                        value={newRecValue}
                        onChange={(e) => setNewRecValue(e.target.value)}
                        className="h-10 px-3 rounded-lg border border-[#DCDDD8] text-xs font-mono bg-white sm:col-span-2"
                      />

                      <Button
                        variant="primary"
                        size="sm"
                        className="h-10 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs"
                        isLoading={isSavingRecord}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </form>

                  {/* Records List Table */}
                  <div className="bg-white rounded-xl border border-[#EBEBE7] overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#FAFAF9] border-b border-[#EBEBE7] text-[#6B6E68] text-left">
                        <tr>
                          <th className="p-3 font-semibold">Type</th>
                          <th className="p-3 font-semibold">Host</th>
                          <th className="p-3 font-semibold">Target Value</th>
                          <th className="p-3 font-semibold">TTL</th>
                          <th className="p-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEBE7]">
                        {dnsRecords.length > 0 ? (
                          dnsRecords.map((rec) => (
                            <tr key={rec.id} className="hover:bg-[#FAFAF9]">
                              <td className="p-3 font-bold text-[#0D3B85]">{rec.type}</td>
                              <td className="p-3 font-mono">{rec.host}</td>
                              <td className="p-3 font-mono truncate max-w-[200px] text-[#111111]">{rec.value}</td>
                              <td className="p-3 text-[#6B6E68]">{rec.ttl}s</td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecord(rec.id)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-[#6B6E68]">
                              No custom DNS records added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: NAMESERVERS */}
              {modalTab === 'nameservers' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#EBEBE7] space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#111111]">Nameserver Routing Delegation</h4>
                      <p className="text-xs text-[#6B6E68]">Choose between Oneallhost Anycast nameservers or custom providers (Cloudflare, AWS Route53).</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setNsMode('default')}
                        className={`flex-1 p-3 rounded-xl border text-left text-xs transition-all ${
                          nsMode === 'default'
                            ? 'border-[#0D3B85] bg-blue-50/50 text-[#0D3B85] font-bold'
                            : 'border-[#EBEBE7] bg-white text-[#6B6E68]'
                        }`}
                      >
                        <div>Oneallhost Anycast (Recommended)</div>
                        <div className="text-[11px] font-normal text-[#6B6E68] mt-0.5">ns1.oneallhost.com / ns2.oneallhost.com</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNsMode('custom')}
                        className={`flex-1 p-3 rounded-xl border text-left text-xs transition-all ${
                          nsMode === 'custom'
                            ? 'border-[#0D3B85] bg-blue-50/50 text-[#0D3B85] font-bold'
                            : 'border-[#EBEBE7] bg-white text-[#6B6E68]'
                        }`}
                      >
                        <div>Custom Nameservers</div>
                        <div className="text-[11px] font-normal text-[#6B6E68] mt-0.5">Delegate to external DNS providers</div>
                      </button>
                    </div>

                    {nsMode === 'custom' && (
                      <div className="space-y-2 pt-2">
                        <input
                          type="text"
                          value={customNs1}
                          onChange={(e) => setCustomNs1(e.target.value)}
                          placeholder="ns1.provider.com"
                          className="w-full h-10 px-3 rounded-lg border border-[#DCDDD8] text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={customNs2}
                          onChange={(e) => setCustomNs2(e.target.value)}
                          placeholder="ns2.provider.com"
                          className="w-full h-10 px-3 rounded-lg border border-[#DCDDD8] text-xs font-mono"
                        />
                      </div>
                    )}

                    <Button variant="primary" size="sm" className="bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs">
                      Save Nameserver Delegation
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: WHOIS & TRANSFER LOCK */}
              {modalTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#EBEBE7] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#7CB342]" />
                        <span>WHOIS Identity Privacy Guard</span>
                      </div>
                      <div className="text-[11px] text-[#6B6E68] mt-0.5">
                        Masks your personal email, phone, and address from public registrar lookups.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleWhoisPrivacy}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        managingDomain.whoisPrivacy ? 'bg-[#7CB342]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          managingDomain.whoisPrivacy ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#EBEBE7] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#0D3B85]" />
                        <span>60-Day Registrar Transfer Lock</span>
                      </div>
                      <div className="text-[11px] text-[#6B6E68] mt-0.5">
                        Prevents unauthorized domain transfers to other registrars.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleTransferLock}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        managingDomain.transferLock ? 'bg-[#0D3B85]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          managingDomain.transferLock ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: EPP AUTH-CODE */}
              {modalTab === 'epp' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#EBEBE7] space-y-3">
                    <div className="text-xs font-bold text-[#111111]">
                      Authorization / EPP Transfer Code
                    </div>
                    <p className="text-xs text-[#6B6E68] leading-relaxed">
                      If you ever need to transfer <strong>{managingDomain.name}</strong> out to another registrar, generate your unique ICANN EPP Auth-Code below.
                    </p>

                    {!eppCode ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleGenerateEpp}
                        isLoading={isGeneratingEpp}
                        className="bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Generate EPP Code</span>
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl font-mono text-xs font-bold text-[#0D3B85]">
                          <span className="flex-1">{eppCode}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(eppCode);
                              setCopiedEpp(true);
                              setTimeout(() => setCopiedEpp(false), 2000);
                            }}
                            className="p-1 text-[#0D3B85] hover:text-[#1B6FC9]"
                          >
                            {copiedEpp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#0D3B85]" />}
                          </button>
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          Code generated and active for 72 hours per ICANN policy.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#EBEBE7] flex justify-end bg-white">
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
