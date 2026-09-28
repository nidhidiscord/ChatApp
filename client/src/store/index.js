import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import chat from './chatSlice';

export default configureStore({ reducer: { auth, chat } });
