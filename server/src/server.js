import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import { initSocket } from './socket.js';

const app = express();
app.use(cors({ origin: * }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });
initSocket(io);

await mongoose.connect(process.env.MONGO_URI);
server.listen(process.env.PORT || 5000, () => console.log('Server running'));
