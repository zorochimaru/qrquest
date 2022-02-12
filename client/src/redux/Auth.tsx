import { navigate } from '@reach/router';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import ROLES from '../models/roles.model';
import { toast } from 'react-toastify';
import { httpClient } from '../api/httpClient';

export interface User {
    id: string,
    name: string,
    status: string,
    role: ROLES,
    email: string,
}

export interface AuthState {
    user?: User,
    accessToken?: string,
};

const initialState: AuthState = {};

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logOut(state: AuthState) {
            state.user = undefined;
        },
    },
});

export const register = (data: {
    email: string, password: string, confirmPassword: string,
    name: string
}) => {
    return async (dispatch: any) => {
        const response = await httpClient.post(`/auth/signup`, data);
        if (response) {
            toast.success(response.data.message)
        }
    }
}

export const login = (data: { email: string, password: string }) => {
    return async (dispatch: any) => {
        const response = await httpClient.post(`/auth/signin`, data);
        if (response?.status === 200) {
            toast.success('Loged!');
            dispatch(getUser());
            navigate(`/`);
        }
    }
}

export const confirmEmail = (token: string) => {
    return async (dispatch: any) => {

        const responce = await httpClient.get(`/auth/confirmation/${token}`);
        if (responce?.status === 200) {
            toast.success(responce.data.message);
        }
        navigate('/');
    }
}

export const sendResetPasswordEmail = (email: string) => {

    return async (dispatch: any) => {
        try {
            const response = await httpClient.post(`/auth/reset-password`, { email });
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/');
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const resetPassword = (token: string, password: string, confirmPassword: string) => {

    return async (dispatch: any) => {
        try {
            const response = await httpClient.post(`/auth/confirm-password`, { token, password, confirmPassword });
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const getUser = () => {
    return async (dispatch: any) => {
        try {
            const response = await httpClient.get<AuthState>(`/auth/get-user`);
            if (response) {
                dispatch(authActions.login(response.data));
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const logOut = () => {
    return async (dispatch: any) => {
        try {
            const response = await httpClient.post(`/auth/logout`);
            if (response) {
                dispatch(authActions.logOut());
                navigate(`/login`);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const authActions = authSlice.actions;

export default authSlice.reducer;

