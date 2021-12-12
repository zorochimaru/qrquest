import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import ROLES from '../models/roles.model';
import Toast from 'react-native-toast-message';
import { navigationRef } from '../utils/navigatorRef';

export interface User {
  id: string;
  name: string;
  status: string;
  role: ROLES;
  email: string;
}

export interface AuthState {
  user?: User;
  accessToken?: string;
  firstLoging: boolean;
  loginModalShow: boolean;
  registerModalShow: boolean;
  forgotPassModalShow: boolean;
}

const initialState: AuthState = {
  firstLoging: true,
  loginModalShow: false,
  registerModalShow: false,
  forgotPassModalShow: false,
};
const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.firstLoging = false;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logOut(state: AuthState) {
      state.user = undefined;
    },
    toggleLoginModal(state: AuthState) {
      state.loginModalShow = !state.loginModalShow;
    },
    toggleRegisterModal(state: AuthState) {
      state.registerModalShow = !state.registerModalShow;
    },
    toggleForgotPassModal(state: AuthState) {
      state.forgotPassModalShow = !state.forgotPassModalShow;
    },
  },
});

export const register = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}) => {
  return async () => {
    const response = await axios.post('/auth/signup', data);
    if (response) {
      Toast.show({
        type: 'success',
        text1: response.data.message,
      });
    }
  };
};

export const login = (data: { email: string; password: string }) => {
  return async (dispatch: any) => {
    const response = await axios.post('/auth/signin', data);
    if (response?.status === 200) {
      console.log(response.data);
      Toast.show({
        type: 'success',
        text1: 'Loged',
      });
      dispatch(getUser());
    }
  };
};

export const confirmEmail = (token: string) => {
  return async () => {
    const responce = await axios.get(`/auth/confirmation/${token}`);
    if (responce?.status === 200) {
      Toast.show({
        type: 'success',
        text1: responce.data.message,
      });
    }
    //! navigate('/');
  };
};

export const sendResetPasswordEmail = (email: string) => {
  return async () => {
    try {
      const response = await axios.post('/auth/reset-password', { email });
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: response.data.message,
        });
        //! navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const resetPassword = (
  token: string,
  password: string,
  confirmPassword: string,
) => {
  return async () => {
    try {
      const response = await axios.post('/auth/confirm-password', {
        token,
        password,
        confirmPassword,
      });
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUser = () => {
  return async (dispatch: any) => {
    try {
      const response = await axios.get<AuthState>('/auth/get-user');
      if (response) {
        dispatch(authActions.setUser(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const logOut = () => {
  return async (dispatch: any) => {
    try {
      const response = await axios.post('/auth/logout');
      if (response) {
        dispatch(authActions.logOut());
        // RootNavigation.navigate('News');
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const goToNews = () => {
  return async () => {
    navigationRef.navigate('news');
  };
};

export const authActions = authSlice.actions;

export default authSlice.reducer;
