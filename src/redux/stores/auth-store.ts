import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosHttp from "../../lib/axios_client";
import { AxiosError } from "axios";
import { parseError } from "../../lib/error_handler";
import { saveAuthenticationToken } from "../../lib/authentication";
import { ShopAccessPortal } from "../../types/shop";

interface AuthState {
    portal: ShopAccessPortal | null
    token: string | null
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    portal: null,
    token: null,
    loading: false,
    error: null
}

interface LoginSuccessResponse {
    token: string,
    portal: ShopAccessPortal
}

interface LoginPortalPayload {
    username: string
    password: string
}

export const loginPortal = createAsyncThunk('auth/login', async (payload: LoginPortalPayload) => {
    try {
        const response = await axiosHttp.post('/shop-portals/login', payload)
        console.log(response.data);
        return response.data as LoginSuccessResponse
        
    } catch (error) {
        throw parseError(error as AxiosError)
    }
})


export const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginPortal.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginPortal.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.token = action.payload.token
                state.portal = action.payload.portal

                saveAuthenticationToken(action.payload.token)
            })
            .addCase(loginPortal.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message as string
            })
    }
})

export default authSlice.reducer