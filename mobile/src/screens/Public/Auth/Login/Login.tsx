import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import '../../../../i18n/config';
import { login } from '../../../../redux/Auth';

const Login = () => {
  const { t } = useTranslation(['auth', 'common'], { useSuspense: false });
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = () => {
    const formObj = {
      email,
      password,
    };
    dispatch(login(formObj));
  };

  return (
    <Suspense fallback="loading">
      <View style={styles.centeredView}>
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
          onChangeText={setPassword}
          value={password}
          placeholder={t('common:placeholders.password')}
          textContentType="password"
          secureTextEntry={true}
        />
        <Button mode="contained" onPress={handleSubmit}>
          {t('common:buttons.submit_btn')}
        </Button>
      </View>
    </Suspense>
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
  link: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Login;
