'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input } from '@oneallhost/ui';
import { Badge } from '@oneallhost/ui/src/Badge';
import { MessageSquare, Plus, Clock, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const toast = {
  success: (msg: string) => console.log('SUCCESS:', msg),
  error: (msg: string) => console.error('ERROR:', msg)
};

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingTicket, setViewingTicket] = useState<any | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [messageText, setMessageText] = useState('');

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('technical');
  const [priority, setPriority] = useState('medium');
  const [initialMessage, setInitialMessage] = useState('');

  const userId = 'usr-demo-123'; // Replace with actual auth user ID

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch(`/api/v1/tickets/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create the ticket
      const res = await fetch('/api/v1/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          subject,
          category: department,
          priority
        })
      });
      const data = await res.json();
      
      if (data.success) {
        // 2. Add the initial message
        await fetch(`/api/v1/tickets/${data.ticket.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: userId,
            sender_name: 'Customer',
            sender_role: 'customer',
            message: initialMessage
          })
        });

        toast.success('Support ticket created successfully!');
        setShowNewTicket(false);
        setSubject('');
        setInitialMessage('');
        loadTickets();
      }
    } catch (err) {
      toast.error('Failed to create ticket');
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
          sender_id: userId,
          sender_name: 'Customer',
          sender_role: 'customer',
          message: messageText
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedTicket = { ...viewingTicket };
        updatedTicket.messages.push(data.message);
        setViewingTicket(updatedTicket);
        setMessageText('');
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-[#6B6E68]">Loading tickets...</div>;
  }

  // --- VIEW: Ticket Conversation ---
  if (viewingTicket) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setViewingTicket(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">[{viewingTicket.id}] {viewingTicket.subject}</h1>
            <div className="flex gap-2 mt-1">
              <Badge variant={viewingTicket.status === 'open' ? 'warning' : 'success'}>
                {viewingTicket.status.toUpperCase()}
              </Badge>
              <Badge variant="info">{viewingTicket.category}</Badge>
            </div>
          </div>
        </div>

        <Card elevation="surface-1" className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAF9]">
            {viewingTicket.messages.length === 0 ? (
              <p className="text-center text-[#6B6E68] text-xs">No messages yet.</p>
            ) : (
              viewingTicket.messages.map((msg: any, i: number) => {
                const isStaff = msg.sender_role !== 'customer';
                return (
                  <div key={i} className={`flex flex-col ${isStaff ? 'items-start' : 'items-end'}`}>
                    <div className="text-[10px] text-[#6B6E68] mb-1 px-1">
                      {isStaff ? 'Support Team' : 'You'} • {new Date(msg.timestamp).toLocaleString()}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${isStaff ? 'bg-white border border-[#DCDDD8] text-[#111111]' : 'bg-[#0D3B85] text-white'}`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-4 border-t border-[#EBEBE7] bg-white rounded-b-2xl">
            <form onSubmit={sendMessage} className="flex gap-3">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1"
                disabled={viewingTicket.status === 'closed'}
              />
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!messageText.trim() || viewingTicket.status === 'closed'}
                className="gap-2 bg-[#0D3B85] hover:bg-[#1B6FC9]"
              >
                Send <Send className="w-4 h-4" />
              </Button>
            </form>
            {viewingTicket.status === 'closed' && (
              <p className="text-xs text-center text-red-500 mt-2">This ticket has been closed by the support team.</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // --- VIEW: New Ticket Form ---
  if (showNewTicket) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowNewTicket(false)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Tickets
          </Button>
          <h1 className="text-2xl font-bold text-[#111111]">Open a New Ticket</h1>
        </div>

        <Card elevation="surface-1" className="p-6">
          <form onSubmit={createTicket} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#111111] block mb-1">Subject</label>
              <Input 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder="Briefly describe your issue" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Department</label>
                <select 
                  className="w-full rounded-md border border-[#DCDDD8] p-2 text-sm"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Sales</option>
                  <option value="domains">Domain Names</option>
                  <option value="abuse">Abuse & Security</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">Priority</label>
                <select 
                  className="w-full rounded-md border border-[#DCDDD8] p-2 text-sm"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#111111] block mb-1">Message</label>
              <textarea 
                className="w-full rounded-md border border-[#DCDDD8] p-3 text-sm min-h-[150px]"
                value={initialMessage}
                onChange={e => setInitialMessage(e.target.value)}
                placeholder="Provide as much detail as possible..."
                required
              />
            </div>

            <Button variant="primary" type="submit" className="w-full bg-[#0D3B85]">Submit Ticket</Button>
          </form>
        </Card>
      </div>
    );
  }

  // --- VIEW: Ticket List ---
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Support Tickets</h1>
          <p className="text-sm text-[#6B6E68] mt-1">Need help? Our team is available 24/7.</p>
        </div>
        <Button variant="primary" className="bg-[#0D3B85] hover:bg-[#1B6FC9] gap-2" onClick={() => setShowNewTicket(true)}>
          <Plus className="w-4 h-4" /> Open Ticket
        </Button>
      </div>

      <Card elevation="surface-1" className="overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#1B6FC9] opacity-20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111111]">No Support Tickets</h3>
            <p className="text-sm text-[#6B6E68] mt-1 mb-4">You haven't opened any support requests yet.</p>
            <Button variant="outline" onClick={() => setShowNewTicket(true)}>Open your first ticket</Button>
          </div>
        ) : (
          <div className="divide-y divide-[#EBEBE7]">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="p-5 flex items-center justify-between hover:bg-[#FAFAF9] cursor-pointer transition-colors"
                onClick={() => setViewingTicket(ticket)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ticket.status === 'open' ? 'bg-orange-100 text-orange-600' :
                    ticket.status === 'closed' ? 'bg-gray-100 text-gray-500' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {ticket.status === 'open' ? <AlertCircle className="w-5 h-5" /> : 
                     ticket.status === 'closed' ? <MessageSquare className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111]">{ticket.subject}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#6B6E68] mt-1">
                      <span className="font-mono text-[#0D3B85]">#{ticket.id}</span>
                      <span>•</span>
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>Updated {new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Badge variant={
                    ticket.status === 'open' ? 'warning' :
                    ticket.status === 'closed' ? 'neutral' : 'success'
                  }>
                    {ticket.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
