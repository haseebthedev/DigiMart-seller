import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import api from "../../../Axios/api";
import Logo from "../../../assets/images/logo.png";

import { withRouter } from "react-router-dom";
import { useStyles } from "./styles";

const ForgetPassword = (props) => {
	const classes = useStyles();

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

	const [userEmail, setuserEmail] = useState("");
	const [error, setError] = useState({
		errorMessage: "",
	});

	const InputValidation = () => {
		var hasError = false;
		const errors = {};

		// eslint-disable-next-line
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if (userEmail.match(mailformat)) {
			hasError = false;
			errors.errorMessage = "";
		} else {
			hasError = true;
			errors.errorMessage = "Entered email is not valid!";
		}

		if (hasError) {
			setError(errors);
		} else {
			setError({ errorMessage: "" });
		}

		return hasError;
	};

	const getPassword = async () => {
		const errorExists = InputValidation();

		console.log("userEmail: ", userEmail);

		if (errorExists === false) {
			await api
				.post("/seller/forget/password", { email: userEmail })
				.then((res) => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message:
							"SUCCESS: An email containing Password Reset link has been sent!.",
						open: true,
					});
					setuserEmail("");
				})
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						type: "error",
						message: "ERROR: This Email doesn't exists!",
						open: true,
					});
				});
		}
	};

	return (
		<React.Fragment>
			<AppBar position="absolute" className={classes.appBar}>
				<Toolbar>
					<img src={Logo} alt="Logo" className={classes.logo} />
				</Toolbar>
			</AppBar>
			<div style={{ padding: "40px", marginTop: "40px" }}>
				<main className={classes.layout}>
					<Paper className={classes.paper}>
						<Typography
							variant="h4"
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
									placeholder="Enter Email here"
									fullWidth
									value={userEmail}
									error={
										error.errorMessage.length > 0
											? true
											: false
									}
									helperText={error.errorMessage}
									onChange={(e) =>
										setuserEmail(e.target.value)
									}
								/>
							</Grid>
							<Grid item xs={12} className={classes.buttons}>
								<Button
									variant="contained"
									color="primary"
									onClick={getPassword}
								>
									Reset Password
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</main>
			</div>

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

export default withRouter(ForgetPassword);
