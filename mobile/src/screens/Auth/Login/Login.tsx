import React, { useState } from 'react';
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, login } from '../../../redux/Auth';
import { RootState } from '../../../redux/store';

const Login = () => {
    const visible = useSelector((state: RootState) => state.auth.loginModalShow);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleClose = () => {
        dispatch(authActions.toggleLoginModal());

    };
    const handleSubmit = () => {
        const formObj = {
            email,
            password,
        };
        dispatch(login(formObj));
    };
    return (


        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Login</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        textContentType="emailAddress"
                        placeholder="email"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="password"
                        textContentType="password"
                        secureTextEntry={true}
                    />
                    <View style={styles.actionRow}>
                        <Button onPress={handleClose} title="Cancel" />
                        <Button onPress={handleSubmit} title="Submit" />
                    </View>
                </View>
            </View>

        </Modal>

    );
};
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#cecece',
        borderRadius: 8,
        width: '100%',
        paddingLeft: 20,
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 4,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default Login;
