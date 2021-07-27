import React, { useState } from "react";
// import api from "../../../Axios/api";
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

// components
// import DeletePaymentDialog from "../../FormDialog/DeletePaymentMethod";

import useStyles from "./styles";

export default function PaymentMethod() {
	const classes = useStyles();

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

	// List of Payment methods
	const [paymentData, setPaymentData] = useState([]);

	// new Payment methods (MODAL)
	const [newPayMethod, setNewPayMethod] = useState({
		method: "SECONDARY",
	});

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

	const submitNewMethod = () => {
		setPaymentData([...paymentData, newPayMethod]);
		setModelOpen(false);
		setNewPayMethod({});
		setSnackBar({
			...snackBarstate,
			type: "success",
			message: "SUCCESS: Payment method has been added.",
			open: true,
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

	// delete Button Handler
	const deleteMethod = (index) => {
		try {
			const oldList = paymentData.filter(
				(el, _index) => _index !== index
			);
			setPaymentData(oldList);
			setSnackBar({
				...snackBarstate,
				type: "success",
				message: "SUCCESS: Payment method has been deleted.",
				open: true,
			});
		} catch (error) {
			setSnackBar({
				...snackBarstate,
				type: "error",
				message: "ERROR: " + error,
				open: true,
			});
		}
	};

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
											el.isPrimary === true
												? "primary"
												: "textPrimary"
										}
									>
										{el.isPrimary === true
											? "PRIMARY"
											: "SECONDARY"}
									</Typography>
									<Typography
										variant="h4"
										gutterBottom
										align="center"
									>
										{el.method}
									</Typography>
									<Typography
										variant="body2"
										className={classes.method}
									>
										{el.name}
									</Typography>
									{el.title === "PayPal" ? (
										<Typography
											variant="body2"
											className={classes.method}
										>
											{el.email}
										</Typography>
									) : (
										<Typography
											variant="body2"
											className={classes.method}
										>
											{el.method === "PAYPAL"
												? el.email
												: el.accountNo}
										</Typography>
									)}
									<ButtonGroup
										color="primary"
										className={classes.btns}
									>
										<Button color="primary">
											<EditIcon />
										</Button>
										<Button
											color="primary"
											onClick={() => deleteMethod(index)}
										>
											<DeleteIcon />
										</Button>
									</ButtonGroup>
								</CardContent>
							</Card>
						</Grid>
					))}
					<Grid item xs={12} sm={6} md={4}>
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
								<Link
									color="error"
									component="button"
									variant="body2"
									onClick={handleOpen}
								>
									Add New Method
								</Link>
							</CardContent>
						</Card>
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
											onChange={handleChange("method")}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Payment Method...
											</MenuItem>
											<MenuItem value="BANK">
												Bank Transfer
											</MenuItem>
											<MenuItem value="EASYPAISA">
												Easypaisa
											</MenuItem>
											<MenuItem value="JAZZCASH">
												JazzCash
											</MenuItem>
											<MenuItem value="PAYONEER">
												Payoneer
											</MenuItem>
											<MenuItem value="PAYPAL">
												Paypal
											</MenuItem>
										</Select>
									</Grid>
								</Grid>
							</form>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							{newPayMethod.method === "BANK" ? (
								<form>
									<Typography variant="h5">
										Enter Bank Account Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Holder Name"
												placeholder="Haseeb Butt etc."
												onChange={handleChange("name")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Number"
												placeholder="XXXX XXXX XXXX XXXX etc."
												onChange={handleChange(
													"accountNo"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Bank Name"
												name="Bank Name"
												placeholder="Meezan Bank Limited etc."
												onChange={handleChange(
													"bankName"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															onChange={handleMethod(
																"isPrimary"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : newPayMethod.method === "EASYPAISA" ? (
								<form>
									<Typography variant="h5">
										Enter Easypaisa Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Holder Name"
												name="Account Holder Name"
												placeholder="Haseeb Butt etc."
												onChange={handleChange("name")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Number"
												name="Account Number"
												placeholder="034X XXXXXXX"
												onChange={handleChange(
													"accountNo"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															onChange={handleMethod(
																"isPrimary"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : newPayMethod.method === "JAZZCASH" ? (
								<form>
									<Typography variant="h5">
										Enter JazzCash Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Holder Name"
												name="Account Holder Name"
												placeholder="Haseeb Butt etc."
												onChange={handleChange("name")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Number"
												name="Account Number"
												placeholder="030X XXXXXXX"
												onChange={handleChange(
													"accountNo"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															onChange={handleMethod(
																"isPrimary"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : newPayMethod.method === "PAYONEER" ? (
								<form>
									<Typography variant="h5">
										Enter Payoneer Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Holder Name"
												placeholder="Haseeb Butt etc."
												onChange={handleChange("name")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Bank Name"
												placeholder="Citi Bank Limited etc."
												onChange={handleChange(
													"bankName"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Account Number"
												placeholder="XXXX XXXX XXXX XXXX"
												onChange={handleChange(
													"accountNo"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Routing Number"
												placeholder="XXXXXXXXX"
												onChange={handleChange(
													"routingNo"
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															onChange={handleMethod(
																"isPrimary"
															)}
														/>
													}
													label="Primary Method to receive Payments."
												/>
											</FormGroup>
										</Grid>
									</Grid>
								</form>
							) : newPayMethod.method === "PAYPAL" ? (
								<form>
									<Typography variant="h5">
										Enter PayPal Details
									</Typography>
									<Grid container justify="center">
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Username"
												name="Username"
												placeholder="Haseeb Butt etc."
												onChange={handleChange("name")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<TextField
												variant="outlined"
												margin="normal"
												fullWidth
												label="Email"
												name="PayPal Email"
												placeholder="haseeb@gmail.com etc."
												onChange={handleChange("email")}
											/>
										</Grid>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															onChange={handleMethod(
																"isPrimary"
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
								<div></div>
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
								SUBMIT
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

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
