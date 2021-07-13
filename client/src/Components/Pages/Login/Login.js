import React from "react";
import api from "../../../Axios/api";

import {
	Avatar,
	Button,
	TextField,
	Link,
	Paper,
	Grid,
	Typography,
	InputLabel,
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
		email: "",
		password: "haseeb123",
		errorMessage: "",
	});

	const validateEmail = (email) => {
		const regEx =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		const res = regEx.test(email);

		if (!res === true) {
			return "Wrong Email";
		}
		return "";
	};

	const handleChange = (input) => (e) => {
		var error = "";
		if (input === "email") {
			error = validateEmail(e.target.value);
		}
		setLoginData({
			...loginData,
			[input]: e.target.value,
			errorMessage: error,
		});
	};

	const handleLoginVendor = (e) => {
		e.preventDefault();

		api.post("/seller/login", {
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
				// console.log(
				// 	"ERROR: " + JSON.stringify(error.response.data.error)
				// );

				setLoginData({
					...loginData,
					errorMessage:
						"ERROR: " +
						JSON.stringify(error.response.data.error.message),
				})
			);
	};

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
						<InputLabel
							style={{
								color: "red",
								marginTop: 10,
								marginBottom: 5,
								textAlign: "center",
							}}
						>
							{loginData.errorMessage.toString()}
						</InputLabel>
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
