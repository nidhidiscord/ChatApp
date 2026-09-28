import { Router } from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const router = Router();

// all other users + unread message count from each
router.get('/', auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select('_id email').sort({ email: 1 }).lean();

  const counts = await Message.aggregate([
    { $match: { receiver: new mongoose.Types.ObjectId(req.userId), read: false } },
    { $group: { _id: '$sender', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  res.json(users.map((u) => ({ ...u, unreadCount: map[u._id.toString()] || 0 })));
});

export default router;
