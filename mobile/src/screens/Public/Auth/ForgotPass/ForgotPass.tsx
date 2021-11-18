import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import '../../../../i18n/config';
import { sendResetPasswordEmail } from '../../../../redux/Auth';

const ForgotPass = () => {
  const { t } = useTranslation(['auth', 'common'], { useSuspense: false });
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const handleSubmit = () => {
    dispatch(sendResetPasswordEmail(email));
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
        <Button mode="contained" onPress={handleSubmit}>
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
    padding: 20,
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
