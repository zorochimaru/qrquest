import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppWithStore = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
};

export default AppWithStore;
