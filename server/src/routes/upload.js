import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import auth from '../middleware/auth.js';
import { s3 } from '../config/s3.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const key = `chat/${crypto.randomUUID()}${path.extname(req.file.originalname)}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );
    res.json({ url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
