'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { CheckCircle2, XCircle, ArrowRight, Search, Copy } from 'lucide-react';
import Link from 'next/link';

interface BulkSearchResult {
  domainName: string;
  tld: string;
  isAvailable: boolean;
  priceUsd: number;
  priceXaf: number;
}

export const BulkDomainSearch: React.FC = () => {
  const [bulkInput, setBulkInput] = useState(
    'mybusiness.com\nstartuphub.cm\ncloud-edge.africa\npayments.io\nshopnow.store'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<BulkSearchResult[]>([]);

  const takenNames = new Set([
    'google.com', 'apple.com', 'microsoft.com', 'amazon.com', 'netflix.com',
    'facebook.com', 'oneallhost.com', 'orange.cm', 'mtn.cm'
  ]);

  const handleBulkSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    setIsSearching(true);
    const lines = bulkInput
      .split('\n')
      .map((l) => l.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, ''))
      .filter((l) => l.length > 0 && l.includes('.'));

    setTimeout(() => {
      const generated = lines.map((name) => {
        const parts = name.split('.');
        const tld = parts[parts.length - 1] || 'com';
        const isTaken = takenNames.has(name);
        const price = tld === 'cm' ? 37.99 : tld === 'africa' ? 19.99 : tld === 'io' ? 47.99 : 13.99;

        return {
          domainName: name,
          tld,
          isAvailable: !isTaken,
          priceUsd: price,
          priceXaf: Math.round(price * 615.5),
        };
      });

      setResults(generated);
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <Card elevation="surface-1" className="p-6">
        <form onSubmit={handleBulkSearch} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#111111] block mb-1">
              Enter Multiple Domains (One per line, up to 20 domains)
            </label>
            <textarea
              rows={5}
              value={bulkInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkInput(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-white border border-[#DCDDD8] rounded focus:outline-none focus:border-[#1B6FC9]"
              placeholder="brand1.com&#10;brand2.cm&#10;company.africa"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#6B6E68]">
              Supports .com, .cm, .africa, .net, .org, .io, .ai, .store
            </span>
            <Button variant="primary" size="md" isLoading={isSearching}>
              Check bulk availability
            </Button>
          </div>
        </form>
      </Card>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-[#111111] uppercase tracking-wider">
              Bulk Query Results ({results.filter((r) => r.isAvailable).length} Available)
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price / Year</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((res) => (
                <TableRow key={res.domainName}>
                  <TableCell className="font-mono text-xs font-medium text-[#111111]">
                    {res.domainName}
                  </TableCell>
                  <TableCell>
                    {res.isAvailable ? (
                      <Badge variant="success">Available</Badge>
                    ) : (
                      <Badge variant="neutral">Taken</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    ${res.priceUsd.toFixed(2)} ({res.priceXaf.toLocaleString()} XAF)
                  </TableCell>
                  <TableCell className="text-right">
                    {res.isAvailable ? (
                      <Link href={`/checkout?domain=${res.domainName}&amount=${res.priceUsd}`}>
                        <Button variant="primary" size="sm" className="gap-1 text-xs">
                          <span>Register</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-[#6B6E68]">Unavailable</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
