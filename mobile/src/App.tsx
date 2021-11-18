import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import { REACT_APP_API_URL } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, authActions, logOut } from './redux/Auth';
import { RootState } from './redux/store';
import { uiActions } from './redux/Ui';
import './i18n/config';
import News from './screens/Public/News/News';
import { AuthStackScreens } from './screens/Public/Auth/AuthStack';
import { navigationRef } from './utils/navigatorRef';
import Account from './screens/Private/Account/Account';
import { RootDrawerParamList } from './types/navigation';
import { QrQuestStack } from './screens/Private/QrQuest/QrQuestStack';

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
});

// const Tab = createBottomTabNavigator();
const RootDrawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
  const { t } = useTranslation('common', { useSuspense: false });
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
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
    successfulReq => {
      // Set loader
      dispatch(uiActions.setLoading(true));
      // Set Auth header if has jwt token

      if (accessToken && successfulReq) {
        successfulReq.headers.common.Authorization = 'Bearer ' + accessToken;
      }
      return successfulReq;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    responseNotificationHandler,
    errorResponseHandler,
  );

  async function refreshToken(originalRequest: any) {
    originalRequest._retry = true;
    try {
      const response = await axios.get<{ accessToken: string }>(
        '/auth/refresh-token',
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
  return (
    <Suspense fallback="loading">
      <Spinner visible={isLoading} textStyle={styles.spinnerTextStyle} />
      <NavigationContainer ref={navigationRef}>
        <RootDrawer.Navigator
          initialRouteName="news"
          drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                {user ? (
                  <DrawerItem
                    label="Logout"
                    onPress={() => dispatch(logOut())}
                  />
                ) : null}
              </DrawerContentScrollView>
            );
          }}>
          {user ? (
            <>
              <RootDrawer.Screen
                options={{ title: t('screen_titles.news') }}
                name={'news'}
                component={News}
              />
              <RootDrawer.Screen
                options={{ title: t('screen_titles.account') }}
                name={'account'}
                component={Account}
              />
              <RootDrawer.Screen
                options={{ headerShown: false, title: 'QrQuest' }}
                name={'qrQuest'}
                component={QrQuestStack}
              />
            </>
          ) : (
            <>
              <RootDrawer.Screen
                options={{ title: t('screen_titles.news') }}
                name={'news'}
                component={News}
              />
              <RootDrawer.Screen
                options={{ headerShown: false, title: t('screen_titles.auth') }}
                name={'auth'}
                component={AuthStackScreens}
              />
            </>
          )}
        </RootDrawer.Navigator>
      </NavigationContainer>
      <Toast ref={ref => Toast.setRef(ref)} />
    </Suspense>
  );
}
