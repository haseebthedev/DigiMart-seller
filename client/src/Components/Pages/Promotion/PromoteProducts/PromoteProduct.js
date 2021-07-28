import React, { useState } from "react";
import "date-fns";
import {
	Button,
	TextField,
	Grid,
	Typography,
	Paper,
	Select,
	MenuItem,
	Divider,
	FormGroup,
} from "@material-ui/core";
// import api from "../../../../Axios/api";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import useStyles from "./styles";
import { useUserContext } from "../../../../context/UserContext";

export default function AddProduct() {
	const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;

	const [selectedDate, setSelectedDate] = useState(
		new Date("2021-05-18T21:11:54")
	);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<div className={classes.paper}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} lg={8}>
							<Typography variant="h4" gutterBottom>
								Add Product Details
							</Typography>
							<Divider />
							<form className={classes.form}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Product Name"
											name="name"
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Category"
											name="category"
											defaultValue="DEFAULT"
											style={{ marginTop: 8 }}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Product Category
											</MenuItem>
											<MenuItem value={"Electronics"}>
												Electronics
											</MenuItem>
											<MenuItem value={"Electronics"}>
												Sports
											</MenuItem>
											<MenuItem value={"Electronics"}>
												Health and Medicine
											</MenuItem>
										</Select>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={12} md={12} lg={12}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											multiline
											rows={4}
											label="Description"
											name="description"
										/>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={2}
									style={{ marginBottom: 10 }}
								>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											label="Discount (%)"
											name="discount"
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={3}
										lg={3}
										align="center"
									>
										<div
											style={{
												marginTop: 10,
												border: "1px solid rgb(224 224 224)",
												padding: 5,
											}}
										>
											<Typography color="primary">
												BESTBUY2021
											</Typography>
										</div>
									</Grid>
									<Grid item xs={12} sm={6} md={3} lg={3}>
										<Button
											fullWidth
											variant="outlined"
											style={{ marginTop: 9 }}
										>
											Coupon
										</Button>
									</Grid>
								</Grid>
								<Divider />
								<div
									style={{
										display: "flex",
										alignItems: "center",
										marginTop: 20,
										marginBottom: 20,
										padding: 20,
										border: "1px solid #c4c4c4",
										borderRadius: 6,
									}}
								>
									<Grid
										container
										style={{ margin: "10px 0" }}
										spacing={2}
									>
										<Grid item>
											<div>
												<label htmlFor="contained-button-file">
													<Button
														size="small"
														variant="contained"
														color="primary"
														component="span"
													>
														Select Product
													</Button>
												</label>
												<input
													id="contained-button-file"
													type="file"
													multiple
													accept="image/png, image/jpeg"
													hidden
												/>
											</div>
										</Grid>
										<Grid item>
											<Typography
												style={{ marginTop: 4 }}
											></Typography>
										</Grid>
									</Grid>
								</div>
								<Grid container spacing={2}>
									<Grid item xs={6} sm={6} md={8} lg={8}>
										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											multiline
											label="Product URL"
											name="productURL"
										/>
									</Grid>
									<Grid item xs={6} sm={6} md={4} lg={4}>
										<Button
											variant="outlined"
											fullWidth
											style={{ marginTop: 9 }}
										>
											Shortener URL
										</Button>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={2}
									style={{ marginBottom: 10 }}
								>
									<Grid item xs={12} sm={12} md={12} lg={12}>
										<Typography color="primary">
											http://shortener.com/p/dsafsa3
										</Typography>
									</Grid>
								</Grid>

								<Grid
									container
									spacing={2}
									style={{ marginBottom: 10 }}
									align="center"
								>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardDatePicker
												margin="normal"
												label="Select Date"
												format="MM/dd/yyyy"
												value={selectedDate}
												onChange={handleDateChange}
											/>
										</MuiPickersUtilsProvider>
									</Grid>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardTimePicker
												margin="normal"
												label="Select Time"
												value={selectedDate}
												onChange={handleDateChange}
											/>
										</MuiPickersUtilsProvider>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={12} md={12} lg={12}>
										<FormGroup row>
											<Typography
												variant="body2"
												align="center"
											>
												Note: Set Date/Time only, if
												want to schedule the Promotion
												of Product
											</Typography>
										</FormGroup>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={2}
									style={{ marginTop: 20 }}
								>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											style={{ marginTop: 9 }}
										>
											START PROMOTION
										</Button>
									</Grid>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<Button
											variant="contained"
											fullWidth
											style={{ marginTop: 9 }}
										>
											SCHEDULE PROMOTIONS
										</Button>
									</Grid>
								</Grid>
							</form>
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={4}>
							<div
								style={{
									border: "1px solid rgb(224 224 224)",
									borderRadius: 6,
									padding: 15,
									marginBottom: 20,
								}}
							>
								<Typography variant="h5">Note:</Typography>
								<Typography variant="body2">
									All the details of Product entered here will
									be send as SMS / Email to interested buyers.
									So, kindly add valid details of Product
									only.
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
			</Grid>
		</Grid>
	);
}
