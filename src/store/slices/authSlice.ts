import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    isLogin: boolean;
}

const initialState: AuthState = {
    token: null,
    isLogin: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
            state.isLogin = !!action.payload; // token이 있으면 isLogin은 true, 없으면 false
        },
        clearToken(state) {
            state.token = null;
            state.isLogin = false;
        },

    }
})

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;