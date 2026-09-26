'use client';

import React, { useState } from 'react';
import { Button, Input, toast } from '@oneallhost/ui';
import { Megaphone, Trash2 } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetAnnouncement = async () => {
    if (!title || !message) {
      toast.error('Title and message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Global banner successfully updated for all users.');
        setTitle('');
        setMessage('');
      } else {
        toast.error(data.error || 'Failed to update announcement.');
      }
    } catch (e) {
      toast.error('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAnnouncement = async () => {
    if (!confirm('Are you sure you want to remove the active banner?')) return;
    try {
      const res = await fetch('/api/admin/announcements/active', { method: 'DELETE' });
      if (res.ok) {
        toast.success('Banner successfully cleared.');
      }
    } catch (e) {
      toast.error('Network error.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#111111]">Marketing & Announcements</h1>
          <p className="text-xs text-[#6B6E68] mt-0.5">
            Manage active promos, system news, and alerts broadcasted to the user dashboard.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#EBEBE7] max-w-2xl">
        <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4 text-[#0D3B85]" />
          Set Global Dashboard Banner
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#111111] block mb-1">Banner Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#FAFAF9] border border-[#EBEBE7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0D3B85]"
            >
              <option value="info">Information (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning / Alert (Orange)</option>
              <option value="promo">Promotional (Purple)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111111] block mb-1">Title / Tag (e.g. FLASH SALE, MAINTENANCE)</label>
            <Input
              placeholder="Enter tag..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111111] block mb-1">Message Content</label>
            <Input
              placeholder="Enter full announcement text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleSetAnnouncement}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Banner'}
            </Button>

            <Button
              variant="outline"
              onClick={handleClearAnnouncement}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Active Banner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
