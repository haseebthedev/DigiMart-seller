// VENDOR LINKS
import LoginVendor from "../pages/vendor/Login/Login";
import SignUpVendor from "../pages/admin/Register/Register";
import ForgetPassword from "../pages/vendor/ForgetPassword/ForgetPassword";
import VendorCenter from "../pages/vendor/VendorCenter/VendorCenter";
import SettingsProfile from "../pages/vendor/VendorCenter/Settings/SettingsProfile";
import SettingsStore from "../pages/vendor/VendorCenter/Settings/SettingsStore";
import EditBankDetails from "../pages/vendor/VendorCenter/Payments/EditBankDetails";
import AddProduct from "../pages/vendor/VendorCenter/Products/AddProduct";
import ViewProducts from "../pages/vendor/VendorCenter/Products/ViewProducts";

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
  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();

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
        <PrivateRoute exact path="/vendor/dashboard">
          <VendorCenter />
        </PrivateRoute>
        <Route exact path="/vendor/products/add-product">
          <AddProduct />
        </Route>
        <Route exact path="/vendor/products/view-products">
          <ViewProducts />
        </Route>
        <Route exact path="/vendor/Settings/Profile">
          <SettingsProfile />
        </Route>
        <Route exact path="/vendor/Settings/Store">
          <SettingsStore />
        </Route>
        <Route exact path="/vendor/Payments/editBankDetails">
          <EditBankDetails />
        </Route>
        <PrivateRoute exact path="/">
          <VendorCenter />
        </PrivateRoute>
        {/* <Route
          exact
          path="/"
          render={() => <Redirect to="/vendor/dashboard" />}
        /> */}
      </Switch>
    </Router>
  );

  // HOC for Auth routes
  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={() =>
          store.isAuthenticated ? children : <Redirect to="/vendor/login" />
        }
      />
    );
  }
}

// ############################################################
