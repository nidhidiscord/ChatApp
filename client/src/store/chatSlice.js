import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchUsers = createAsyncThunk('chat/users', async () => (await api.get('/users')).data);
export const fetchMessages = createAsyncThunk('chat/messages', async (userId) => (await api.get(`/messages/${userId}`)).data);

const slice = createSlice({
  name: 'chat',
  initialState: { users: [], selectedUser: null, messages: [] },
  reducers: {
    selectUser(state, a) { state.selectedUser = a.payload; state.messages = []; },
    addMessage(state, a) {
      if (!state.messages.some((m) => m._id === a.payload._id)) state.messages.push(a.payload);
    },
    incrementUnread(state, a) {
      const u = state.users.find((x) => x._id === a.payload);
      if (u) u.unreadCount = (u.unreadCount || 0) + 1;
    },
    clearUnread(state, a) {
      const u = state.users.find((x) => x._id === a.payload);
      if (u) u.unreadCount = 0;
    },
    // `readerId` read my messages -> flip them to read in the open conversation
    markMessagesRead(state, a) {
      if (state.selectedUser?._id !== a.payload) return;
      state.messages.forEach((m) => { if (m.receiver === a.payload) m.read = true; });
    },
    resetChat: () => ({ users: [], selectedUser: null, messages: [] }),
  },
  extraReducers: (b) => {
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.users = a.payload; })
      .addCase(fetchMessages.fulfilled, (s, a) => { s.messages = a.payload; });
  },
});

export const { selectUser, addMessage, incrementUnread, clearUnread, markMessagesRead, resetChat } = slice.actions;
export default slice.reducer;
