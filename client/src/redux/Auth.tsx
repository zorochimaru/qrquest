import { navigate } from '@reach/router';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { show5SecNotification, uiActions } from './Ui';
import jwt_decode from "jwt-decode";
export interface User {
    id: string,
    name: string,
    status: string,
    role: string,
    email: string,
}

export interface AuthState {
    user?: User,
    accessToken?: string,
    jwtExpiry?: string,

};

const initialState: AuthState = {};
const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setJwtToken(state, action: PayloadAction<AuthState>) {
            state.accessToken = action.payload.accessToken;
        },
        login(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
        },
        logOut(state: AuthState) {
            state.user = undefined;
            state.accessToken = undefined;
        },
    },
});

export const register = (data: {
    email: string, password: string, confirmPassword: string,
    name: string
}) => {
    return async (dispatch: any) => {
        const response = await axios.post(`/auth/signup`, data);
        if (response) {
            dispatch(
                show5SecNotification({
                    status: 'success',
                    text: response.data.uiMessage
                })
            );
        }
    }
}

export const login = (data: { email: string, password: string }) => {
    return async (dispatch: any) => {
        const response = await axios.post(`/auth/signin`, data);
        if (response) {
            dispatch(authActions.setJwtToken(response.data.accessToken))
            setAuthToken(response.data.accessToken);
            sessionStorage.setItem('accessToken', response.data.accessToken);
            dispatch(
                uiActions.addNotification({
                    status: 'success',
                    text: 'Loged!'
                })
            )

            const t = setTimeout(() => {
                uiActions.closeNotification(0);
                clearTimeout(t);
            }, 5000);
            dispatch(getUser());
        }
    }
}

export const confirmEmail = (id: string) => {
    return async (dispatch: any) => {
        // process.env.
        await fetch(`confirmation/${id}`);
        dispatch(
            uiActions.addNotification({
                status: 'success',
                text: 'Loged!'
            })
        )
        // TODO redirect to home
        const t = setTimeout(() => {
            uiActions.closeNotification(0);
            clearTimeout(t);
        }, 5000);

    }
}

export const resetPassword = (email: string) => {
    return async (dispatch: any) => {
        try {
            const response = await axios.post(`/auth/reset`, { email });
            dispatch(uiActions.addNotification({ status: 'success', text: response.data.uiMessage }))
        } catch (error) {
            console.log(error)
        }
    }
}

export const getUser = () => {
    return async (dispatch: any) => {
        try {
            const response = await axios.get<User>(`/auth/get-user`);
            dispatch(authActions.login({ user: response.data }));
            navigate(`/`);
        } catch (error) {
            console.log(error)
        }
    }
}

export const logout = () => {
    return async (dispatch: any) => {
        dispatch(authActions.setJwtToken({ accessToken: undefined }));
    }
}

export const setAuthToken = (token: string) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const test = () => {
    return async (dispatch: any) => {
        try {
            const response = await axios.get<any>(`/test`);
            console.log(response.data);
        } catch (error) {
            console.log(error)
        }

    }
}

export const authActions = authSlice.actions;

export default authSlice.reducer;

