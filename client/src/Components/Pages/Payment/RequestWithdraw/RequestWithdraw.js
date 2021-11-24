import React, { useState, useEffect } from "react";
import {
	Button,
	Grid,
	Typography,
	FormControl,
	InputLabel,
	OutlinedInput,
	Paper,
	Select,
	MenuItem,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import api from "../../../../Axios/api";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";

export default function RequestWithdraw() {
	const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;

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

	// Payment Data
	const [pendingPayment, setPendingPayment] = useState(0);
	const [paymentData, setPaymentData] = useState([]);

	const [withdrawAmount, setWithdrawAmount] = useState(0);

	const handleWithdrawAmount = (amount) => {
		setWithdrawAmount(amount);
	};

	const requestPaymentWithdraw = () => {
		if (withdrawAmount <= pendingPayment && withdrawAmount > 0) {
			api.get(
				`/seller/store/pending/payment/withdraw/${withdrawAmount}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message:
							"SUCCESS: Your payment will be sent to you soon.",
						open: true,
					});
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						type: "error",
						message:
							"Error: Something went wrong or system is down!",
						open: true,
					});
				});
		} else if (withdrawAmount <= 0) {
			setSnackBar({
				...snackBarstate,
				type: "info",
				message: "Withdrawal Amount cannot be Zero!",
				open: true,
			});
		} else {
			setSnackBar({
				...snackBarstate,
				type: "info",
				message:
					"Withdrawal Amount cannot be geater than Pending Amount.",
				open: true,
			});
		}
	};

	const getPaymentDetails = () => {
		api.get("/seller/bankDetails", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setPaymentData(res.data.data.PaymentAccounts);
			})
			.catch(() => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: Server is busy or not responding at the moment.",
					open: true,
				});
			});
	};

	const getPendingPayment = () => {
		api.get("/seller/store/pending/payment/view", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setPendingPayment(res.data.data.pendingPayment);
			})
			.catch((error) => console.log("Error: ", error));
	};

	useEffect(() => {
		getPendingPayment();
		getPaymentDetails();
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container className={classes.root}>
			{/* Printing List of Payment methods */}
			<Grid item xs={12} sm={12} md={12}>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} align="center">
						{paymentData.length === 0 ? (
							<div
								style={{
									padding: 10,
									backgroundColor: "red",
									marginBottom: 20,
									borderRadius: 6,
								}}
							>
								<Typography style={{ color: "#fff" }}>
									Please Add a Payment Method before
									withdrawing your earnings!!!
								</Typography>
							</div>
						) : (
							<Grid></Grid>
						)}
					</Grid>

					<Grid item xs={12} sm={12} md={12} align="center">
						<Paper style={{ paddingTop: 40, paddingBottom: 40 }}>
							<Typography variant="h3" color="primary">
								Current Balance: Rs. {pendingPayment}
							</Typography>
						</Paper>
					</Grid>

					<Grid
						item
						xs={12}
						sm={12}
						md={12}
						align="center"
						style={{ marginTop: 60 }}
					>
						<Grid
							container
							alignItems="center"
							spacing={4}
							style={{ marginBottom: 20 }}
						>
							<Grid item xs={12} sm={6} md={6} align="right">
								<Typography
									variant="h5"
									style={{ color: "#262626" }}
								>
									Withdraw Amount
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6} md={6} align="left">
								<FormControl
									variant="outlined"
									style={{ width: 300 }}
								>
									{/* <InputLabel htmlFor="outlined-adornment-amount">
										Amount
									</InputLabel> */}
									<OutlinedInput
										id="outlined-adornment-amount"
										startAdornment={
											<InputAdornment position="start">
												Rs.
											</InputAdornment>
										}
										inputProps={{
											maxLength:
												pendingPayment.toString()
													.length,
										}}
										onChange={(e) =>
											handleWithdrawAmount(e.target.value)
										}
									/>
								</FormControl>
							</Grid>
						</Grid>

						<Grid container alignItems="center" spacing={4}>
							<Grid item xs={12} sm={6} md={6} align="right">
								<Typography
									variant="h5"
									style={{ color: "#262626" }}
								>
									Payment Method
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6} md={6} align="left">
								<FormControl
									variant="outlined"
									style={{ width: 300 }}
								>
									<InputLabel htmlFor="outlined-age-native-simple">
										Payment Processor
									</InputLabel>
									<Select
										label="Payment Processor"
										variant="outlined"
										defaultValue={"DEFAULT"}
										inputProps={{
											name: "Payment Processor",
											id: "outlined-age-native-simple",
										}}
									>
										<MenuItem value="DEFAULT" disabled>
											Choose Payment Processor...
										</MenuItem>
										{paymentData.map((el, index) => {
											return (
												<MenuItem
													value="STRIPE"
													key={index}
												>
													{el.paymentMethod}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						<Grid container alignItems="center" spacing={4}>
							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								align="right"
							></Grid>

							<Grid item xs={12} sm={6} md={6} align="left">
								<Button
									variant="contained"
									color="primary"
									disableElevation
									style={{ width: 300, marginTop: 20 }}
									onClick={requestPaymentWithdraw}
									disabled={paymentData.length === 0}
								>
									Request Withdrawal
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

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
		</Grid>
	);
}
