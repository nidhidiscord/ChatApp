import jwt from 'jsonwebtoken';
import Message from './models/Message.js';

export function initSocket(io) {
  io.use((socket, next) => {
    try {
      socket.userId = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET).id;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.userId); // personal room (works across multiple tabs/devices)

    socket.on('send_message', async ({ to, text, image, video }) => {
      if (!to || (!text?.trim() && !image && !video)) return;
      const msg = await Message.create({
        sender: socket.userId,
        receiver: to,
        text: text?.trim() || '',
        image: image || '',
        video: video || '',
      });
      io.to(to).to(socket.userId).emit('receive_message', msg); // receiver + sender both get it live
    });
  });
}
