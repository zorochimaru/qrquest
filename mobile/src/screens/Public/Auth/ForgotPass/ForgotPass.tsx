import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import '../../../../i18n/config';
import { sendResetPasswordEmail } from '../../../../redux/Auth';

const ForgotPass = () => {
  const { t } = useTranslation(['auth', 'common']);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const handleSubmit = () => {
    dispatch(sendResetPasswordEmail(email));
  };

  return (
    <View style={styles.centeredView}>
      <Text style={styles.modalText}>{t('auth:forgot_pass.title')}</Text>
      <TextInput
        keyboardType={'email-address'}
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        placeholder={t('common:placeholders.email')}
      />
      <View style={styles.actionRow}>
        <Button onPress={handleSubmit} title={t('common:buttons.submit_btn')} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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

export default ForgotPass;
