import { navigate } from '@reach/router';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { uiActions } from './Ui';


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
};

const initialState: AuthState = {};
const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthState>) {
            state.user = action.payload.user;
        },
        logOut(state: AuthState) {
            state.user = undefined;
            sessionStorage.removeItem('accessToken');
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
                uiActions.addNotification({
                    message: response.data.message,
                    options: { variant: 'success' }
                })
            );
        }
    }
}

export const login = (data: { email: string, password: string }) => {
    return async (dispatch: any) => {
        const response = await axios.post(`/auth/signin`, data);
        if (response) {
            sessionStorage.setItem('accessToken', response.data.accessToken);
            uiActions.addNotification({
                message: 'Loged!',
                options: { variant: 'success' }
            })
            dispatch(getUser());
        }
    }
}

export const confirmEmail = (token: string) => {
    return async (dispatch: any) => {

        const responce = await fetch(`/auth/confirmation/${token}`);
        if (responce.ok) {
            dispatch(
                uiActions.addNotification({
                    message: 'Confirmed!',
                    options: {
                        variant: 'success'
                    }
                })
            )

            navigate('/');

        }
    }
}

export const sendResetPasswordEmail = (email: string) => {

    return async (dispatch: any) => {
        try {
            const response = await axios.post(`/auth/reset-password`, { email });
            if (response.status === 200) {
                dispatch(uiActions.addNotification({
                    options: { variant: 'success' },
                    message: response.data.message
                }))
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
            const response = await axios.post(`/auth/confirm-password`, { token, password, confirmPassword });
            if (response.status === 200) {
                dispatch(uiActions.addNotification({
                    options: { variant: 'success' },
                    message: response.data.message
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const getUser = () => {
    return async (dispatch: any) => {
        try {
            const response = await axios.get<User>(`/auth/get-user`);
            if (response) {
                dispatch(authActions.login({ user: response.data }));
                navigate(`/`);
            }
        } catch (error) {
            console.log(error)
        }
    }
}
 

export const logOut = () => {
    return async (dispatch: any) => {
        try {
            const response = await axios.post(`/auth/logout`);
            if (response) {
                dispatch(authActions.logOut());
                navigate(`/login`);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const test = () => {
    return async (dispatch: any) => {
        try {
            await axios.get<any>(`/test`);
            // console.log(response.data);
        } catch (error) {
            // console.log(error)
        }

    }
}

export const authActions = authSlice.actions;

export default authSlice.reducer;

