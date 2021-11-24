import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import {
	Button,
	Link,
	Grid,
	Card,
	CardContent,
	ButtonGroup,
	Typography,
	Modal,
	TextField,
	FormControlLabel,
	FormGroup,
	Checkbox,
	Select,
	MenuItem,
	Paper,
	Container,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useUserContext } from "../../../../context/UserContext";
import DeletePaymentMethod from "../../../FormDialog/DeletePaymentMethod";
import useStyles from "./styles";

export default function PaymentMethod() {
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

	// Delete Product Dialog
	const [pid, setPid] = useState();
	const [isDeletingPayMethod, setIsDeletingPayMethod] = useState(false);
	// List of Payment methods
	const [paymentData, setPaymentData] = useState([]);

	// new Payment methods (MODAL)
	const [newPayMethod, setNewPayMethod] = useState({
		paymentMethod: "",
		isPrimaryAccount: false,
		AccountHolderName: "",
		accountNumber: "",
	});

	// show delete Account Dialog
	const handlerPayMethodDelete = (id) => {
		setPid(id);
		setIsDeletingPayMethod(true);
	};
	// Delete Account Handler
	const confirmedDeletePayment = () => {
		// api to delete payment method
		api.delete(`/seller/PaymentAccount/${pid}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				let newList = paymentData.filter((el) => el._id !== pid);
				setPaymentData(newList);
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Payment Method has been deleted!",
					open: true,
				});
			})
			.catch(() => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went wrong!",
					open: true,
				});
			});
		setIsDeletingPayMethod(false);
	};

	// Handling Form Inputs here
	const handleChange = (input) => (e) => {
		setNewPayMethod({
			...newPayMethod,
			[input]: e.target.value,
		});
	};

	const handleMethod = (input) => (e) => {
		setNewPayMethod({
			...newPayMethod,
			[input]: e.target.checked,
		});
	};

	const submitNewMethod = async () => {
		await api
			.patch(
				"/seller/addPaymentAccount",
				{ ...newPayMethod },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(() => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Payment method has been added.",
					open: true,
				});
				setPaymentData([...paymentData, newPayMethod]);
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went wrong.",
					open: true,
				});
			});

		setModelOpen(false);
		setNewPayMethod({});
	};

	const submitUpdateMethod = async (el) => {
		await api
			.patch(
				`/seller/updatePaymentAccount/${pid}`,
				{ ...newPayMethod },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(() => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Payment method has been updated.",
					open: true,
				});
				setEPModelOpen(false);
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went wrong.",
					open: true,
				});
			});
	};

	// Modal Settings here
	const [modalOpen, setModelOpen] = useState(false);
	const handleOpen = () => {
		setModelOpen(true);
	};
	const handleClose = () => {
		setModelOpen(false);
	};

	// Edit Payment Modal Settings here
	const [EPmodalOpen, setEPModelOpen] = useState(false);
	const handleEPOpen = () => {
		setEPModelOpen(true);
	};
	const handleEPClose = () => {
		setEPModelOpen(false);
	};

	const editPayMethod = (el) => {
		handleEPOpen(true);
		setNewPayMethod(el);
		setPid(el._id);
	};

	useEffect(() => {
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
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container className={classes.root}>
			{/* Printing List of Payment methods */}
			<Grid item xs={12} sm={12} md={12}>
				<Grid container>
					{paymentData.map((el, index) => (
						<Grid item xs={12} sm={6} md={4} lg={4} key={index}>
							<Card className={classes.card}>
								<CardContent>
									<Typography
										variant="body2"
										gutterBottom
										className={classes.method}
										color={
											el.isPrimaryAccount === true
												? "primary"
												: "textPrimary"
										}
									>
										{el.isPrimaryAccount === true
											? "PRIMARY"
											: "SECONDARY"}
									</Typography>
									<Typography
										variant="h4"
										gutterBottom
										align="center"
									>
										{el.paymentMethod}
									</Typography>
									<Typography
										variant="body2"
										className={classes.method}
									>
										{el.AccountHolderName}
									</Typography>
									<Typography
										variant="body2"
										className={classes.method}
									>
										{el.accountNumber}
									</Typography>
									<ButtonGroup
										color="primary"
										className={classes.btns}
									>
										<Button
											color="primary"
											onClick={() => editPayMethod(el)}
										>
											<EditIcon />
										</Button>
										<Button
											color="primary"
											onClick={() =>
												handlerPayMethodDelete(el._id)
											}
										>
											<DeleteIcon />
										</Button>
									</ButtonGroup>
								</CardContent>
							</Card>
						</Grid>
					))}

					<Grid item xs={12} sm={6} md={4}>
						<Link
							color="error"
							component="button"
							variant="body2"
							onClick={handleOpen}
							style={{ textDecoration: "none" }}
						>
							<Card className={classes.card}>
								<CardContent
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<AddCircleOutlineIcon
										className={classes.addIcon}
										color="primary"
									/>
									<Typography
										variant="body2"
										color="primary"
										style={{ margin: 5 }}
									>
										Add New Method
									</Typography>
								</CardContent>
							</Card>
						</Link>
					</Grid>
				</Grid>
			</Grid>

			{/* Modal to Add new Payment method */}
			<Modal
				open={modalOpen}
				onClose={handleClose}
				onBackdropClick={handleClose}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container component={Paper} maxWidth="md">
					<Grid container style={{ padding: 20 }} spacing={4}>
						<Grid item xs={12} sm={12} md={6}>
							<form>
								<Typography variant="h5">
									Select Payment Method
								</Typography>
								<Grid container>
									<Grid item xs={12}>
										<Select
											variant="outlined"
											defaultValue={"DEFAULT"}
											align="left"
											style={{ marginTop: 16 }}
											fullWidth
											onChange={handleChange(
												"paymentMethod"
											)}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Payment Method...
											</MenuItem>
											<MenuItem value="STRIPE">
												Stripe
											</MenuItem>
										</Select>
									</Grid>
								</Grid>
							</form>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							{newPayMethod.paymentMethod === "STRIPE" ? (
								<form>
									<Typography variant="h5">
										Enter Your Stripe Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Username"
												placeholder="Haseeb Butt etc."
												value={
													newPayMethod.AccountHolderName
												}
												onChange={handleChange(
													"AccountHolderName"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Stripe ID"
												placeholder="acct_1JKPRS2eJzfRUora etc."
												value={
													newPayMethod.accountNumber
												}
												onChange={handleChange(
													"accountNumber"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															checked={
																newPayMethod.isPrimaryAccount
															}
															onChange={handleMethod(
																"isPrimaryAccount"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : (
								<Grid></Grid>
							)}
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="right">
							<Button
								variant="outlined"
								color="primary"
								style={{ marginRight: 10 }}
								onClick={handleClose}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={submitNewMethod}
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Modal to Edit Payment method */}
			<Modal
				open={EPmodalOpen}
				onClose={handleEPClose}
				onBackdropClick={handleEPClose}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container component={Paper} maxWidth="sm">
					<Grid container style={{ padding: 20 }} spacing={4}>
						<Grid item xs={12} sm={12} md={12} align="center">
							{newPayMethod.paymentMethod === "STRIPE" ? (
								<form>
									<Typography variant="h5">
										Enter Your Stripe Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Username"
												placeholder="Haseeb Butt etc."
												value={
													newPayMethod.AccountHolderName
												}
												onChange={handleChange(
													"AccountHolderName"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Stripe ID"
												placeholder="acct_1JKPRS2eJzfRUora etc."
												value={
													newPayMethod.accountNumber
												}
												onChange={handleChange(
													"accountNumber"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															checked={
																newPayMethod.isPrimaryAccount
															}
															onChange={handleMethod(
																"isPrimaryAccount"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : (
								<Grid></Grid>
							)}
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="right">
							<Button
								variant="outlined"
								color="primary"
								style={{ marginRight: 10 }}
								onClick={handleEPClose}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={submitUpdateMethod}
							>
								UPDATE
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Delete Payment Method Dialog */}
			<DeletePaymentMethod
				DeletingPayMethod={isDeletingPayMethod}
				setIsDeletingPayMethod={setIsDeletingPayMethod}
				confirmedDeletePayment={confirmedDeletePayment}
			/>

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
