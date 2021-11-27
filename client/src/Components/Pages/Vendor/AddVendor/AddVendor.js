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
	InputLabel,
	FormControl,
} from "@material-ui/core";
import axios from "axios";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import AddVendorSvg from "../../../../assets/images/AddVendor.svg";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";
import { Link } from "react-router-dom";

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
	const [Countries, setCountries] = useState([]);
	const [Cities, setCities] = useState([]);
	const [vendorCategoryList, setVendorCategoryList] = useState([]);

	const [vendorDetails, setVendorDetails] = useState({
		companyName: "",
		address: "",
		businessNumber: "",
		email: "",
		city: "DEFAULT",
		country: "DEFAULT",
		description: "",
		typeOfBusiness: "",
		category: "DEFAULT",
		contactPersonName: "",
		contactPersonDesignation: "",
		contactPersonNumber: "",
		contactPersonEmail: "",
		logo: "",
	});

	const [IFerrors, setIFerrors] = useState({
		companyNameError: "",
		addressError: "",
		businessNumberError: "",
		emailError: "",
		cityError: "",
		countryError: "",
		descriptionError: "",
		typeOfBusinessError: "",
		categoryError: "",
		contactPersonNameError: "",
		contactPersonDesignationError: "",
		contactPersonNumberError: "",
		contactPersonEmailError: "",
	});

	const clearInputFields = () => {
		setVendorDetails({
			companyName: "",
			address: "",
			businessNumber: "",
			email: "",
			city: "",
			country: "DEFAULT",
			description: "",
			typeOfBusiness: "",
			category: "DEFAULT",
			contactPersonName: "",
			contactPersonDesignation: "",
			contactPersonNumber: "",
			contactPersonEmail: "",
			logo: "",
		});
	};

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// name
		var nameFormat = /^[0-9A-Za-z\s_+()'#@&-]+$/;
		if (vendorDetails.companyName.match(nameFormat)) {
			errors.companyNameError = "";
		} else {
			hasError = true;
			errors.companyNameError =
				"Name cannot contains several Special Characters!";
		}

		//typeofBusiness
		if (vendorDetails.typeOfBusiness.match(nameFormat)) {
			errors.typeOfBusinessError = "";
		} else {
			hasError = true;
			errors.typeOfBusinessError =
				"Please Enter a Valid Type of Business!";
		}

		// address
		var addressFormat = /^[a-zA-Z0-9-@#{1},\s]*$/;
		if (
			vendorDetails.address.match(addressFormat) &&
			vendorDetails.address.length > 10
		) {
			errors.addressError = "";
		} else {
			hasError = true;
			errors.addressError =
				"Entered Address is invalid. Special Characters not allowed i.e. /!$%^&*()";
		}

		// phone
		var phoneFormat = /^(\0)?[0-9]{10}$/;
		if (vendorDetails.businessNumber.match(phoneFormat)) {
			errors.businessNumberError = "";
		} else {
			hasError = true;
			errors.businessNumberError = "Entered Phone Number is invalid!";
		}

		// city
		if (!vendorDetails.city.match("DEFAULT")) {
			errors.cityError = "";
		} else {
			hasError = true;
			errors.cityError = "Kindly Select City Name!";
		}

		// Country
		if (!vendorDetails.country.match("DEFAULT")) {
			errors.countryError = "";
		} else {
			hasError = true;
			errors.countryError = "Kindly Select Country Name!";
		}

		// email
		// eslint-disable-next-line
		var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (vendorDetails.email.match(mailFormat)) {
			errors.emailError = "";
		} else {
			hasError = true;
			errors.emailError = "Entered Email address is invalid!";
		}

		// description
		var descFormat = /^[A-Za-z0-9.,'!()#&+-\s]+$/;
		if (vendorDetails.description.match(descFormat)) {
			errors.descriptionError = "";
		} else {
			hasError = true;
			errors.descriptionError =
				"Description contains several characters that aren't allowed!";
		}

		// Vendor category
		if (vendorDetails.category.match("DEFAULT")) {
			hasError = true;
			errors.categoryError = "Please Choose a Category for Vendor!";
		} else {
			errors.categoryError = "";
		}

		// Representative name
		if (vendorDetails.contactPersonName.match(nameFormat)) {
			errors.contactPersonNameError = "";
		} else {
			hasError = true;
			errors.contactPersonNameError =
				"Invalid Input. Name cannot contains several Special Characters!";
		}

		// phone
		var contactFormat = /^(\+92)?[0-9]{10}$/;
		if (vendorDetails.contactPersonNumber.match(contactFormat)) {
			errors.contactPersonNumberError = "";
		} else {
			hasError = true;
			errors.contactPersonNumberError =
				"Entered Phone Number is invalid!";
		}

		// designation
		if (vendorDetails.contactPersonDesignation.match(nameFormat)) {
			errors.contactPersonDesignationError = "";
		} else {
			hasError = true;
			errors.contactPersonDesignationError =
				"Invalid Input. Designation cannot contains several Special Characters!";
		}

		// email
		// eslint-disable-next-line
		var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (vendorDetails.contactPersonEmail.match(mailFormat)) {
			errors.contactPersonEmailError = "";
		} else {
			hasError = true;
			errors.contactPersonEmailError =
				"Entered Email address is invalid!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const handlerVendorDetails = (input) => (e) => {
		setVendorDetails({ ...vendorDetails, [input]: e.target.value });
	};

	const handlerAddVendor = async (e) => {
		e.preventDefault();

		var errorExists = InputValidation();

		if (errorExists === false) {
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
				.then(() => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message:
							"SUCCESS: The Vendor has been added for approval!",
						open: true,
					});
					clearInputFields();
				})
				.catch(() =>
					setSnackBar({
						...snackBarstate,
						type: "error",
						message: "ERROR: System is not responding or busy!",
						open: true,
					})
				);
		}
	};

	async function uploadImage(file) {
		const NAME_OF_UPLOAD_PRESET = "ddyaz57o";
		const YOUR_CLOUDINARY_ID = "dbsd56hgh";

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", NAME_OF_UPLOAD_PRESET);
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${YOUR_CLOUDINARY_ID}/image/upload`,
			{
				method: "POST",
				body: data,
			}
		);
		const img = await res.json();
		return img.secure_url;
	}

	const fileHandler = async (event) => {
		let files = event.target.files;
		let temp = await uploadImage(files[0]);
		setVendorDetails({
			...vendorDetails,
			logo: temp,
		});
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

	const getAllCountries = async () => {
		await axios
			.get("https://countriesnow.space/api/v0.1/countries/positions")
			.then((res) => {
				let countriesList = res.data.data;
				setCountries(countriesList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	const getCitiesUsingCountry = async () => {
		await axios
			.post("https://countriesnow.space/api/v0.1/countries/cities", {
				country: vendorDetails.country,
			})
			.then((res) => {
				let citiesList = res.data.data;
				setCities(citiesList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	useEffect(() => {
		getAllVendorCategory();
		getAllCountries();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (vendorDetails.country !== "DEFAULT") {
			getCitiesUsingCountry();
		}
		// eslint-disable-next-line
	}, [vendorDetails.country]);

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
											helperText={
												IFerrors.companyNameError
											}
											error={
												IFerrors.companyNameError
													.length > 0
													? true
													: false
											}
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
											helperText={IFerrors.emailError}
											error={
												IFerrors.emailError.length > 0
													? true
													: false
											}
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
											helperText={
												IFerrors.descriptionError
											}
											error={
												IFerrors.descriptionError
													.length > 0
													? true
													: false
											}
											style={{ marginBottom: 20 }}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel
												style={{
													marginLeft: "10px",
													marginTop: "-10px",
												}}
											>
												Country
											</InputLabel>
											<Select
												variant="outlined"
												margin="dense"
												required
												style={{ marginTop: 8 }}
												value={vendorDetails.country}
												name="country"
												onChange={handlerVendorDetails(
													"country"
												)}
												error={
													IFerrors.countryError
														.length > 0
														? true
														: false
												}
											>
												<MenuItem
													value="DEFAULT"
													disabled
												>
													Select your Country
												</MenuItem>
												{Countries.map((el, index) => (
													<MenuItem
														value={el.name}
														key={index}
													>
														{el.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>

									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel
												style={{
													marginLeft: "10px",
													marginTop: "-10px",
												}}
											>
												City
											</InputLabel>
											<Select
												variant="outlined"
												margin="dense"
												required
												style={{ marginTop: 8 }}
												name="city"
												value={vendorDetails.city}
												onChange={handlerVendorDetails(
													"city"
												)}
												error={
													IFerrors.cityError.length >
													0
														? true
														: false
												}
											>
												<MenuItem
													value="DEFAULT"
													disabled
												>
													Select City
												</MenuItem>
												{Cities.map((el, index) => (
													<MenuItem
														value={el}
														key={index}
													>
														{el}
													</MenuItem>
												))}
											</Select>
										</FormControl>
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
											helperText={IFerrors.addressError}
											error={
												IFerrors.addressError.length > 0
													? true
													: false
											}
											style={{ marginBottom: 20 }}
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
											placeholder="0514844123"
											value={vendorDetails.businessNumber}
											onChange={handlerVendorDetails(
												"businessNumber"
											)}
											helperText={
												IFerrors.businessNumberError
											}
											error={
												IFerrors.businessNumberError
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel
												style={{
													marginLeft: "10px",
													marginTop: "-10px",
												}}
											>
												Category
											</InputLabel>
											<Select
												variant="outlined"
												margin="dense"
												required
												fullWidth
												style={{ marginTop: 8 }}
												value={vendorDetails.category}
												name="category"
												onChange={handlerVendorDetails(
													"category"
												)}
												error={
													IFerrors.categoryError
														.length > 0
														? true
														: false
												}
											>
												<MenuItem
													value="DEFAULT"
													disabled
												>
													Choose a Vendor Category
												</MenuItem>
												{vendorCategoryList.map(
													(el, index) => (
														<MenuItem
															value={el.name}
															key={index}
														>
															{el.name}
														</MenuItem>
													)
												)}
											</Select>
										</FormControl>
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
											helperText={
												IFerrors.typeOfBusinessError
											}
											error={
												IFerrors.typeOfBusinessError
													.length > 0
													? true
													: false
											}
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
											helperText={
												IFerrors.contactPersonNameError
											}
											error={
												IFerrors.contactPersonNameError
													.length > 0
													? true
													: false
											}
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
											placeholder="+923123123456"
											value={
												vendorDetails.contactPersonNumber
											}
											onChange={handlerVendorDetails(
												"contactPersonNumber"
											)}
											helperText={
												IFerrors.contactPersonNumberError
											}
											error={
												IFerrors
													.contactPersonNumberError
													.length > 0
													? true
													: false
											}
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
											helperText={
												IFerrors.contactPersonDesignationError
											}
											error={
												IFerrors
													.contactPersonDesignationError
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											name="contactPersonEmail"
											label="Email"
											value={
												vendorDetails.contactPersonEmail
											}
											onChange={handlerVendorDetails(
												"contactPersonEmail"
											)}
											helperText={
												IFerrors.contactPersonEmailError
											}
											error={
												IFerrors.contactPersonEmailError
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
								</Grid>

								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										marginTop: 20,
										marginBottom: 5,
										padding: 20,
										height: 120,
										border: "1px solid #c4c4c4",
										borderRadius: 6,
									}}
								>
									<Grid
										container
										justify="center"
										spacing={2}
									>
										{vendorDetails.logo != "" ? (
											<Grid item align="center">
												<img
													src={vendorDetails.logo}
													alt="product-images"
													width="60px"
													height="60px"
													style={{
														border: "3px solid #e1e1e1",
														padding: "2px",
													}}
												/>
												<div>
													<HighlightOffRoundedIcon
														onClick={() => {
															setVendorDetails({
																...vendorDetails,
																logo: "",
															});
														}}
														style={{
															color: "grey",
														}}
													/>
												</div>
											</Grid>
										) : (
											<Typography>
												Upload Vendor Image
											</Typography>
										)}
									</Grid>
								</div>
								<Grid item style={{ marginBottom: 20 }}>
									<div>
										<label htmlFor="contained-button-file">
											<Button
												size="small"
												startIcon={
													<AddPhotoAlternateIcon />
												}
												variant="outlined"
												color="primary"
												component="span"
											>
												Upload Images
											</Button>
										</label>
										<input
											id="contained-button-file"
											type="file"
											accept="image/png, image/jpeg"
											onChange={fileHandler}
											hidden
										/>
									</div>
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
										<Link
											to="/seller/vendors/view-vendors"
											style={{ textDecoration: "none" }}
										>
											<Button
												fullWidth
												variant="outlined"
												color="primary"
												className={classes.submit}
											>
												View All Vendor
											</Button>
										</Link>
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
