import { Router } from 'express';
import { db } from '@oneallhost/db';

const router = Router();

// GET all tickets (Admin)
router.get('/', async (req, res) => {
  try {
    const tickets = await db.ticketsRepo.list();
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET tickets by user (User Dashboard)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await db.ticketsRepo.getByUser(userId);
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single ticket details
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const tickets = await db.ticketsRepo.list();
    const ticket = tickets.find((t: any) => t.id === ticketId);
    
    if (ticket) {
      res.json({ success: true, ticket });
    } else {
      res.status(404).json({ success: false, error: 'Ticket not found' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new ticket
router.post('/', async (req, res) => {
  try {
    const { user_id, subject, category, priority } = req.body;
    const newTicket = await db.ticketsRepo.create({
      user_id,
      subject,
      category,
      priority
    });
    res.json({ success: true, ticket: newTicket });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add message to ticket
router.post('/:ticketId/messages', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { sender_id, sender_name, sender_role, message } = req.body;
    
    const newMessage = await db.ticketsRepo.addMessage(ticketId, {
      sender_id,
      sender_name,
      sender_role,
      message
    });
    
    res.json({ success: true, message: newMessage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update ticket status
router.put('/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const updatedTicket = await db.ticketsRepo.updateStatus(ticketId, status);
    res.json({ success: true, ticket: updatedTicket });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
