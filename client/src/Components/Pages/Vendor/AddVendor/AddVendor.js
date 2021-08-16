import React, { useState, useEffect } from "react";
import {
	Button,
	TextField,
	Grid,
	Typography,
	Paper,
	Select,
	MenuItem,
	Divider,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import AddVendorSvg from "../../../../assets/images/AddVendor.svg";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";

export default function AddProduct() {
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

	const [vendorCategoryList, setVendorCategoryList] = useState([]);

	const [vendorDetails, setVendorDetails] = useState({
		companyName: "haseebs Electronics",
		address: "B0987, rwp",
		businessNumber: "0514589087",
		email: "jamalElectronics@gmai.com",
		city: "rawalpindi",
		country: "Pakistan",
		description: "We deliver electronics items in all over pakistan",
		typeOfBusiness: "Wholesaler",
		category: "",
		contactPersonName: "Ameen",
		contactPersonDesignation: "Manager",
		contactPersonNumber: "+923350987654",
		contactPersonEmail: "ameen@gmail.com",
	});

	const handlerVendorDetails = (input) => (e) => {
		setVendorDetails({ ...vendorDetails, [input]: e.target.value });
	};

	const handlerAddVendor = async (e) => {
		e.preventDefault();

		await api
			.post(
				"/seller/vendor",
				{
					...vendorDetails,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(() =>
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: The Vendor has been added for approval!",
					open: true,
				})
			)
			.catch(() =>
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: System is not responding or busy!",
					open: true,
				})
			);
	};

	const getAllVendorCategory = async () => {
		await api
			.get("/seller/vendorCategories", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				const categoryList = res.data.data.categories;
				setVendorCategoryList(categoryList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	useEffect(() => {
		getAllVendorCategory();
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container component={Paper}>
			<Grid item xs={12} sm={12} md={12}>
				<div className={classes.paper}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} lg={8}>
							<Typography variant="h4" gutterBottom>
								Add Vendor Details
							</Typography>
							<Divider />
							<form className={classes.form}>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Company Name"
											name="companyName"
											value={vendorDetails.companyName}
											onChange={handlerVendorDetails(
												"companyName"
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Email"
											name="email"
											value={vendorDetails.email}
											onChange={handlerVendorDetails(
												"email"
											)}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											multiline
											rows={3}
											name="description"
											label="Description"
											value={vendorDetails.description}
											onChange={handlerVendorDetails(
												"description"
											)}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="City"
											name="city"
											value={vendorDetails.city}
											onChange={handlerVendorDetails(
												"city"
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Country"
											name="country"
											value={vendorDetails.country}
											onChange={handlerVendorDetails(
												"country"
											)}
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Address"
											name="address"
											value={vendorDetails.address}
											onChange={handlerVendorDetails(
												"address"
											)}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Business Number"
											name="businessNumber"
											value={vendorDetails.businessNumber}
											onChange={handlerVendorDetails(
												"businessNumber"
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Vendor Category"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											name="category"
											onChange={handlerVendorDetails(
												"category"
											)}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Vendor Category
											</MenuItem>
											{vendorCategoryList.map(
												// eslint-disable-next-line
												(el, index) => {
													<MenuItem
														value={el.name}
														key={index}
													>
														{el.name}
													</MenuItem>;
												}
											)}
										</Select>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Type Of Bunsiness"
											name="typeOfBusiness"
											value={vendorDetails.typeOfBusiness}
											onChange={handlerVendorDetails(
												"typeOfBusiness"
											)}
										/>
									</Grid>
								</Grid>

								<Grid
									container
									spacing={2}
									style={{ marginTop: 20 }}
								>
									<Grid item xs={6}>
										<Typography variant="h5" gutterBottom>
											Representative Details
										</Typography>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Name"
											name="contactPersonName"
											value={
												vendorDetails.contactPersonName
											}
											onChange={handlerVendorDetails(
												"contactPersonName"
											)}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Phone #"
											name="contactPersonNumber"
											value={
												vendorDetails.contactPersonNumber
											}
											onChange={handlerVendorDetails(
												"contactPersonNumber"
											)}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											name="contactPersonDesignation"
											label="Designation"
											value={
												vendorDetails.contactPersonDesignation
											}
											onChange={handlerVendorDetails(
												"contactPersonDesignation"
											)}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<Button
											fullWidth
											variant="contained"
											color="primary"
											className={classes.submit}
											onClick={handlerAddVendor}
										>
											Add Vendor
										</Button>
									</Grid>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<Button
											fullWidth
											variant="outlined"
											color="primary"
											className={classes.submit}
										>
											View All Vendor
										</Button>
									</Grid>
								</Grid>
							</form>
						</Grid>
						<Grid item xs={false} sm={false} md={false} lg={4}>
							<div
								style={{
									border: "1px solid rgb(224 224 224)",
									borderRadius: 6,
									padding: 15,
									marginBottom: 10,
									textAlign: "center",
								}}
							>
								<img
									src={AddVendorSvg}
									alt="vendors img"
									style={{
										maxWidth: "300px",
										marginBottom: 20,
									}}
								/>
								<Typography variant="h5">
									TIP OF THE DAY?
								</Typography>
								<Typography
									variant="body2"
									style={{ textAlign: "justify" }}
								>
									By adding the Vendors, you will be able to
									buy and sell their products while you can
									set custom price of every product thus
									making profits on every sale.
								</Typography>
							</div>
						</Grid>
					</Grid>
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
}
