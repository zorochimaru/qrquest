import { Backdrop, CircularProgress, CssBaseline, Theme, useTheme } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Router } from "@reach/router";
import axios, { AxiosResponse } from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import { authActions, getUser } from "./redux/Auth";
import { RootState } from "./redux/store";
import { uiActions } from "./redux/Ui";
import clsx from 'clsx';
import Sidebar from "./components/Sidebar";
import Page404 from "./pages/Page404/Page404";
import { PrivateRoute } from "./components/PrivateRoute";
import { toast } from "react-toastify";
import QuestController from './pages/Control/QuestController/QuestController';

const HomePage = React.lazy(() => import('./pages/Home/Home'));
const LoginPage = React.lazy(() => import('./pages/Authentication/Login/Login'));
const RegisterPage = React.lazy(() => import('./pages/Authentication/Register/Register'));
const ResetPage = React.lazy(() => import('./pages/Authentication/Reset/Reset'));
const ConfirmationPage = React.lazy(() => import('./pages/Authentication/Confirmation/Confirmation'));
const NewPasswordPage = React.lazy(() => import('./pages/Authentication/NewPassword/NewPassword'));
const ControlPage = React.lazy(() => import('./pages/Control/ControlPage'));
const NewsController = React.lazy(() => import('./pages/Control/NewsController/NewsController'));
const SingleNews = React.lazy(() => import('./pages/Home/pages/SingleNews/SingleNews'));
const QuestionController = React.lazy(() => import('./pages/Control/QuestionController/QuestionController'));
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  // Set API url to axios
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.withCredentials = true;


  useEffect(() => {
    dispatch(getUser())
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setOpenSidebar(true);
  };

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  async function refreshToken(originalRequest: any) {
    originalRequest._retry = true;
    try {
      const response = await axios.get<{ accessToken: string }>(`/auth/refresh-token`);
      if (response) {
        originalRequest.headers.Authorization =
          'Bearer ' + response.data.accessToken;
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
          toast.error(err.message);
        }
      }
      if (error.response?.data?.message) {
        toast.error(error.response?.data.message);
      }
      if (error.response?.data?.name && error.response?.data?.name === 'SequelizeDatabaseError') {
        toast.error(error.response?.data.original?.sqlMessage);
      }
    }
    if (!error.response) {
      toast.error(error?.message || 'Server error')
    }
  }

  axios.interceptors.request.use((successfulReq) => {
    // Set loader
    dispatch(
      uiActions.setLoading(true)
    );

    // Set Auth header if has jwt token

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
      <Backdrop style={{
        zIndex: 1000,
        color: '#fff',
      }} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Header open={openSidebar} handleDrawerOpen={handleDrawerOpen} classes={classes}></Header>

      <Sidebar classes={classes} theme={theme} handleDrawerClose={handleDrawerClose} openSidebar={openSidebar} />

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openSidebar,
        })}
      >
        <div className={classes.drawerHeader} />

        <Suspense fallback={
          <Backdrop className={classes.backdrop} open={true} >
            <CircularProgress color="inherit" />
          </Backdrop>}>

          <Router>
            <Page404 default />
            <HomePage path="/" />
            <SingleNews path="news/:id" />
            <LoginPage path="login" />
            <RegisterPage path="register" />
            <ResetPage path="reset" />
            <ConfirmationPage path="confirmation/:token" />
            <NewPasswordPage path="confirm-password/:token" />
            <PrivateRoute path="control-panel" >
              <ControlPage path="/" />
              <NewsController path="news-control" />
              <QuestController path={"quest-control"} />
              <QuestionController path={"questions-control"} />
              <QuestionController path={"questions-control/:id"} />
            </PrivateRoute>
          </Router>
        </Suspense>
      </main>
    </div>

  );
}

export default App;
