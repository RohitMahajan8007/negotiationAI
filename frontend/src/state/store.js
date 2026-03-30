import { configureStore } from '@reduxjs/toolkit';
import negotiationReducer from './negotiationSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        negotiation: negotiationReducer,
        auth: authReducer,
    },
});

export default store;
