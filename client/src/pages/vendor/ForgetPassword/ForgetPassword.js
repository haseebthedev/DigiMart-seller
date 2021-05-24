import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";

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
  const [userType, setUserType] = React.useState("Vendor");

  return (
    <React.Fragment>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography
            component="h1"
            variant="h4"
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
            <Grid item xs={12}>
              <FormLabel>Select Account Type</FormLabel>
              <RadioGroup
                row
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio color="secondary" />}
                  label="Admin"
                />
                <FormControlLabel
                  value="vendor"
                  control={<Radio color="secondary" />}
                  label="Vendor"
                />
                <FormControlLabel
                  value="buyer"
                  control={<Radio color="secondary" />}
                  label="Buyer"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} className={classes.buttons}>
              <Button variant="contained" color="secondary">
                Get Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};

export default withRouter(ForgetPassword);
