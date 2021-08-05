import { Backdrop, CircularProgress } from "@material-ui/core";
import { Router } from "@reach/router";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertComponent from "./components/Alert";
import { PrivateRoute } from "./components/PrivateRoute";
import { ConfirmationPage } from "./pages/Authentication/Confirmation/Confirmation";
import LoginPage from "./pages/Authentication/Login/Login";
import RegisterPage from "./pages/Authentication/Register/Register";
import ResetPage from "./pages/Authentication/Reset/Reset";
import { HomePage } from "./pages/Home/Home";
import { authActions, getUser, setAuthToken } from "./redux/Auth";
import { RootState } from "./redux/store";
import { uiActions } from "./redux/Ui";

function App() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);

  // Set API url to axios
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setAuthToken(accessToken);
      dispatch(getUser())
    }

  }, [dispatch]);

  function responseNotificationHandler(response: AxiosResponse<any>) {
    dispatch(
      uiActions.setLoading(false)
    );
    return response
  }

  async function refreshToken(originalRequest: any) {
    originalRequest._retry = true;
    try {
      const response = await axios.get<{ accessToken: string }>(`/auth/refresh-token`);
      if (response) {
        setAuthToken(response.data.accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken
        return axios(originalRequest);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function errorResponseHandler(error: any) {
    // dispatch(
    //   uiActions.setLoading(false)
    // );
    if (error.response.status === 403) {
      dispatch(authActions.logOut());
    }
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      refreshToken(originalRequest);
    }
    // check for errorHandle config
    if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
      return Promise.reject(error);
    }

    // if has response show the error
    if (error.response) {
      if (error.response?.data?.errors) {
        for (const err of error.response?.data?.errors) {
          dispatch(
            uiActions.addNotification({
              status: 'error',
              text: err.message
            })
          )
        }
      }
      if (error.response?.data?.message) {
        dispatch(
          uiActions.addNotification({
            status: 'error',
            text: error.response.data.message
          })
        )
      }
    }
    if (!error.response) {
      dispatch(
        uiActions.addNotification({
          status: 'error',
          text: 'Network error - make sure API is running'
        })
      )
    }


    setTimeout(() => {
      dispatch(
        uiActions.closeNotification(0)
      )
    }, 5000);
  }

  axios.interceptors.request.use((successfulReq) => {
    // Set loader
    dispatch(
      uiActions.setLoading(true)
    );

    // Set Auth header if has jwt token
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setAuthToken(accessToken);
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
    <>
      <Backdrop style={{
        zIndex: 1000,
        color: '#fff',
      }} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ position: 'fixed', left: 0, right: 0 }}>
        {notifications.length !== 0 ? notifications.map((notification, i) =>
          <AlertComponent key={i} text={notification.text} status={notification.status} />
        ) : null}
      </div>

      <Router>
        <PrivateRoute as={HomePage} path="/" />
        <RegisterPage path="register" />
        <LoginPage path="login" />
        <ResetPage path="reset" />
        <ConfirmationPage path="/confirmation/:id"></ConfirmationPage>
      </Router>
    </>
  );
}

export default App;
