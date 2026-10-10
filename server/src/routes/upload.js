import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/auth.js';

const router = Router();

const mediaExtensions = {
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/3gpp': '.3gp',
  'video/mp2t': '.ts',
  'video/mp4': '.mp4',
  'video/mpeg': '.mpeg',
  'video/ogg': '.ogv',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
  'video/x-matroska': '.mkv',
  'video/x-msvideo': '.avi',
  'video/x-ms-wmv': '.wmv',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (Object.hasOwn(mediaExtensions, file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only supported image and video files are allowed'));
  },
});

router.post('/', auth, (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const tooLarge = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE';
    const rejectedUpload = error instanceof multer.MulterError
      || error.message === 'Only supported image and video files are allowed';
    res.status(tooLarge ? 413 : rejectedUpload ? 400 : 500).json({
      message: tooLarge
        ? 'Media must be 50 MB or smaller'
        : rejectedUpload
          ? error.message
          : 'Could not store media on the server',
    });
  });
}, (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image or video required' });

  const type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  const { CLOUDINARY_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } = process.env;

  if (!CLOUDINARY_URL && CLOUDINARY_CLOUD_NAME?.startsWith('cloudinary://')) {
    return res.status(503).json({
      message: 'CLOUDINARY_CLOUD_NAME must contain only the cloud name; put a full credential URL in CLOUDINARY_URL',
    });
  }

  let cloudConfig;
  try {
    cloudConfig = CLOUDINARY_URL
      ? cloudinary.config(true)
      : cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
      });
  } catch (error) {
    console.error('Invalid Cloudinary server configuration:', error.message);
    return res.status(503).json({ message: 'Cloudinary configuration is invalid on the server' });
  }

  if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
    return res.status(503).json({ message: 'Cloudinary is not configured on the server' });
  }

  cloudinary.config({ secure: true });

  const stream = cloudinary.uploader.upload_stream({
    asset_folder: CLOUDINARY_FOLDER || 'chat-media',
    public_id: crypto.randomUUID(),
    resource_type: 'auto',
  }, (error, result) => {
    if (error) {
      const details = error.http_code === 404
        ? 'Cloudinary returned 404. Verify CLOUDINARY_CLOUD_NAME in the Cloudinary Dashboard; the console account ID is not the cloud name.'
        : error.message || 'Unknown Cloudinary error';
      console.error('Cloudinary media upload failed:', {
        httpCode: error.http_code,
        message: details.slice(0, 500),
      });
      res.status(502).json({
        message: 'Could not upload media to Cloudinary',
        ...(process.env.NODE_ENV === 'production' ? {} : { details }),
      });
      return;
    }

    if (!result?.secure_url) {
      console.error('Cloudinary media upload failed: no secure URL returned');
      res.status(502).json({ message: 'Cloudinary did not return a media URL' });
      return;
    }

    res.json({ url: result.secure_url, type });
  });

  stream.end(req.file.buffer);
});

export default router;
