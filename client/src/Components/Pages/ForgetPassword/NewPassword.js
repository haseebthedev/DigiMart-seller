import React, { useState, useEffect } from "react";
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

	const [token, setToken] = useState("");

	// Current Path - URL Location
	const {
		location: { search },
	} = props;

	const [newPassword, setnewPassword] = useState("");
	const [newConfirmPassword, setnewConfirmPassword] = useState("");

	const ResetNewPassword = async () => {
		if (newPassword !== "" && newConfirmPassword !== "") {
			if (newPassword === newConfirmPassword) {
				await api
					.post(`/seller/reset/password/auth/${token}`, {
						password: newPassword,
					})
					.then((res) => {
						setSnackBar({
							...snackBarstate,
							type: "success",
							message: "SUCCESS: New Password has been saved!.",
							open: true,
						});
					})
					.catch((error) => {
						setSnackBar({
							...snackBarstate,
							type: "error",
							message: "ERROR: Something went wrong!",
							open: true,
						});
					});
			} else {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Both Passwords are not same!",
					open: true,
				});
			}
		}
	};

	useEffect(() => {
		let token = search.split("=")[1];
		setToken(token);
		// eslint-disable-next-line
	}, []);

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
							New Password
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									required
									name="userEmail"
									label="New Password"
									fullWidth
									value={newPassword}
									onChange={(e) =>
										setnewPassword(e.target.value)
									}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									name="userEmail"
									label="Confirm New Password"
									fullWidth
									value={newConfirmPassword}
									onChange={(e) =>
										setnewConfirmPassword(e.target.value)
									}
								/>
							</Grid>
							<Grid item xs={12} className={classes.buttons}>
								<Button
									variant="contained"
									color="primary"
									onClick={ResetNewPassword}
								>
									Save Password
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
