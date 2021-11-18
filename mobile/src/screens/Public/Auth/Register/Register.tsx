import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import '../../../../i18n/config';
import { register } from '../../../../redux/Auth';

const Register = () => {
  const { t } = useTranslation(['auth', 'common'], { useSuspense: false });
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invalid, setInvalid] = useState(true);
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

  const handlePassValid = (text: string) => {
    setConfirmPassword(text);
    if (text !== password) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
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
          onChangeText={text => handlePassValid(text)}
          value={confirmPassword}
          placeholder={t('common:placeholders.confirm_pass')}
          textContentType="password"
          secureTextEntry={true}
        />
        <Button disabled={invalid} mode="contained" onPress={handleSubmit}>
          {t('common:buttons.submit_btn')}
        </Button>
      </View>
    </Suspense>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
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
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Register;
