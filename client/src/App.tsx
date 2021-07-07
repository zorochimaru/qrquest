import { Router } from "@reach/router";
import { useSelector } from "react-redux";
import AlertComponent from "./components/Alert";
import { PrivateRoute } from "./components/PrivateRoute";
import { ConfirmationPage } from "./pages/Authentication/Confirmation/Confirmation";
import LoginPage from "./pages/Authentication/Login/Login";
import RegisterPage from "./pages/Authentication/Register/Register";
import { RootState } from "./redux/store";

function App() {
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  return (
    <>
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
