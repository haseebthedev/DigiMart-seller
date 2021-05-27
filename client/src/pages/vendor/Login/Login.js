import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons/";
import { withRouter, Redirect } from "react-router-dom";

import { useUserContext, loginUser } from "../../../context/UserContext";
import useStyles from "./styles";

const Login = () => {
  const classes = useStyles();

  // context
  const { dispatch } = useUserContext();

  const [loginData, setLoginData] = React.useState({
    email: "haseeb@gmail.com",
    password: "haseeb123",
  });
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleChange = (input) => (e) => {
    setLoginData({ ...loginData, [input]: e.target.value });
  };

  const handleLoginVendor = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/seller/login", {
        ...loginData,
      })
      .then(function (res) {
        setTimeout(() => setIsLoggedIn(true), [1000]);
        return loginUser(dispatch, res.data.data.vendor, res.data.data.token);
      })
      .catch((error) =>
        console.log("ERROR: " + JSON.stringify(error.response.data.error))
      );
  };

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      {isLoggedIn ? <Redirect to="/vendor/dashboard" /> : ""}
      <Grid item xs={false} sm={4} md={7} className={classes.image}></Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h6">Sign in</Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              color="secondary"
              autoFocus
              defaultValue={loginData.email}
              onChange={handleChange("email")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              color="secondary"
              autoComplete="current-password"
              defaultValue={loginData.password}
              onChange={handleChange("password")}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="secondary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleLoginVendor}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forget-password" variant="body2" color="secondary">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/vendor/register" variant="body2" color="secondary">
                  {"Don't have an account?"}
                </Link>
              </Grid>
            </Grid>

            {/* Copyright Section */}
            <Box mt={5}>
              <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="#">
                  Digi-Mart
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
              </Typography>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default withRouter(Login);
