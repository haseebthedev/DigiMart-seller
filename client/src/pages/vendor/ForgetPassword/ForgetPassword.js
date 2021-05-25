import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import axios from "axios";

import { withRouter } from "react-router-dom";
import { useStyles } from "./styles";

import logo from "../../../assets/images/logo.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Digi-Mart
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const ForgetPassword = () => {
  const classes = useStyles();

  const [userEmail, setuserEmail] = React.useState("haseeb@gmail.com");

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const getPassword = () => {
    const URL = "http://localhost:8080/seller/forgetPassword";
    axios
      .post(URL, { email: userEmail })
      .then((res) => console.log("Send Mail", res))
      .catch((error) => console.log());

    setState({ open: true, vertical: "bottom", horizontal: "center" });
  };

  return (
    <React.Fragment>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Toolbar>
      </AppBar>
      <div style={{ padding: "40px" }}>
        {/* BREADCRUMBS */}
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Vendor
          </Link>
          <Typography color="textPrimary">Forget Password</Typography>
        </Breadcrumbs>

        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              className={classes.headingMargin}
            >
              Forget Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  name="userEmail"
                  label="Your Email"
                  fullWidth
                  value={userEmail}
                  onChange={(e) => setuserEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} className={classes.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={getPassword}
                >
                  Get Password
                </Button>
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  onClose={handleClose}
                  autoHideDuration={3000}
                  message="Your password has been sent!"
                  key={vertical + horizontal}
                  action={[
                    <IconButton
                      key="close"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
              </Grid>
            </Grid>
          </Paper>
          <Copyright />
        </main>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ForgetPassword);
