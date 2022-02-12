import { Backdrop, CircularProgress, CssBaseline, Theme, useTheme } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Router } from "@reach/router";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import { getUser } from "./redux/Auth";
import { RootState } from "./redux/store";
import clsx from 'clsx';
import Sidebar from "./components/Sidebar";
import Page404 from "./pages/Page404/Page404";
import { PrivateRoute } from "./components/PrivateRoute";
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
  const inLoad = useSelector((state: RootState) => state.ui.loadStack.length > 0);

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setOpenSidebar(true);
  };

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  return (

    <div className={classes.root}>
      <CssBaseline />
      <Backdrop style={{
        zIndex: 1000,
        color: '#fff',
      }} open={inLoad} >
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
