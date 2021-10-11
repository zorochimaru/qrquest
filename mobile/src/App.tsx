import { NavigationContainer } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, getUser } from './redux/Auth';
import { RootState } from './redux/store';
import News from './screens/News/News';
import { REACT_APP_API_URL } from '@env';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginLogoutBtn from './components/LoginLogoutBtn/LoginLogoutBtn';
import Login from './screens/Auth/Login/Login';

import { uiActions } from './redux/Ui';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import Register from './screens/Auth/Register/Register';
import ForgotPass from './screens/Auth/ForgotPass/ForgotPass';



const App = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  axios.defaults.baseURL = REACT_APP_API_URL;


  axios.defaults.withCredentials = true;

  const isLoading = useSelector((state: RootState) => state.ui.isLoading);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  function errorResponseHandler(error: any) {
    if (error.response?.status === 403) {
      dispatch(authActions.logOut());
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      refreshToken(originalRequest);
    }
    // check for errorHandle config
    if (
      error.config?.hasOwnProperty('errorHandle') &&
      error.config.errorHandle === false
    ) {
      return Promise.reject(error);
    }
    // if has response show the error
    if (error.response) {
      if (error.response?.data?.errors) {
        for (const err of error.response?.data?.errors) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err.message,
          });
          console.error(err);
        }
      }
      if (error.response?.data?.message) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data.message,
        });
      }
      if (
        error.response?.data?.name &&
        error.response?.data?.name === 'SequelizeDatabaseError'
      ) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data.original?.sqlMessage,
        });
      }
    }
    if (!error.response) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Server error',
      });

    }
  }

  function responseNotificationHandler(response: AxiosResponse<any>) {
    dispatch(uiActions.setLoading(false));
    return response;
  }
  axios.interceptors.request.use(
    (successfulReq) => {
      // Set loader
      dispatch(uiActions.setLoading(true));
      // Set Auth header if has jwt token

      if (accessToken) {
        successfulReq.headers.common.Authorization = 'Bearer ' + accessToken;
      }
      return successfulReq;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    responseNotificationHandler,
    errorResponseHandler
  );

  async function refreshToken(originalRequest: any) {
    originalRequest._retry = true;
    try {
      const response = await axios.get<{ accessToken: string }>(
        '/auth/refresh-token'
      );
      if (response) {
        originalRequest.headers.Authorization =
          'Bearer ' + response.data.accessToken;
        return axios(originalRequest);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const Drawer = createDrawerNavigator();

  return (

    <>
      <Spinner
        visible={isLoading}
        textStyle={styles.spinnerTextStyle}
      />
      <Login />
      <Register />
      <ForgotPass />
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerRight: () => (
              <LoginLogoutBtn />
            ),
          }}
          initialRouteName="News"
        >
          <Drawer.Screen name={t('screen_titles.news')} component={News} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );

};
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
});
export default App;
