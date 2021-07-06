import React, { useEffect } from "react";
import axios from "axios";

import {
	Avatar,
	Button,
	TextField,
	Link,
	Paper,
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
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	const [loginData, setLoginData] = React.useState({
		email: "haseeb@gmail.com",
		emailError: false,
		emailErrorMessage: "",
		password: "haseeb123",
		passwordError: "",
		otherMsg: "",
	});

	const validateEmail = (email) => {
		const regEx =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		// const res = regEx.test(email);
		// console.log("isValid", res);

		// if (res === true) {
		// 	setLoginData({ ...loginData, emailError: false });
		// } else {
		// 	setLoginData({ ...loginData, emailError: true });
		// 	console.log("error found!!");
		// }
	};

	const handleChange = (input) => (e) => {
		switch (input) {
			case "email":
				validateEmail(e.target.value);
				break;
			case "password":
				console.log(input);
				break;
		}
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
				return loginUser(
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

	useEffect(() => {
		console.log("emailError ", loginData.emailError);
	}, [loginData]);

	return (
		<Grid container className={classes.root}>
			{isLoggedIn ? <Redirect to="/vendor/dashboard" /> : ""}
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				className={classes.image}
			></Grid>
			<Grid
				item
				xs={12}
				sm={8}
				md={5}
				component={Paper}
				elevation={6}
				square
			>
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
							label="Email Address"
							name="email"
							color="secondary"
							autoFocus
							defaultValue={loginData.email}
							onChange={handleChange("email")}
							error={loginData.emailError}
							helperText={loginData.emailErrorMessage}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							color="secondary"
							defaultValue={loginData.password}
							onChange={handleChange("password")}
						/>
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
						<Grid container justify="space-between">
							<Grid item>
								<Link
									href="/vendor/forget-password"
									variant="body2"
									color="secondary"
								>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link
									href="/vendor/register"
									variant="body2"
									color="secondary"
								>
									Don't have an account?
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid>
	);
};

export default withRouter(Login);
