import React from "react";
import api from "../../../Axios/api";
import {
	AppBar,
	Toolbar,
	Paper,
	Typography,
	Grid,
	TextField,
	Button,
	Select,
	MenuItem,
} from "@material-ui/core";
import { withRouter, Redirect } from "react-router-dom";
import { useStyles } from "./styles";
import { useUserContext, registerUser } from "../../../context/UserContext";

import Logo from "../../../assets/images/logo.png";

const Register = () => {
	const classes = useStyles();
	const { dispatch } = useUserContext();

	const [isRegistered, setIsRegistered] = React.useState(false);
	const [name, setName] = React.useState("Haseeb Ahmed");
	const [cnic, setCnic] = React.useState("34601-0385037-7");
	const [email, setEmail] = React.useState("haseeb@gmail.com");
	const [birthday, setBirthday] = React.useState("01/01/2000");
	const [phoneNumber, setPhoneNumber] = React.useState("+923455488213");
	const [password, setPassword] = React.useState("haseeb123");
	const [gender, setGender] = React.useState("male");
	const [city, setCity] = React.useState("Islamabad");
	const [address, setAddress] = React.useState(
		"H# 123, Satellite Town, Rawalpindi"
	);

	const handleRegisterVendor = (e) => {
		e.preventDefault();

		api.post("/seller/register", {
			name,
			email,
			CNIC: cnic,
			phoneNumber,
			gender,
			birthday,
			password,
			city,
			address,
		})
			.then(function (res) {
				setTimeout(() => setIsRegistered(true), [1000]);
				return registerUser(
					dispatch,
					res.data.data.vendor,
					res.data.data.token
				);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
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
					<Grid container>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								name="Name"
								label="Name"
								autoComplete="name"
								fullWidth
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								name="cnic"
								label="Cnic"
								placeholder="XXXXX-XXXXXXX-X"
								fullWidth
								value={cnic}
								onChange={(e) => setCnic(e.target.value)}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								name="email"
								label="Email"
								autoComplete="email"
								fullWidth
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						{/* <Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								name="date"
								label="Date of Birth"
								autoComplete="dateofBirth"
								fullWidth
								placeholder="dd/MM/yyyy"
								value={birthday}
								onChange={(e) => setBirthday(e.target.value)}
							/>
						</Grid> */}
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								name="phoneNumber"
								label="Phone Number"
								fullWidth
								placeholder="+923XXXXXXXXX"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
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
								variant="outlined"
								margin="normal"
								required
								name="city"
								label="City"
								fullWidth
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								name="address"
								label="Address"
								fullWidth
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Select
								variant="outlined"
								fullWidth
								label="Category"
								name="category"
								style={{ marginTop: 8 }}
								defaultValue={"DEFAULT"}
								onChange={(e) => setGender(e.target.value)}
							>
								<MenuItem value="DEFAULT" disabled>
									Choose your Gender
								</MenuItem>
								<MenuItem value="male">Male</MenuItem>
								<MenuItem value="female">Female</MenuItem>
								<MenuItem value="other">Other</MenuItem>
							</Select>
						</Grid>

						<Grid item xs={12} className={classes.buttons}>
							{/* <Button
								variant="outlined"
								color="primary"
								onClick={}
								style={{ marginRight: 10 }}
							>
								Login
							</Button> */}
							<Button
								variant="contained"
								color="primary"
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
