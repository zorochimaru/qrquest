import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import '../../../i18n/config';
import { authActions, register } from '../../../redux/Auth';
import { RootState } from '../../../redux/store';

const Register = () => {
    const { t } = useTranslation(['auth', 'common']);
    const visible = useSelector((state: RootState) => state.auth.registerModalShow);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invalid, setInvalid] = useState(true);
    const handleClose = () => {
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
        dispatch(authActions.toggleRegisterModal());

    };
    const handleSubmit = () => {

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: t('auth:errors.pass_not_match'),
            });
            return;
        }
        const formObj = {
            name,
            email,
            password,
            confirmPassword,
        };
        dispatch(register(formObj));

    };

    const goToLogin = () => {
        handleClose();
        dispatch(authActions.toggleLoginModal());
    };
    const handlePassValid = (text: string) => {
        setConfirmPassword(text);
        if (text !== password) {
            setInvalid(true);
        } else {
            setInvalid(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >

          
                <ScrollView style={styles.scrollView}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{t('auth:register.title')}</Text>
                            <TextInput
                                keyboardType={'email-address'}
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                                textContentType="emailAddress"
                                placeholder={t('common:placeholders.email')}
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={setName}
                                value={name}
                                textContentType="nickname"
                                placeholder={t('common:placeholders.name')}
                            />

                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword}
                                value={password}
                                placeholder={t('common:placeholders.password')}
                                textContentType="password"
                                secureTextEntry={true}
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handlePassValid(text)}
                                value={confirmPassword}
                                placeholder={t('common:placeholders.confirm_pass')}
                                textContentType="password"
                                secureTextEntry={true}
                            />
                            <View style={styles.linkRow}>
                                <Text style={styles.link} onPress={goToLogin}>{t('auth:buttons.go_to_login')}</Text>
                            </View>
                            <View style={styles.actionRow}>
                                <Button onPress={handleClose} title={t('common:buttons.cancel_btn')} />
                                <Button disabled={invalid} onPress={handleSubmit} title={t('common:buttons.submit_btn')} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            
        </Modal >




    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        // marginHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cecece',
        borderRadius: 8,
        width: '100%',
        paddingLeft: 20,
        marginBottom: 20,
    },
    link: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default Register;
