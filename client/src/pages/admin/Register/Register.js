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
import axios from "axios";

import { withRouter, Redirect } from "react-router-dom";
import { useStyles } from "./styles";
// eslint-disable-next-line
import { useUserContext, registerUser } from "../../../context/UserContext";

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

const Register = () => {
  const classes = useStyles();
  // global
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

  const [adminDetails, setAdminDetails] = React.useState({
    isRegistered: "",
    name: "",
    gender: "male",
    phoneNumber: "+923909544169",
    CNIC: "12365-2054949-9",
    dateofBirth: "12-02-1998",
    password: "ameen321",
    authority: "read-write",
  });
  const [roles, setRoles] = React.useState(["accountant"]);

  const handleChange = (input) => (e) => {
    setAdminDetails({ ...adminDetails, [input]: e.target.value });
  };

  const handleRegisterAdmin = (e) => {
    e.preventDefault();

    console.log("Admin registered success...");
    // axios
    //   .post("http://localhost:8080/admin/register", {})
    //   .then(function (res) {
    // setTimeout(() => setIsRegistered(true), [500]);
    // return registerUser(
    //   dispatch,
    //   res.data.data.vendor,
    //   res.data.data.token
    // );
    // })
    // .catch((error) =>
    //   console.log("ERROR: " + JSON.stringify(error.response.data.error))
    // );
  };

  return (
    <React.Fragment>
      {isRegistered ? <Redirect to="/vendor/dashboard" /> : ""}
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
            Registration for Admin
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
                value={adminDetails.name}
                onChange={handleChange("name")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="cnic"
                label="Cnic"
                placeholder="XXXXX-XXXXXXX-X"
                fullWidth
                value={adminDetails.CNIC}
                onChange={handleChange("CNIC")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                autoComplete="email"
                fullWidth
                value={adminDetails.email}
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date of Birth"
                autoComplete="dateofBirth"
                fullWidth
                placeholder="dd/MM/yyyy"
                value={adminDetails.dateofBirth}
                onChange={handleChange("dateofBirth")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="authority"
                label="Authority"
                fullWidth
                placeholder="Read-Write or Ready Only"
                value={adminDetails.authority}
                onChange={handleChange("authority")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="roles"
                label="Roles"
                fullWidth
                value={roles}
                onChange={(e) => setRoles([e.target.value])}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                placeholder="+923XXXXXXXXX"
                value={adminDetails.phoneNumber}
                onChange={handleChange("phoneNumber")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="password"
                label="Password"
                fullWidth
                value={adminDetails.password}
                onChange={handleChange("password")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                value={adminDetails.gender}
                onChange={handleChange("gender")}
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
                onClick={handleRegisterAdmin}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};

export default withRouter(Register);
