import React, { useState } from "react";
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
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { LockOutlined } from "@material-ui/icons/";
import { withRouter, Redirect } from "react-router-dom";
import { useUserContext, loginUser } from "../../../context/UserContext";
import useStyles from "./styles";

const Login = () => {
	const classes = useStyles();
	const { dispatch } = useUserContext();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Snackbar
	const [snackBarstate, setSnackBar] = useState({
		open: false,
		vertical: "top",
		horizontal: "right",
		type: "success",
		message: "",
	});
	const { vertical, horizontal, open } = snackBarstate;
	const handleCloseSnackBar = () => {
		setSnackBar({ ...snackBarstate, open: false });
	};

	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
		errorMessage: "",
	});

	const validateEmail = (email) => {
		const regEx =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		const res = regEx.test(email);

		if (!res === true) {
			return "Entered Email is Invalid!";
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

	const handleLoginVendor = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		await api
			.post("/seller/login", {
				...loginData,
			})
			.then(function (res) {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Logging into Dashboard!",
					open: true,
				});

				setTimeout(() => {
					setIsLoggedIn(true);
				}, [1000]);

				return loginUser(
					dispatch,
					res.data.data.seller,
					res.data.data.token
				);
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					message:
						"ERROR: " +
						JSON.stringify(error.response.data.error.message),
					type: "error",
					open: true,
				});
				setIsLoading(false);
			});
	};

	return (
		<Grid container className={classes.root}>
			{isLoggedIn ? <Redirect to="/seller/dashboard" /> : ""}
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
							color="primary"
							autoFocus
							defaultValue={loginData.email}
							onChange={handleChange("email")}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Password"
							type="password"
							color="primary"
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
							color="primary"
							className={classes.submit}
							onClick={handleLoginVendor}
							disabled={isLoading}
						>
							Sign In
						</Button>
						<Grid container justify="space-between">
							<Grid item>
								<Link
									href="/seller/forget-password"
									variant="body2"
									color="primary"
								>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link
									href="/seller/register"
									variant="body2"
									color="primary"
								>
									Don't have an account?
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Grid>

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
		</Grid>
	);
};

export default withRouter(Login);
