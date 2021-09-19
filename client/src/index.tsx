import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
// !Change to createMuiTheme on production and replace StrictMode to Fragment
import {
  // unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { azAZ } from '@mui/material/locale';
// import { SnackbarProvider } from 'notistack';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme { }
}

// const theme = createMuiTheme();
const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  azAZ,
);



ReactDOM.render(
  <React.StrictMode>

    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <App />

          {/* <SnackbarProvider maxSnack={3}> */}
          {/* </SnackbarProvider > */}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
