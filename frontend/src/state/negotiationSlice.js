import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as negotiationApi from '../api/negotiationApi';
import { updateCredits } from './authSlice';

export const startMission = createAsyncThunk('negotiation/start', async ({ userId, productId }) => {
    const response = await negotiationApi.startNegotiation(userId, productId);
    return response.data.data;
});

export const submitOffer = createAsyncThunk('negotiation/offer', async (payload, { dispatch }) => {
    const response = await negotiationApi.sendOffer(payload);
    const data = response.data.data;
    if (data.currentCredits !== undefined) {
        dispatch(updateCredits(data.currentCredits));
    }
    return data;
});

export const fetchLeaderboard = createAsyncThunk('negotiation/leaderboard', async () => {
    const response = await negotiationApi.getLeaderboard();
    return response.data.data;
});

export const fetchHistory = createAsyncThunk('negotiation/fetchHistory', async (userId) => {
    const response = await negotiationApi.getHistory(userId);
    return response.data.data;
});

export const finalisePurchase = createAsyncThunk('negotiation/purchase', async ({ userId, productId, amount }, { dispatch }) => {
    const response = await negotiationApi.completePurchase(userId, productId, amount);
    if (response.data.credits !== undefined) {
        dispatch(updateCredits(response.data.credits));
    }
    return response.data;
});

export const wipeNegotiation = createAsyncThunk('negotiation/wipe', async ({ userId, productId }, { dispatch }) => {
    try {
        await negotiationApi.resetNegotiation(userId, productId);
        dispatch(fetchHistory(userId));
        dispatch(fetchLeaderboard());
        return { success: true };
    } catch (e) {
        console.error('Wipe error:', e);
    }
});

const negotiationSlice = createSlice({
    name: 'negotiation',
    initialState: {
        game: null,
        history: [],
        leaderboard: [],
        sessionHistory: [],
        status: 'idle',
        error: null
    },
    reducers: {
        resetGame: (state) => {
            state.game = null;
            state.history = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startMission.fulfilled, (state, action) => {
                state.game = action.payload;
                state.history = action.payload.history;
            })
            .addCase(submitOffer.fulfilled, (state, action) => {
                state.game = action.payload;
                state.history = action.payload.history;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.sessionHistory = action.payload;
            })
            .addCase(wipeNegotiation.fulfilled, (state, action) => {
                if (action.meta.arg.productId) {
                    state.sessionHistory = state.sessionHistory.filter(h => h.productId !== action.meta.arg.productId);
                }
            })
            .addCase(finalisePurchase.fulfilled, (state, action) => {
                 if (state.game) state.game.isPaid = true;
            });
    }
});

export const { resetGame } = negotiationSlice.actions;
export default negotiationSlice.reducer;
