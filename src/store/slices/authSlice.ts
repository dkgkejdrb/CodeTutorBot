import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    isLogin: boolean;
    id: string | null;
    isGlobalLoading: boolean;
}

const initialState: AuthState = {
    token: null,
    isLogin: false,
    id: null,
    isGlobalLoading: false
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
        setId(state, action: PayloadAction<string | null>) {
            state.id = action.payload;
        },
        clearId(state) {
            state.id = null;
        },
        setIsGlobalLoading(state, action: PayloadAction<boolean>) {
            state.isGlobalLoading = action.payload;
        }
    }
})

export const { setToken, clearToken, setId, clearId, setIsGlobalLoading } = authSlice.actions;

export default authSlice.reducer;