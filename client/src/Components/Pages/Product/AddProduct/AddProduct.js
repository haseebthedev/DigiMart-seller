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
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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
	const [productBrand, setProductBrand] = useState([]);
	const [productDetails, setProductDetails] = useState({
		name: "test",
		description: "test",
		category: "",
		subCategory: "",
		brand: "",
		manufactureDate: "11/06/2003",
		purchasePrice: "1000",
		salePrice: "1000",
		state: "New",
		shippingCost: "20",
		images: [],
		isOnSale: false,
		discountPercentage: 10,
		discountPrice: 0,
		stockAvailable: 0,
		dimensions: "",
	});
	const [colors, setColors] = useState([]);
	const [dimensions, setDimensions] = useState({
		length: 0,
		width: 0,
		height: 0,
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

		var discountPrice =
			productDetails.salePrice -
			productDetails.salePrice * (discount / 100);

		setProductDetails({
			...productDetails,
			[input]: e.target.value,
			discountPrice,
		});

		console.log(productDetails);
	};

	const addProductHandler = (e) => {
		e.preventDefault();

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
			.then((res) => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "Product has been added successfully!",
					open: true,
				});
				console.log(res);
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
	};

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const fileHandler = async (event) => {
		let prevImages = productDetails.images;
		let files = event.target.files;
		let temp = [];

		for (let i = 0; i < files.length; i++) {
			var file64 = await toBase64(files[i]);
			temp.push(file64);
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
		api.get("/seller/product/categories", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.categories;
				setProductCategories(categoryList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	const getSubCategory = async () => {
		if (productDetails.category !== "") {
			await api
				.get(
					`/seller/subCategories/brands/${productDetails.category}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					let categoryList = res.data.data.categories;
					let subCat = categoryList.map((el) => el.subCategory);
					let brands = categoryList.map((el) => el.brands);
					setProductSubCategories(subCat[0]);
					setProductBrand(brands[0]);
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
											label="Category"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"category"
											)}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Product Category
											</MenuItem>
											{productCategories.map(
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
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Sub Category"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"subCategory"
											)}
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
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Brand"
											name="brand"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"brand"
											)}
										>
											<MenuItem value="DEFAULT" disabled>
												Select Brand of Product
											</MenuItem>
											{productBrand.map((el, index) => (
												<MenuItem
													value={el.name}
													key={index}
												>
													{el.name}
												</MenuItem>
											))}
										</Select>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											placeholder="dd/MM/YYYY"
											label="Manufacture Date"
											name="manufactureDate"
											value={
												productDetails.manufactureDate
											}
											onChange={handleProductDetails(
												"manufactureDate"
											)}
										/>
									</Grid>

									<Grid item xs={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Category"
											name="category"
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
											<MenuItem value="Black">
												Black
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
											name="stock"
											label="Stock / Quantity"
											value={
												productDetails.stockAvailable
											}
											onChange={handleProductDetails(
												"stockAvailable"
											)}
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
										/>
									</Grid>
									<Grid item sm={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="WarrantySpan"
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
										/>
									</Grid>

									<Grid item xs={6}>
										<TextField
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Weight"
											id="weight"
											name="weight"
											value={weight}
											onChange={handleWeight}
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
											label="Product State"
											name="state"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleProductDetails(
												"state"
											)}
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
										/>
									</Grid>
									<Grid item xs={3}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Weight Unit"
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
						<Grid item xs={12} sm={12} md={12} lg={4}>
							<div
								style={{
									border: "1px solid rgb(224 224 224)",
									borderRadius: 6,
									padding: 15,
									marginBottom: 10,
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
				{/* </Container> */}
			</Grid>
		</Grid>
	);
}
