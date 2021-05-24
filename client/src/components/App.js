import LoginVendor from "../pages/vendor/Login/Login";
import SignUpVendor from "../pages/vendor/Register/Register";
import ForgetPassword from "../pages/vendor/ForgetPassword/ForgetPassword";
import VendorCenter from "../pages/vendor/VendorCenter/VendorCenter";

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
        <Route path="/forget-password">
          <ForgetPassword />
        </Route>
        <Route path="/vendor/register">
          <SignUpVendor />
        </Route>
        <Route path="/vendor/dashboard">
          <VendorCenter />
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
