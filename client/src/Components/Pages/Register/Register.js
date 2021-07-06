import React from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";

import { withRouter, Redirect } from "react-router-dom";
import { useStyles } from "./styles";
// eslint-disable-next-line
import { useUserContext, registerUser } from "../../../context/UserContext";

import Logo from "../../../assets/images/logo.png";

const Register = () => {
  const classes = useStyles();
  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();

  const [isRegistered, setIsRegistered] = React.useState(false);
  const [name, setName] = React.useState("Haseeb Ahmed");
  const [cnic, setCnic] = React.useState("34601-0385037-7");
  const [email, setEmail] = React.useState("haseeb@gmail.com");
  const [birthday, setBirthday] = React.useState("11/06/2003");
  const [phoneNumber, setPhoneNumber] = React.useState("+923455488213");
  const [password, setPassword] = React.useState("haseeb123");
  const [gender, setGender] = React.useState("male");
  const [storeName, setstoreName] = React.useState("Gucci");

  const handleRegisterVendor = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/seller/register", {
        name,
        email,
        CNIC: cnic,
        phoneNumber,
        gender,
        birthday,
        password,
        storeName,
      })
      .then(function (res) {
        setTimeout(() => setIsRegistered(true), [500]);
        return registerUser(
          dispatch,
          res.data.data.vendor,
          res.data.data.token
        );
      })
      .catch((error) =>
        console.log("ERROR: " + JSON.stringify(error.response.data.error))
      );
  };

  return (
    <React.Fragment>
      {isRegistered ? <Redirect to="/vendor/dashboard" /> : ""}
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <img src={Logo} alt="Logo" className={classes.logo} />
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
            Registration for Vendor
          </Typography>
          <Typography variant="h6" spacing={3} gutterBottom>
            Personal Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="Name"
                label="Name"
                autoComplete="name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="cnic"
                label="Cnic"
                placeholder="XXXXX-XXXXXXX-X"
                fullWidth
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                autoComplete="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date of Birth"
                autoComplete="dateofBirth"
                fullWidth
                placeholder="dd/MM/yyyy"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                placeholder="+923XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                name="storeName"
                label="Store Name"
                fullWidth
                value={storeName}
                onChange={(e) => setstoreName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio color="secondary" />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio color="secondary" />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio color="secondary" />}
                  label="Other"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} className={classes.buttons}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRegisterVendor}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </React.Fragment>
  );
};

export default withRouter(Register);
