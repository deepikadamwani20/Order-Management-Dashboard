import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from '../../../api/authApi';

// Rehydrate from localStorage
const token = localStorage.getItem('auth_token');
const email = localStorage.getItem('auth_email');

export const loginThunk = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(credentials);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    email: email || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.email = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_email');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.email = action.payload.email;
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_email', action.payload.email);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;