import React from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import ForgotPass from './ForgotPass/ForgotPass';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const AuthTabs = createMaterialTopTabNavigator<AuthStackParamList>();

export const AuthStackScreens = () => {
  return (
    <AuthTabs.Navigator tabBarPosition="bottom" initialRouteName="Login">
      <AuthTabs.Screen
        options={{
          tabBarLabel: 'Login',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="login" color={color} size={26} />
          ),
        }}
        name="Login"
        component={Login}
      />
      <AuthTabs.Screen
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-plus"
              color={color}
              size={26}
            />
          ),
        }}
        name="Register"
        component={Register}
      />
      <AuthTabs.Screen
        options={{
          tabBarLabel: 'Restore Pass',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-key"
              color={color}
              size={26}
            />
          ),
        }}
        name="ForgotPassword"
        component={ForgotPass}
      />
    </AuthTabs.Navigator>
  );
};
