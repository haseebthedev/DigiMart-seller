import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
// import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import axios from "axios";
import Logo from "../../../assets/images/logo.png";

import { withRouter } from "react-router-dom";
import { useStyles } from "./styles";

const ForgetPassword = () => {
	const classes = useStyles();

	const [userEmail, setuserEmail] = React.useState("haseeb@gmail.com");

	const [state, setState] = React.useState({
		open: false,
		vertical: "top",
		horizontal: "center",
	});

	const { vertical, horizontal, open } = state;

	const handleClose = () => {
		setState({ ...state, open: false });
	};

	const getPassword = () => {
		const URL = "http://localhost:8080/seller/forgetPassword";
		axios
			.patch(URL, { email: userEmail })
			.then((res) => console.log("Send Mail", res))
			.catch((error) => console.log());

		setState({ open: true, vertical: "bottom", horizontal: "center" });
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
									fullWidth
									value={userEmail}
									onChange={(e) =>
										setuserEmail(e.target.value)
									}
								/>
							</Grid>
							<Grid item xs={12} className={classes.buttons}>
								<Button
									variant="contained"
									color="secondary"
									onClick={getPassword}
								>
									Get Password
								</Button>
								<Snackbar
									anchorOrigin={{ vertical, horizontal }}
									open={open}
									onClose={handleClose}
									autoHideDuration={3000}
									message="Your password has been sent!"
									key={vertical + horizontal}
									action={[
										<IconButton
											key="close"
											color="inherit"
											onClick={handleClose}
										>
											<CloseIcon />
										</IconButton>,
									]}
								/>
							</Grid>
						</Grid>
					</Paper>
				</main>
			</div>
		</React.Fragment>
	);
};

export default withRouter(ForgetPassword);
