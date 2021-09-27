/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { Button, Text, View } from 'react-native';

const App = () => {
  const handleClick = () => {
    alert('HEHEHE');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>QR Quest</Text>
      <Button onPress={handleClick} title="Click me" />
    </View>
  );
};

export default App;
