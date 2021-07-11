import { Backdrop, CircularProgress } from "@material-ui/core";
import { Router } from "@reach/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AlertComponent from "./components/Alert";
import { PrivateRoute } from "./components/PrivateRoute";
import { ConfirmationPage } from "./pages/Authentication/Confirmation/Confirmation";
import LoginPage from "./pages/Authentication/Login/Login";
import RegisterPage from "./pages/Authentication/Register/Register";
import { RootState } from "./redux/store";
import { uiActions } from "./redux/Ui";

function App() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);


  function errorResponseHandler(error: any) {
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


    // ! REFRESH SESSION CODE
    // const originalRequest = error.config
    // const refreshToken = localStorage.getItem("refresh")
    // if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest && refreshToken) {
    //   originalRequest._retry = true

    //   return fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       refresh: refreshToken,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       localStorage.setItem("access", res.access)
    //       originalRequest.headers['Authorization'] = 'Bearer ' + res.access
    //       return axios(originalRequest)
    //     })
    // }

    setTimeout(() => {
      dispatch(
        uiActions.closeNotification(0)
      )
    }, 5000);
  }

  axios.interceptors.request.use((successfulReq) => {
    dispatch(
      uiActions.setLoading(true)
    );
    return successfulReq;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    response => {
      dispatch(
        uiActions.setLoading(false)
      );
      return response
    },
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
        <PrivateRoute path='/'>
          <h1>Home page </h1>
        </PrivateRoute>

        <RegisterPage path="register" />
        <LoginPage path="login" />
        <ConfirmationPage path="/confirmation/:id"></ConfirmationPage>
      </Router>
    </>
  );
}

export default App;
