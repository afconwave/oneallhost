import { Router } from 'express';
import { db } from '@oneallhost/db';
import { requireAuth, requireStaff } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const user = (req as any).user;
    const tickets = user.isStaff
      ? await db.ticketsRepo.list()
      : await db.ticketsRepo.getByUser(user.id);
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;
    if (!user.isStaff && user.id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    const tickets = await db.ticketsRepo.getByUser(userId);
    res.json({ success: true, tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const user = (req as any).user;
    const tickets = user.isStaff
      ? await db.ticketsRepo.list()
      : await db.ticketsRepo.getByUser(user.id);
    const ticket = tickets.find((t: any) => t.id === ticketId);
    if (ticket) res.json({ success: true, ticket });
    else res.status(404).json({ success: false, error: 'Ticket not found' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { subject, category, priority } = req.body;
    const user = (req as any).user;
    const newTicket = await db.ticketsRepo.create({
      user_id: user.id,
      subject,
      category,
      priority,
    });
    res.json({ success: true, ticket: newTicket });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:ticketId/messages', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const user = (req as any).user;
    const newMessage = await db.ticketsRepo.addMessage(ticketId, {
      sender_id: user.id,
      sender_name: user.name,
      sender_role: user.isStaff ? 'support' : 'client',
      message,
    });
    res.json({ success: true, message: newMessage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:ticketId/status', requireStaff, async (req, res) => {
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
