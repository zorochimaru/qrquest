import { navigate } from '@reach/router';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../services/CONSTANTS';
import { uiActions } from './Ui';
export interface User {
    id: string,
    name: string,
}

export interface AuthState {
    isLoged: boolean,
    user?: User
};

const initialState: AuthState = { isLoged: false };
const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthState>) {
            state.isLoged = action.payload.isLoged;
            state.user = action.payload.user;
        },
        logOut(state: AuthState) {
            state.isLoged = false;
            state.user = undefined;
        },
    },
});

export const register = (data: {
    email: string, password: string, confirmPassword: string,
    name: string
}) => {
    return async (dispatch: any) => {
        dispatch(
            uiActions.addNotification({
                status: 'info',
                text: 'Sending email...'
            })
        )
        const sendRequest = async () => {
            const responce = await axios.post(`http://localhost:5000/auth/signup`, data);
            if (responce.statusText !== 'OK') {
                throw new Error('Login failed!');
            }
            return responce
        }
        try {
            const res = await sendRequest();
            dispatch(
                uiActions.addNotification({
                    status: 'success',
                    text: res.data
                })
            )
        } catch (error) {

            for (const err of error.response?.data?.errors) {
                dispatch(
                    uiActions.addNotification({
                        status: 'error',
                        text: err.message
                    })
                )

            }
            if (error.response?.data.message) {
                dispatch(
                    uiActions.addNotification({
                        status: 'error',
                        text: error.response?.data?.message
                    })
                )
            } if(!error.response?.data?.message && !error.response?.data?.errors) {
                dispatch(
                    uiActions.addNotification({
                        status: 'error',
                        text: 'Register failed!'
                    })
                )

            }





        }

    }
}

export const login = (data: { email: string, password: string }) => {
    return async (dispatch: any) => {
        dispatch(
            uiActions.addNotification({
                status: 'info',
                text: 'Sending email...'
            })
        )
        const sendRequest = async () => {
            const responce = await axios(`http://localhost:5000/auth/signin`, { data, method: 'POST' });
            if (responce.statusText !== 'OK') {
                throw new Error('Login failed!');
            }
        }
        try {
            await sendRequest();
            dispatch(
                uiActions.addNotification({
                    status: 'success',
                    text: 'Loged!'
                })
            )
        } catch (error) {
            dispatch(
                uiActions.addNotification({
                    status: 'error',
                    text: error.response?.data ? error.response.data : 'Login failed!'
                })
            )
        }

    }
}

export const confirmEmail = (id: string) => {
    return async (dispatch: any) => {
        dispatch(
            uiActions.addNotification({
                status: 'info',
                text: 'Sending email...'
            })
        )
        const sendRequest = async () => {
            const responce = await fetch(API_URL + `confirmation/${id}`)
                .catch(err => {
                    throw new Error(err);
                });
            if (!responce.ok) {
                throw new Error('Opppse');
            }
        }
        try {
            await sendRequest();
            dispatch(
                uiActions.addNotification({
                    status: 'success',
                    text: 'Email sent!'
                })
            )
        } catch (error) {
            dispatch(
                uiActions.addNotification({
                    status: 'error',
                    text: 'Email not sent!'
                })
            )
        }

    }
}
export const authActions = authSlice.actions;

export default authSlice.reducer;

