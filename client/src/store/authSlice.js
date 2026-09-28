import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const errMsg = (e) => e.response?.data?.message || e.message;

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    return (await api.post('/auth/login', data)).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    return (await api.post('/auth/signup', data)).data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    const pending = (s) => { s.loading = true; s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };
    b.addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem('token', a.payload.token);
        localStorage.setItem('user', JSON.stringify(a.payload.user));
      })
      .addCase(loginUser.rejected, rejected)
      .addCase(signupUser.pending, pending)
      .addCase(signupUser.fulfilled, (s) => { s.loading = false; })
      .addCase(signupUser.rejected, rejected);
  },
});

export const { logout, clearError } = slice.actions;
export default slice.reducer;
