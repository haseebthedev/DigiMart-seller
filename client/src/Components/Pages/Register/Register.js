import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../Axios/api";
import {
	AppBar,
	Toolbar,
	Paper,
	Typography,
	Grid,
	TextField,
	Button,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { withRouter, Redirect } from "react-router-dom";
import { useStyles } from "./styles";
import { useUserContext, registerUser } from "../../../context/UserContext";
import Logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";

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

	const [Countries, setCountries] = useState([]);
	const [Cities, setCities] = useState([]);

	const [isRegistered, setIsRegistered] = useState(false);
	const [name, setName] = useState("");
	const [cnic, setCnic] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [country, setCountry] = useState("DEFAULT");
	const [city, setCity] = useState("DEFAULT");
	const [address, setAddress] = useState("");

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
		if (name.match(noNumber) && !name.match(/\s{2}/)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError = "Entered Name is Invalid!";
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

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const HandlerCountryCity = (input) => (e) => {
		if (input === "country") {
			setCountry(e.target.value);
		}
		if (input === "city") {
			setCity(e.target.value);
		}
	};

	const getAllCountries = async () => {
		await axios
			.get("https://countriesnow.space/api/v0.1/countries/positions")
			.then((res) => {
				let countriesList = res.data.data;
				setCountries(countriesList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	const getCitiesUsingCountry = async () => {
		await axios
			.post("https://countriesnow.space/api/v0.1/countries/cities", {
				country: country,
			})
			.then((res) => {
				let citiesList = res.data.data;
				setCities(citiesList);
			})
			.catch((error) => console.log("Error: " + error));
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
					country,
					address,
				})
				.then(function (res) {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "SUCCESS: Loggin In Now.",
						open: true,
					});

					registerUser(
						dispatch,
						res.data.data.seller,
						res.data.data.token
					);

					setTimeout(() => setIsRegistered(true), [2000]);
				})
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						type: "error",
						message:
							"ERROR: " +
							JSON.stringify(error.response.data.error.message),
						open: true,
					});
				});
		}
	};

	useEffect(() => {
		getAllCountries();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (country !== "DEFAULT") {
			getCitiesUsingCountry();
		}
		// eslint-disable-next-line
	}, [country]);

	return (
		<React.Fragment>
			{isRegistered ? <Redirect to="/seller/dashboard" /> : ""}
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
						Registration for Seller
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
								label="CNIC"
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
								type="password"
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
							<FormControl fullWidth>
								<InputLabel
									style={{
										marginLeft: "10px",
									}}
								>
									Country
								</InputLabel>
								<Select
									variant="outlined"
									margin="dense"
									required
									style={{ marginTop: 18, marginBottom: 10 }}
									name="country"
									value={country}
									onChange={HandlerCountryCity("country")}
								>
									<MenuItem value="DEFAULT" disabled>
										Select your Country
									</MenuItem>
									{Countries.map((el, index) => (
										<MenuItem value={el.name} key={index}>
											{el.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel
									style={{
										marginLeft: "10px",
									}}
								>
									City
								</InputLabel>
								<Select
									variant="outlined"
									margin="dense"
									required
									style={{ marginTop: 18, marginBottom: 10 }}
									name="city"
									onChange={HandlerCountryCity("city")}
									value={city}
								>
									<MenuItem value="DEFAULT" disabled>
										Select City
									</MenuItem>
									{Cities.map((el, index) => (
										<MenuItem value={el} key={index}>
											{el}
										</MenuItem>
									))}
								</Select>
							</FormControl>
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
									{/* <Button
										variant="outlined"
										color="primary"
										fullWidth
									>
										Login
									</Button> */}
									<Link
										to="/seller/login"
										style={{ textDecoration: "none" }}
									>
										<Button
											variant="outlined"
											color="primary"
											fullWidth
										>
											Login Page
										</Button>
									</Link>
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
