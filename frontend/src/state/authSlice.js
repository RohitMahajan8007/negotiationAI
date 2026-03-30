import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authApi.login(credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const fetchMe = createAsyncThunk('auth/me', async (username) => {
    const response = await api.get(`/auth/profile/${username}`);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
});

export const topUpCredits = createAsyncThunk('auth/topup', async ({ username, amount }) => {
    const response = await api.post('/auth/topup', { username, amount });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
});

export const updateProfile = createAsyncThunk('auth/update', async ({ currentUsername, username, fullName, email, password }) => {
    const response = await api.post('/auth/update', { currentUsername, username, fullName, email, password });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await authApi.register(userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateCredits: (state, action) => {
            if (state.user) {
                state.user.credits = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(topUpCredits.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            });
    }
});

export const { logout, updateCredits, clearError } = authSlice.actions;
export default authSlice.reducer;
