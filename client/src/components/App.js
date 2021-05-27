// VENDOR LINKS
import LoginVendor from "../pages/vendor/Login/Login";
import SignUpVendor from "../pages/vendor/Register/Register";
import ForgetPassword from "../pages/vendor/ForgetPassword/ForgetPassword";
import VendorCenter from "../pages/vendor/VendorCenter/VendorCenter";
import SettingsProfile from "../pages/vendor/VendorCenter/Settings/SettingsProfile";
import SettingsStore from "../pages/vendor/VendorCenter/Settings/SettingsStore";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// context
import { useUserContext } from "../context/UserContext";

export default function App() {
  // global
  var {
    // eslint-disable-next-line
    store: { isAuthenticated, data },
  } = useUserContext();

  return (
    <Router>
      <Switch>
        <Route path="/vendor/login">
          <LoginVendor />
        </Route>
        <Route path="/vendor/forget-password">
          <ForgetPassword />
        </Route>
        <Route exact path="/vendor/register">
          <SignUpVendor />
        </Route>
        <Route exact path="/vendor/dashboard">
          <VendorCenter />
        </Route>
        <Route exact path="/vendor/Settings/Profile">
          <SettingsProfile />
        </Route>
        <Route exact path="/vendor/Settings/Store">
          <SettingsStore />
        </Route>
        {/* <PrivateRoute path="/vendor/dashboard">
          <VendorDashboard />
        </PrivateRoute> */}
        <Route
          exact
          path="/"
          render={() => <Redirect to="/vendor/dashboard" />}
        />
      </Switch>
    </Router>
  );

  // function PrivateRoute({ children, ...rest }) {
  //   return (
  //     <Route
  //       {...rest}
  //       render={(props) =>
  //         isAuthenticated ? (
  //           children
  //         ) : (
  //           <Redirect
  //             to={{
  //               pathname: "/vendor/login",
  //               state: { from: props.location },
  //             }}
  //           />
  //         )
  //       }
  //     />
  //   );
  // }
}

// ############################################################
