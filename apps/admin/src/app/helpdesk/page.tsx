'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '@oneallhost/ui';
import { MessageSquare, Clock, AlertCircle, ArrowLeft, Send, CheckCircle2, UserCircle, ShieldCheck } from 'lucide-react';

const toast = {
  success: (msg: string) => console.log('SUCCESS:', msg),
  error: (msg: string) => console.error('ERROR:', msg)
};

export default function AdminHelpdesk() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  const [messageText, setMessageText] = useState('');
  const [supportPin, setSupportPin] = useState('');
  const [isImpersonating, setIsImpersonating] = useState(false);

  const adminId = 'sys-admin-1';

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/v1/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !viewingTicket) return;

    try {
      const res = await fetch(`/api/v1/tickets/${viewingTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: adminId,
          sender_name: 'Support Agent',
          sender_role: 'support_agent',
          message: messageText
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedTicket = { ...viewingTicket };
        updatedTicket.messages.push(data.message);
        setViewingTicket(updatedTicket);
        setMessageText('');
        
        // Auto-update status to answered if it was open
        if (viewingTicket.status === 'open') {
          updateTicketStatus('answered');
        }
      }
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const updateTicketStatus = async (status: string) => {
    if (!viewingTicket) return;
    try {
      const res = await fetch(`/api/v1/tickets/${viewingTicket.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setViewingTicket(data.ticket);
        setTickets(tickets.map(t => t.id === data.ticket.id ? data.ticket : t));
        toast.success(`Ticket marked as ${status}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleImpersonate = async () => {
    if (!supportPin) {
      toast.error('Please enter the 6-digit Support PIN provided by the user');
      return;
    }
    setIsImpersonating(true);
    try {
      const res = await fetch('/api/v1/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: supportPin })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Identity Verified. Now impersonating: ${data.user.email}`);
        // In reality, this would set a cookie/token and open a new tab to the user dashboard
        setTimeout(() => {
          window.open(`http://localhost:3000/dashboard?impersonate_token=${data.impersonationToken}`, '_blank');
        }, 1000);
      } else {
        toast.error(data.error || 'Invalid or Expired Support PIN');
      }
    } catch (err) {
      toast.error('Failed to verify Support PIN');
    } finally {
      setIsImpersonating(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-[#6B6E68]">Loading helpdesk...</div>;
  }

  // --- VIEW: Ticket Conversation ---
  if (viewingTicket) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => { setViewingTicket(null); loadTickets(); }} className="gap-2 bg-white">
              <ArrowLeft className="w-4 h-4" /> Back to Queue
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">[{viewingTicket.id}] {viewingTicket.subject}</h1>
              <div className="flex gap-2 mt-1">
                <span className="text-xs font-mono text-[#0D3B85]">User: {viewingTicket.user_id}</span>
                <Badge variant={viewingTicket.status === 'open' ? 'warning' : viewingTicket.status === 'closed' ? 'neutral' : 'success'}>
                  {viewingTicket.status.toUpperCase()}
                </Badge>
                <Badge variant="info">{viewingTicket.category}</Badge>
                <Badge variant="danger">{viewingTicket.priority}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {viewingTicket.status !== 'closed' && (
              <Button size="sm" variant="outline" onClick={() => updateTicketStatus('closed')} className="border-red-200 text-red-600 hover:bg-red-50">
                Close Ticket
              </Button>
            )}
            {viewingTicket.status === 'closed' && (
              <Button size="sm" variant="outline" onClick={() => updateTicketStatus('open')} className="border-green-200 text-green-600 hover:bg-green-50">
                Reopen Ticket
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card elevation="surface-1" className="flex flex-col h-[600px] border-[#DCDDD8]">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAF9]">
                {viewingTicket.messages.length === 0 ? (
                  <p className="text-center text-[#6B6E68] text-xs">No messages yet.</p>
                ) : (
                  viewingTicket.messages.map((msg: any, i: number) => {
                    const isStaff = msg.sender_role !== 'customer';
                    return (
                      <div key={i} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] text-[#6B6E68] mb-1 px-1 flex items-center gap-1">
                          {!isStaff && <UserCircle className="w-3 h-3" />}
                          {isStaff ? 'You (Staff)' : 'Customer'} • {new Date(msg.timestamp).toLocaleString()}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${isStaff ? 'bg-[#0D3B85] text-white rounded-tr-sm' : 'bg-white border border-[#DCDDD8] text-[#111111] rounded-tl-sm'}`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="p-4 border-t border-[#EBEBE7] bg-white rounded-b-2xl">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your official response..."
                    className="flex-1 rounded-xl border border-[#DCDDD8] p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-[#0D3B85]/20 focus:border-[#0D3B85] outline-none"
                    disabled={viewingTicket.status === 'closed'}
                  />
                  <div className="flex flex-col justify-end">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={!messageText.trim() || viewingTicket.status === 'closed'}
                      className="gap-2 bg-[#0D3B85] hover:bg-[#1B6FC9] px-6 h-11"
                    >
                      Send Reply <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
                {viewingTicket.status === 'closed' && (
                  <p className="text-xs text-center text-red-500 mt-2">Ticket is closed. Reopen to reply.</p>
                )}
              </div>
            </Card>
          </div>
          
          <div className="col-span-1 space-y-4">
             <Card elevation="surface-1" className="p-5 space-y-4 bg-white border-[#DCDDD8]">
                <h3 className="font-bold text-[#111111] border-b border-[#EBEBE7] pb-2">User Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B6E68]">User ID</span>
                    <span className="font-mono font-medium">{viewingTicket.user_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6E68]">Status</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="pt-2 border-t border-[#EBEBE7]">
                    <Button variant="outline" className="w-full text-xs" size="sm">
                      View Full Profile
                    </Button>
                  </div>
                </div>
             </Card>

             <Card elevation="surface-1" className="p-5 space-y-4 bg-[#F0F7FF] border-[#BAE6FD]">
                <h3 className="font-bold text-[#0D3B85] border-b border-[#BAE6FD]/50 pb-2">Support Actions</h3>
                <div className="space-y-2">
                   <Button variant="outline" className="w-full text-xs justify-start bg-white" size="sm">
                     Escalate to Level 2
                   </Button>
                </div>
                
                <div className="pt-4 border-t border-[#BAE6FD]/50">
                  <h4 className="text-xs font-bold text-[#0D3B85] mb-2 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Assume User Identity
                  </h4>
                  <p className="text-[10px] text-[#526B88] mb-3 leading-tight">
                    Enter the 6-digit Support PIN provided by the user to securely login as them without their password.
                  </p>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. 849201" 
                      className="w-full rounded border border-[#BAE6FD] p-2 text-sm text-center tracking-[0.2em] font-mono outline-none focus:border-[#0D3B85]"
                      value={supportPin}
                      onChange={e => setSupportPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full bg-[#0D3B85] hover:bg-[#1B6FC9]"
                      onClick={handleImpersonate}
                      disabled={supportPin.length < 6 || isImpersonating}
                    >
                      {isImpersonating ? 'Verifying...' : 'Impersonate User'}
                    </Button>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: Ticket Queue ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-display text-[#111111]">Support Helpdesk</h1>
          <p className="text-sm text-[#6B6E68] mt-1">Manage customer support requests and issues.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="warning">{tickets.filter(t => t.status === 'open').length} Open Tickets</Badge>
          <Badge variant="info">{tickets.length} Total Tickets</Badge>
        </div>
      </div>

      <Card elevation="surface-1" className="overflow-hidden border-[#DCDDD8]">
        {tickets.length === 0 ? (
          <div className="p-12 text-center bg-white">
            <CheckCircle2 className="w-12 h-12 text-[#7CB342] opacity-50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111111]">Inbox Zero!</h3>
            <p className="text-sm text-[#6B6E68] mt-1">There are no support tickets in the queue.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EBEBE7] bg-white">
            <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-[#6B6E68] uppercase tracking-wider bg-[#FAFAF9]">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Subject</div>
              <div className="col-span-2">User</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2 text-right">Updated</div>
            </div>
            
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#F0F7FF] cursor-pointer transition-colors"
                onClick={() => setViewingTicket(ticket)}
              >
                <div className="col-span-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ticket.status === 'open' ? 'bg-orange-100 text-orange-600' :
                    ticket.status === 'closed' ? 'bg-gray-100 text-gray-500' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {ticket.status === 'open' ? <AlertCircle className="w-4 h-4" /> : 
                     ticket.status === 'closed' ? <MessageSquare className="w-4 h-4" /> :
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
                
                <div className="col-span-5">
                  <h4 className={`text-sm ${ticket.status === 'open' ? 'font-bold text-[#111111]' : 'font-medium text-[#526B88]'}`}>
                    {ticket.subject}
                  </h4>
                  <div className="text-[10px] text-[#6B6E68] font-mono mt-0.5">#{ticket.id}</div>
                </div>
                
                <div className="col-span-2 text-sm text-[#111111] truncate">
                  {ticket.user_id}
                </div>
                
                <div className="col-span-2">
                  <Badge variant="info">{ticket.category}</Badge>
                </div>
                
                <div className="col-span-2 text-right text-xs text-[#6B6E68]">
                  {new Date(ticket.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
