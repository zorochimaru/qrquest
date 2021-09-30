import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../redux/Auth';
import { RootState } from '../../redux/store';

const LoginLogoutBtn = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const handleLogin = () => {
        dispatch(authActions.toggleLoginModal());
    };
    const handleLogout = () => {
        dispatch(authActions.logOut());
    };
    return (
        <View style={{ marginRight: 15 }}>
            <Icon.Button onPress={user ? handleLogout : handleLogin} name="person">
                <Text style={{ fontFamily: 'Arial', fontSize: 15, color: '#fff' }}>
                    {user ? 'Logout' : 'Login'}
                </Text>
            </Icon.Button>
        </View>
    );
};

export default LoginLogoutBtn;
