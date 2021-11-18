import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { goToNews } from '../../../redux/Auth';

const Account = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(goToNews());
  };
  return (
    <View style={styles.centeredView}>
      <Text>Helllo</Text>
      <Button title="go to News" onPress={handleClick} />
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
export default Account;
