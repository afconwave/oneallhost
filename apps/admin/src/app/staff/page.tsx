'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, toast } from '@oneallhost/ui';
import { Users, ShieldCheck, Mail, ShieldAlert, KeyRound, UserMinus, Plus } from 'lucide-react';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('support_agent');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await fetch('/api/v1/admin/staff');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff);
      }
    } catch (err) {
      toast.error('Failed to load staff list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
        setShowInvite(false);
        setInviteEmail('');
        loadStaff();
      } else {
        toast.error(data.error || 'Failed to send invite');
      }
    } catch (err) {
      toast.error('Network error during invitation');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this staff member\'s access?')) return;
    try {
      const res = await fetch(`/api/v1/admin/staff/${id}/revoke`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Access revoked successfully');
        loadStaff();
      }
    } catch (err) {
      toast.error('Failed to revoke access');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-xs text-[#6B6E68]">Loading staff...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-display text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-[#0D3B85]" />
            Staff & Role Management
          </h1>
          <p className="text-sm text-[#6B6E68] mt-1">Manage admin portal access, assign roles, and audit permissions.</p>
        </div>
        <Button variant="primary" className="bg-[#0D3B85] gap-2" onClick={() => setShowInvite(true)}>
          <Plus className="w-4 h-4" /> Invite Staff
        </Button>
      </div>

      {showInvite && (
        <Card elevation="surface-1" className="p-6 border-[#DCDDD8] bg-[#F0F7FF]">
          <h3 className="font-bold text-[#0D3B85] mb-4">Invite New Staff Member</h3>
          <form onSubmit={handleInvite} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-bold text-[#111111] block mb-1">Email Address</label>
              <Input 
                type="email" 
                required 
                placeholder="staff@oneallhost.com" 
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-[#111111] block mb-1">Assign Role</label>
              <select 
                className="w-full rounded-md border border-[#DCDDD8] p-2 text-sm outline-none focus:border-[#0D3B85]"
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
              >
                <option value="super_admin">Super Admin</option>
                <option value="support_agent">Support Agent</option>
                <option value="billing_assistant">Billing Assistant</option>
                <option value="domain_assistant">Domain Assistant</option>
                <option value="hosting_assistant">Hosting Assistant</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button type="submit" variant="primary" className="bg-[#0D3B85]">Send Invite</Button>
            </div>
          </form>
        </Card>
      )}

      <Card elevation="surface-1" className="overflow-hidden border-[#DCDDD8] bg-white">
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-[#6B6E68] uppercase tracking-wider bg-[#FAFAF9] border-b border-[#EBEBE7]">
          <div className="col-span-4">Staff Member</div>
          <div className="col-span-3">Role & Permissions</div>
          <div className="col-span-2">2FA Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        
        {staffList.length === 0 ? (
          <div className="p-8 text-center text-[#6B6E68]">No staff members found. Invite some!</div>
        ) : (
          <div className="divide-y divide-[#EBEBE7]">
            {staffList.map((staff: any) => (
              <div key={staff.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF4FF] text-[#0D3B85] flex items-center justify-center font-bold">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">{staff.name}</div>
                    <div className="text-xs text-[#526B88] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {staff.email}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <Badge variant={staff.staffRole === 'super_admin' ? 'warning' : 'info'}>
                    {staff.staffRole.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  {staff.twoFactorEnabled ? (
                    <Badge variant="success" className="gap-1"><ShieldCheck className="w-3 h-3" /> Enforced</Badge>
                  ) : (
                    <Badge variant="danger" className="gap-1"><ShieldAlert className="w-3 h-3" /> Disabled</Badge>
                  )}
                </div>

                <div className="col-span-3 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <KeyRound className="w-3 h-3 mr-1" /> Reset 2FA
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRevoke(staff.id)}>
                    <UserMinus className="w-3 h-3 mr-1" /> Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
