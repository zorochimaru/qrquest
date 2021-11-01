import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login/Login';
import Register from './Register/Register';
import ForgotPass from './ForgotPass/ForgotPass';
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
export const AuthStackScreens = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPass} />
    </AuthStack.Navigator>
  );
};
