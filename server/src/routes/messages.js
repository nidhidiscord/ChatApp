import { Router } from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = Router();

// previous chat between logged-in user and :userId
router.get('/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.userId, receiver: userId },
      { sender: userId, receiver: req.userId },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

export default router;
