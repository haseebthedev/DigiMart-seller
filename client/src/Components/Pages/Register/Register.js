import React, { useState } from "react";
import api from "../../../Axios/api";
import {
	AppBar,
	Toolbar,
	Paper,
	Typography,
	Grid,
	TextField,
	Button,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { withRouter, Redirect } from "react-router-dom";
import { useStyles } from "./styles";
import { useUserContext, registerUser } from "../../../context/UserContext";
import Logo from "../../../assets/images/logo.png";

const Register = () => {
	const classes = useStyles();
	const { dispatch } = useUserContext();

	// Snackbar
	const [snackBarstate, setSnackBar] = useState({
		open: false,
		vertical: "top",
		horizontal: "right",
	});
	const { vertical, horizontal, open } = snackBarstate;
	const handleCloseSnackBar = () => {
		setSnackBar({ ...snackBarstate, open: false });
	};

	const [isRegistered, setIsRegistered] = useState(false);
	const [name, setName] = useState("Haseeb Ahmed");
	const [cnic, setCnic] = useState("34601-0385037-7");
	const [email, setEmail] = useState("haseeb@gmail.com");
	const [phoneNumber, setPhoneNumber] = useState("+923455488213");
	const [password, setPassword] = useState("haseeb@123");
	const [city, setCity] = useState("Islamabad");
	const [address, setAddress] = useState(
		"H# 123, Satellite Town, Rawalpindi"
	);

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		cnicError: "",
		emailError: "",
		phoneNumberError: "",
		passwordError: "",
		cityError: "",
		addressError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// name
		var noNumber = /^([^0-9]*)$/;
		if (name.match(noNumber)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError =
				"Name cannot contains Numbers or Special Characters!";
		}

		// cnic
		var cnicFormat = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
		if (cnic.match(cnicFormat)) {
			errors.cnicError = "";
		} else {
			hasError = true;
			errors.cnicError = "Entered CNIC number is invalid!";
		}

		// email
		// eslint-disable-next-line
		var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (email.match(mailFormat)) {
			errors.emailError = "";
		} else {
			hasError = true;
			errors.emailError = "Entered Email address is invalid!";
		}

		// phone
		var phoneFormat = /^(\+92)?[0-9]{10}$/;
		if (phoneNumber.match(phoneFormat)) {
			errors.phoneNumberError = "";
		} else {
			hasError = true;
			errors.phoneNumberError = "Entered Phone Number is invalid!";
		}

		// password
		var passwordFormat =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
		if (password.match(passwordFormat)) {
			errors.passwordError = "";
		} else {
			hasError = true;
			errors.passwordError =
				"Enter atleast 8 length of Capital, Small, and Special characters !";
		}

		// city
		var cityFormat = /^([^0-9]*)$/;
		if (city.match(cityFormat)) {
			errors.cityError = "";
		} else {
			hasError = true;
			errors.cityError =
				"City cannot contains Numbers or Special Characters!";
		}

		// address
		var addressFormat = /^[a-zA-Z0-9-@#{1},\s]*$/;
		if (address.match(addressFormat) && address.length > 10) {
			errors.addressError = "";
		} else {
			hasError = true;
			errors.addressError =
				"Entered Address is invalid. Special Characters not allowed i.e. /!$%^&*()";
		}

		console.log("hasError", hasError);
		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const handleRegisterVendor = async (e) => {
		e.preventDefault();

		var errorExists = InputValidation();

		if (errorExists === false) {
			await api
				.post("/seller/register", {
					name,
					email,
					CNIC: cnic,
					phoneNumber,
					password,
					city,
					address,
				})
				.then(function (res) {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "SUCCESS: Loggin In Now.",
						open: true,
					});
					setTimeout(() => setIsRegistered(true), [2000]);
					return registerUser(
						dispatch,
						res.data.data.vendor,
						res.data.data.token
					);
				})
				.catch((error) => {
					// message: JSON.stringify(error.response.data.error),
					setSnackBar({
						...snackBarstate,
						type: "error",
						message: "ERROR: This User already exists!",
						open: true,
					});
				});
		}
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
					<Grid container>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Name"
								autoComplete="name"
								fullWidth
								value={name}
								onChange={(e) => setName(e.target.value)}
								helperText={IFerrors.nameError}
								error={
									IFerrors.nameError.length > 0 ? true : false
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Cnic"
								placeholder="XXXXX-XXXXXXX-X"
								fullWidth
								value={cnic}
								onChange={(e) => setCnic(e.target.value)}
								inputProps={{ maxLength: 15 }}
								helperText={IFerrors.cnicError}
								error={
									IFerrors.cnicError.length > 0 ? true : false
								}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Email"
								autoComplete="email"
								fullWidth
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								helperText={IFerrors.emailError}
								error={
									IFerrors.emailError.length > 0
										? true
										: false
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Phone Number"
								fullWidth
								placeholder="+923XXXXXXXXX"
								inputProps={{ maxLength: 13 }}
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								helperText={IFerrors.phoneNumberError}
								error={
									IFerrors.phoneNumberError.length > 0
										? true
										: false
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Password"
								fullWidth
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								helperText={IFerrors.passwordError}
								error={
									IFerrors.passwordError.length > 0
										? true
										: false
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="City"
								fullWidth
								value={city}
								onChange={(e) => setCity(e.target.value)}
								helperText={IFerrors.cityError}
								error={
									IFerrors.cityError.length > 0 ? true : false
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								label="Address"
								fullWidth
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								helperText={IFerrors.addressError}
								error={
									IFerrors.addressError.length > 0
										? true
										: false
								}
							/>
						</Grid>

						<Grid item xs={12} className={classes.buttons}>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Button
										variant="outlined"
										color="primary"
										fullWidth
									>
										Login
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										variant="contained"
										color="primary"
										onClick={handleRegisterVendor}
										fullWidth
									>
										Register
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
			</main>

			{/*  Snackbar Alert */}
			<Snackbar
				open={open}
				anchorOrigin={{ vertical, horizontal }}
				autoHideDuration={3000}
				onClose={handleCloseSnackBar}
				key={vertical + horizontal}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleCloseSnackBar}
					severity={snackBarstate.type}
				>
					{snackBarstate.message}
				</MuiAlert>
			</Snackbar>
		</React.Fragment>
	);
};

export default withRouter(Register);
