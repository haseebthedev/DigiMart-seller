import React, { useState, useEffect } from "react";
import {
	Button,
	TextField,
	Grid,
	Typography,
	Paper,
	Select,
	MenuItem,
	FormControlLabel,
	Switch,
	Chip,
	Divider,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import addProduct from "../../../../assets/images/ProductIllustration.svg";
import useStyles from "./styles";
import { useUserContext } from "../../../../context/UserContext";

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

	// category list retrive from DB
	const [productCategories, setProductCategories] = useState([]);
	const [productSubCategories, setProductSubCategories] = useState([]);
	const [productDetails, setProductDetails] = useState({
		name: "",
		description: "",
		category: "",
		subCategory: "",
		vendorCompanyName: "Other",
		vendorCategory: "Other",
		manufactureDate: new Date("2014-08-18T21:11:54"),
		purchasePrice: "",
		salePrice: "",
		state: "",
		shippingCost: "",
		images: [],
		isOnSale: false,
		discountPercentage: "",
		discountPrice: "",
		stockAvailable: "",
		dimensions: "",
	});

	const [colors, setColors] = useState([]);
	const [dimensions, setDimensions] = useState({
		length: "",
		width: "",
		height: "",
		unit: "in",
	});
	const [warranty, setWarranty] = useState("");
	const [warrantySpan, setWarrantySpan] = useState("year");
	const [weight, setWeight] = useState("");
	const [weightUnits, setWeightUnits] = useState("Kg");

	const handlerColor = () => (e) => {
		var newColor = e.target.value;

		const found = colors.some((el) => el === newColor);
		if (!found) {
			setColors([...colors, e.target.value]);
		}
	};

	const handleDeleteColor = (el) => () => {
		setColors((colors) => colors.filter((color, index) => index !== el));
	};

	const handleDateChange = (date) => {
		setProductDetails({ ...productDetails, manufactureDate: date });
	};

	// updating BankDetails usestate
	const handleProductDetails = (input) => (e) => {
		setProductDetails({ ...productDetails, [input]: e.target.value });
	};

	const HanderdiscountSwitch = (e) => {
		setProductDetails({ ...productDetails, isOnSale: e.target.checked });
	};

	const handleWarranty = (e) => {
		setWarranty(e.target.value);
	};
	const handleWarrantySpan = (e) => {
		setWarrantySpan(e.target.value);
	};

	const handleWeight = (e) => {
		setWeight(e.target.value);
	};
	const handleWeightUnit = (e) => {
		setWeightUnits(e.target.value);
	};

	const handlerDimension = (input) => (e) => {
		setDimensions({ ...dimensions, [input]: e.target.value });
	};

	const handlerDiscount = (input) => (e) => {
		const discount = e.target.value;

		let discountPrice =
			productDetails.salePrice -
			productDetails.salePrice * (discount / 100);

		setProductDetails({
			...productDetails,
			[input]: e.target.value,
			discountPrice,
		});
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
		let prevImages = productDetails.images;
		let files = event.target.files;
		let temp = [];

		for (let i = 0; i < files.length; i++) {
			var fileURL = await uploadImage(files[i]);
			temp.push(fileURL);
		}

		if (prevImages.length > 0) {
			setProductDetails({
				...productDetails,
				images: [...prevImages, ...temp],
			});
		} else {
			setProductDetails({
				...productDetails,
				images: temp,
			});
		}
	};

	const getAllCategory = async () => {
		// Parent Category
		api.get("/seller/product/mainCategories/list", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.mainCategories;
				setProductCategories(categoryList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	const getSubCategory = async () => {
		if (productDetails.category !== "") {
			await api
				.get(
					`/seller/subCategories/category/${productDetails.category}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					let subCategories = res.data.data.subCategories;
					setProductSubCategories(subCategories);
				})
				.catch((error) => console.log("Error: " + error));
		}
	};

	const handlerDeletePImage = (index) => {
		const pImages = productDetails.images.filter(
			(el, eindex) => eindex !== index
		);

		setProductDetails({
			...productDetails,
			images: pImages,
		});
	};

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		descriptionError: "",
		categoryError: "",
		subCategoryError: "",
		purchasePriceError: "",
		salePriceError: "",
		stateError: "",
		shippingCostError: "",
		stockError: "",
		warrantyError: "",
		weightError: "",
		dimensionsErrorL: "",
		dimensionsErrorW: "",
		dimensionsErrorH: "",
		discountPercentageError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// name
		var nameFormat = /^[0-9A-Za-z\s_+()'#@&-]+$/;
		if (productDetails.name.match(nameFormat)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError =
				"Invalid Input. Name cannot contains several Special Characters!";
		}

		// description
		var descFormat = /^[A-Za-z0-9.,'!()#&+-\s]+$/;
		if (productDetails.description.match(descFormat)) {
			errors.descriptionError = "";
		} else {
			hasError = true;
			errors.descriptionError =
				"Description contains several characters that aren't allowed!";
		}

		// Product category
		if (productDetails.category.length === 0) {
			hasError = true;
			errors.categoryError = "Please Choose a Category for Product!";
		} else {
			errors.categoryError = "";
		}

		// subcategory
		if (productDetails.subCategory.length === 0) {
			hasError = true;
			errors.subCategoryError = "Please Choose Sub-Category for Product!";
		} else {
			errors.subCategoryError = "";
		}

		// state
		if (productDetails.state.length === 0) {
			hasError = true;
			errors.stateError = "Please Choose the Product State!";
		} else {
			errors.stateError = "";
		}

		// stock
		var stockFormat = /^[1-9]\d*$/;
		if (productDetails.stockAvailable.match(stockFormat)) {
			errors.stockError = "";
		} else {
			hasError = true;
			errors.stockError = "Entered stock amount is invalid.";
		}

		// Shipping cost
		var shippingFormat = /^[1-9]\d*$/;
		if (productDetails.shippingCost.match(shippingFormat)) {
			errors.shippingCostError = "";
		} else {
			hasError = true;
			errors.shippingCostError = "Entered Shipping Amount is invalid.";
		}

		// price
		var PriceFormat = /^\d+(.\d{1,2})?$/;
		if (productDetails.purchasePrice.match(PriceFormat)) {
			errors.purchasePriceError = "";
		} else {
			hasError = true;
			errors.purchasePriceError = "Entered Amount is invalid.";
		}

		if (productDetails.salePrice.match(PriceFormat)) {
			errors.salePriceError = "";
		} else {
			hasError = true;
			errors.salePriceError = "Entered Amount is invalid.";
		}

		// warranty
		var warrantyFormat = /^\d+(.\d{1,2})?$/;
		if (warranty.match(warrantyFormat)) {
			errors.warrantyError = "";
		} else {
			hasError = true;
			errors.warrantyError = "Entered Warranty is invalid.";
		}

		// weight
		var weightFormat = /^\d+(.\d{1,2})?$/;
		if (weight.match(weightFormat)) {
			errors.weightError = "";
		} else {
			hasError = true;
			errors.weightError = "Entered Weight Amount is invalid.";
		}

		if (productDetails.isOnSale === true) {
			// discountFormat
			var discountFormat = /\b(0*([1-9][0-9]?|100))\b/;
			if (
				productDetails.discountPercentage.match(discountFormat) &&
				productDetails.discountPercentage > 0
			) {
				errors.discountPercentageError = "";
			} else {
				hasError = true;
				errors.discountPercentageError =
					"Entered Discount Amount is invalid.";
			}
		}

		// dimension
		var dimensionFormat = /^\d+(.\d{1,2})?$/;
		if (dimensions.length.match(dimensionFormat)) {
			errors.dimensionsErrorL = "";
		} else {
			hasError = true;
			errors.dimensionsErrorL = "Entered Length is invalid.";
		}
		if (dimensions.width.match(dimensionFormat)) {
			errors.dimensionsErrorW = "";
		} else {
			hasError = true;
			errors.dimensionsErrorW = "Entered Width is invalid.";
		}
		if (dimensions.height.match(dimensionFormat)) {
			errors.dimensionsErrorH = "";
		} else {
			hasError = true;
			errors.dimensionsErrorH = "Entered Height is invalid.";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const resetInputFiels = () => {
		setWeight("");
		setWarranty("");
		setProductDetails({
			name: "",
			description: "",
			category: "",
			subCategory: "",
			manufactureDate: "11/06/2003",
			purchasePrice: "",
			salePrice: "",
			state: "",
			shippingCost: "",
			images: [],
			isOnSale: false,
			discountPercentage: "",
			discountPrice: "",
			stockAvailable: "",
			dimensions: "",
		});
		setDimensions({
			length: "",
			width: "",
			height: "",
			unit: "in",
		});
		setColors([]);
	};

	const addProductHandler = (e) => {
		e.preventDefault();

		var hasError = InputValidation();

		if (hasError === false) {
			let pWarranty = warranty + " " + warrantySpan;
			let pWeight = weight + " " + weightUnits;

			let pDimensions =
				dimensions.length +
				"" +
				dimensions.unit +
				" " +
				dimensions.width +
				"" +
				dimensions.unit +
				" " +
				dimensions.height +
				"" +
				dimensions.unit;

			api.post(
				"/seller/store/product",
				{
					...productDetails,
					colors,
					dimensions: pDimensions,
					warranty: pWarranty,
					weight: pWeight,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then(() => {
					resetInputFiels();
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "Product has been added successfully!",
						open: true,
					});
				})
				.catch((error) =>
					setSnackBar({
						...snackBarstate,
						message:
							"ERROR: " +
							JSON.stringify(
								error.response.data.error.message
							).replace(/"/g, ""),
						type: "error",
						open: true,
					})
				);
		}
	};

	// Retriving List from Categories from API
	useEffect(() => {
		getAllCategory();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getSubCategory();
		// eslint-disable-next-line
	}, [productDetails.category]);

	return (
		<Grid container component={Paper}>
			<Grid item xs={12} sm={12} md={12}>
				<div className={classes.paper}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} lg={8}>
							<Typography variant="h4" gutterBottom>
								Add Product Details
							</Typography>
							<Divider />
							<form className={classes.form}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											margin="dense"
											variant="outlined"
											required
											fullWidth
											label="Name"
											name="name"
											value={productDetails.name}
											helperText={IFerrors.nameError}
											error={
												IFerrors.nameError.length > 0
													? true
													: false
											}
											onChange={handleProductDetails(
												"name"
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
											rows={4}
											label="Description"
											value={productDetails.description}
											onChange={handleProductDetails(
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
										/>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"category"
											)}
											error={
												IFerrors.categoryError.length >
												0
													? true
													: false
											}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Product Category
											</MenuItem>
											{productCategories.map(
												(el, index) => (
													<MenuItem
														value={el}
														key={index}
													>
														{el}
													</MenuItem>
												)
											)}
										</Select>
									</Grid>
									<Grid item xs={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"subCategory"
											)}
											error={
												IFerrors.subCategoryError
													.length > 0
													? true
													: false
											}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose sub-category
											</MenuItem>
											{productSubCategories.map(
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
									</Grid>

									<Grid item xs={12}>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardDatePicker
												required
												fullWidth
												inputVariant="outlined"
												margin="dense"
												disableToolbar
												format="MM/dd/yyyy"
												id="date-picker-inline"
												label="Manufacture Date"
												value={
													productDetails.manufactureDate
												}
												onChange={handleDateChange}
											/>
										</MuiPickersUtilsProvider>
									</Grid>

									<Grid item xs={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											style={{ marginTop: 8 }}
											value={"DEFAULT"}
											defaultValue={"DEFAULT"}
											onChange={handlerColor("colors")}
										>
											<MenuItem value="DEFAULT" disabled>
												Select Product Color
											</MenuItem>
											<MenuItem value="Red">Red</MenuItem>
											<MenuItem value="Green">
												Green
											</MenuItem>
											<MenuItem value="Orange">
												Orange
											</MenuItem>
											<MenuItem value="Black">
												Black
											</MenuItem>
											<MenuItem value="Blue">
												Blue
											</MenuItem>
											<MenuItem value="Yellow">
												Yellow
											</MenuItem>
											<MenuItem value="Grey">
												Grey
											</MenuItem>
											<MenuItem value="Silver">
												Silver
											</MenuItem>
											<MenuItem value="White">
												White
											</MenuItem>
											<MenuItem value="Purple">
												Purple
											</MenuItem>
										</Select>
									</Grid>

									{colors.length > 0 ? (
										<Grid item xs={12}>
											{colors.map((el, index) => (
												<Chip
													icon={
														<Brightness1Icon
															style={{
																color: el,
															}}
														/>
													}
													label={el}
													key={index}
													onDelete={handleDeleteColor(
														index
													)}
													style={{
														margin: "2px 4px",
													}}
												/>
											))}
										</Grid>
									) : (
										""
									)}

									<Grid item xs={12}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Stock / Quantity"
											value={
												productDetails.stockAvailable
											}
											onChange={handleProductDetails(
												"stockAvailable"
											)}
											helperText={IFerrors.stockError}
											error={
												IFerrors.stockError.length > 0
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
											name="warranty"
											label="Warranty"
											value={productDetails.warranty}
											onChange={handleWarranty}
											helperText={IFerrors.warrantyError}
											error={
												IFerrors.warrantyError.length >
												0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item sm={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											name="WarrantySpan"
											style={{ marginTop: 8 }}
											value={warrantySpan}
											onChange={handleWarrantySpan}
										>
											<MenuItem value="year">
												Year
											</MenuItem>
											<MenuItem value="month">
												Month
											</MenuItem>
											<MenuItem value="week">
												Week
											</MenuItem>
											<MenuItem value="day">Day</MenuItem>
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
											label="Purchase Price"
											value={productDetails.price}
											onChange={handleProductDetails(
												"purchasePrice"
											)}
											helperText={
												IFerrors.purchasePriceError
											}
											error={
												IFerrors.purchasePriceError
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
											label="Sale Price (Rs)"
											name="salePrice"
											value={productDetails.price}
											onChange={handleProductDetails(
												"salePrice"
											)}
											helperText={IFerrors.salePriceError}
											error={
												IFerrors.salePriceError.length >
												0
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
											id="weight"
											name="weight"
											label="Weight"
											value={weight}
											onChange={handleWeight}
											helperText={IFerrors.weightError}
											error={
												IFerrors.weightError.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item sm={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Weight Unit"
											name="weightUnits"
											style={{ marginTop: 8 }}
											value={weightUnits}
											onChange={handleWeightUnit}
										>
											<MenuItem value="Kg">
												Kilograms
											</MenuItem>
											<MenuItem value="grams">
												Grams
											</MenuItem>
											<MenuItem value="mg">
												Milligrams
											</MenuItem>
										</Select>
									</Grid>

									<Grid item xs={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											name="state"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"state"
											)}
											error={
												IFerrors.stateError.length > 0
													? true
													: false
											}
										>
											<MenuItem value="DEFAULT">
												Select the Product State
											</MenuItem>
											<MenuItem value="New">New</MenuItem>
											<MenuItem value="Used">
												Used
											</MenuItem>
											<MenuItem value="Refurbished">
												Refurbished
											</MenuItem>
										</Select>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Shipping Cost"
											name="shippingCost"
											value={productDetails.shippingCost}
											onChange={handleProductDetails(
												"shippingCost"
											)}
											helperText={
												IFerrors.shippingCostError
											}
											error={
												IFerrors.shippingCostError
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Length"
											name="dimensions"
											value={dimensions.length}
											onChange={handlerDimension(
												"length"
											)}
											helperText={
												IFerrors.dimensionsErrorL
											}
											error={
												IFerrors.dimensionsErrorL
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Width"
											name="dimensions"
											value={dimensions.width}
											onChange={handlerDimension("width")}
											helperText={
												IFerrors.dimensionsErrorW
											}
											error={
												IFerrors.dimensionsErrorW
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Height"
											name="dimensions"
											value={dimensions.height}
											onChange={handlerDimension(
												"height"
											)}
											helperText={
												IFerrors.dimensionsErrorH
											}
											error={
												IFerrors.dimensionsErrorH
													.length > 0
													? true
													: false
											}
										/>
									</Grid>
									<Grid item xs={3}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											name="weightUnits"
											style={{ marginTop: 8 }}
											value={dimensions.unit}
											onChange={handlerDimension("unit")}
										>
											<MenuItem value="m">Metre</MenuItem>
											<MenuItem value="in">
												Inches
											</MenuItem>
											<MenuItem value="cm">
												Centimetres
											</MenuItem>
										</Select>
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
										{productDetails.images.length > 0 ? (
											productDetails.images.map(
												(img, index) => (
													<Grid
														item
														key={index}
														align="center"
													>
														<img
															src={img}
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
																onClick={() =>
																	handlerDeletePImage(
																		index
																	)
																}
																style={{
																	color: "grey",
																}}
															/>
														</div>
													</Grid>
												)
											)
										) : (
											<Typography>
												Upload Product Images
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
											multiple
											accept="image/png, image/jpeg"
											onChange={fileHandler}
											hidden
										/>
									</div>
								</Grid>

								<Grid container spacing={2}>
									<Grid item xs={4}>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												border: "1px solid #c4c4c4",
												borderRadius: 4,
												marginTop: 8,
											}}
										>
											<FormControlLabel
												margin="normal"
												control={
													<Switch
														color="primary"
														checked={
															productDetails.isOnSale
														}
														onChange={
															HanderdiscountSwitch
														}
													/>
												}
												label="On Sale"
												labelPlacement="start"
											/>
										</div>
									</Grid>

									{productDetails.isOnSale ? (
										<Grid item xs={8}>
											<TextField
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Discount(%)"
												id="discount"
												name="discount"
												value={
													productDetails.discountPercentage
												}
												onChange={handlerDiscount(
													"discountPercentage"
												)}
												helperText={
													IFerrors.discountPercentageError
												}
												error={
													IFerrors
														.discountPercentageError
														.length > 0
														? true
														: false
												}
											/>
										</Grid>
									) : (
										""
									)}
								</Grid>
								<Grid container>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										lg={12}
										align="center"
									>
										<Button
											size="large"
											type="submit"
											variant="contained"
											color="primary"
											className={classes.submit}
											onClick={addProductHandler}
										>
											Add Product
										</Button>
									</Grid>
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
									src={addProduct}
									alt="product"
									style={{
										maxWidth: "300px",
										marginBottom: 20,
									}}
								/>
								<Typography variant="h5">
									DO YOU KNOW?
								</Typography>
								<Typography
									variant="body2"
									style={{ textAlign: "justify" }}
								>
									In order to make more sales, Write an
									eye-catching and short name for Product and
									upload its high-quality images.
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
			</Grid>
		</Grid>
	);
}
