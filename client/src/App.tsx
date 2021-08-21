import {
  Backdrop,
  CircularProgress,
  createStyles,
  CssBaseline,
  makeStyles, Theme, useTheme
} from "@material-ui/core";
import { Router } from "@reach/router";
import axios, { AxiosResponse } from "axios";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Notifier from "./components/Notifier";

import ConfirmationPage from "./pages/Authentication/Confirmation/Confirmation";
import LoginPage from "./pages/Authentication/Login/Login";
import NewPasswordPage from "./pages/Authentication/NewPassword/NewPassword";
import RegisterPage from "./pages/Authentication/Register/Register";
import ResetPage from "./pages/Authentication/Reset/Reset";
import HomePage from "./pages/Home/Home";
import NewsController from "./pages/NewsController/NewsController";
import { authActions, getUser } from "./redux/Auth";
import { RootState } from "./redux/store";
import { uiActions } from "./redux/Ui";
import clsx from 'clsx';
import Sidebar from "./components/Sidebar";



const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [openSidebar, setOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);
  // Set API url to axios
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.withCredentials = true;


  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(getUser())
    }
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  async function refreshToken(originalRequest: any) {
    originalRequest._retry = true;
    try {
      const response = await axios.get<{ accessToken: string }>(`/auth/refresh-token`);
      if (response) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken
        return axios(originalRequest);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function responseNotificationHandler(response: AxiosResponse<any>) {
    dispatch(
      uiActions.setLoading(false)
    );
    return response
  }

  function errorResponseHandler(error: any) {
    if (error.response?.status === 403) {
      dispatch(authActions.logOut());
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      refreshToken(originalRequest);
    }
    // check for errorHandle config
    if (error.config?.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
      return Promise.reject(error);
    }
    // if has response show the error
    if (error.response) {
      if (error.response?.data?.errors) {
        for (const err of error.response?.data?.errors) {
          dispatch(
            uiActions.addNotification({
              message: err.message,
              options: { variant: 'error' }
            })
          )
        }
      }
      if (error.response?.data?.message) {
        dispatch(
          uiActions.addNotification({
            message: error.response?.data.message,
            options: { variant: 'error' }
          })
        )
      }
      if (error.response?.data?.name && error.response?.data?.name === 'SequelizeDatabaseError') {
        dispatch(
          uiActions.addNotification({
            message: error.response?.data.original?.sqlMessage,
            options: { variant: 'error' }
          })
        )
      }
    }
    if (!error.response) {
      dispatch(
        uiActions.addNotification({
          message: error?.message || 'Server error',
          options: {
            variant: 'error',
          }
        })
      )
    }
  }

  axios.interceptors.request.use((successfulReq) => {
    // Set loader
    dispatch(
      uiActions.setLoading(true)
    );

    // Set Auth header if has jwt token
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      successfulReq.headers.common['Authorization'] = 'Bearer ' + accessToken;
    }
    return successfulReq;
  }, error => {

    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    responseNotificationHandler,
    errorResponseHandler
  );

  return (

    <div className={classes.root}>
      <CssBaseline />
      <Notifier />
      <Backdrop style={{
        zIndex: 1000,
        color: '#fff',
      }} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Header open={openSidebar}  handleDrawerOpen={handleDrawerOpen} classes={classes}></Header>

      <Sidebar classes={classes} theme={theme} handleDrawerClose={handleDrawerClose} openSidebar={openSidebar} />
      
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openSidebar,
        })}
      >
        <div className={classes.drawerHeader} />
        <Router>
          <HomePage path="/" />
          <RegisterPage path="register" />
          <LoginPage path="login" />
          <ResetPage path="reset" />
          <ConfirmationPage path="confirmation/:token" />
          <NewPasswordPage path="confirm-password/:token" />
          <NewsController path="news-controller/:id" />
        </Router>
      </main>
    </div>

  );
}

export default App;
