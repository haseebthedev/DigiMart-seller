import React, { useState, useEffect } from "react";
import {
	Button,
	TextField,
	Grid,
	Typography,
	Paper,
	Select,
	MenuItem,
	FormGroup,
	Checkbox,
	FormControlLabel,
	Switch,
	Chip,
	Divider,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
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
		hasSizes: false,
		sizeAndStock: [],
	});
	const [colors, setColors] = useState([]);
	const [sizeAndStock, setSizeAndStock] = useState({
		size: "",
		stock: 0,
	});
	const [dimensions, setDimensions] = useState({});
	const [warranty, setWarranty] = useState("");
	const [warrantySpan, setWarrantySpan] = useState("");
	const [weight, setWeight] = useState("");
	const [weightUnits, setWeightUnits] = useState("");

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
		if (input === "subCategory") {
			console.log(e.target.value);
		}
		setProductDetails({ ...productDetails, [input]: e.target.value });
	};

	const HanderdiscountSwitch = (e) => {
		setProductDetails({ ...productDetails, isOnSale: e.target.checked });
	};

	const HanderSizesChecked = (e) => {
		setProductDetails({ ...productDetails, hasSizes: e.target.checked });
	};

	const handlerSize = (input) => (e) => {
		setSizeAndStock({ ...sizeAndStock, [input]: e.target.value });
	};

	const HandlerAddStockAndSize = () => {
		setProductDetails({
			...productDetails,
			sizeAndStock: [...productDetails.sizeAndStock, sizeAndStock],
		});
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
		setDimensions({ ...dimensions, input: e.target.value });
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

	const handleDeleteSizeStock = (chipToDelete) => () => {
		console.log(chipToDelete);
		const filteredData = productDetails.sizeAndStock.filter(
			(el) =>
				el.stock !== chipToDelete.stock && el.size !== chipToDelete.size
		);

		setProductDetails({
			...productDetails,
			sizeAndStock: filteredData,
		});
		console.log(productDetails.sizeAndStock);
	};

	const addProductHandler = (e) => {
		e.preventDefault();

		console.log("productDetails ", productDetails);
		console.log("colors ", colors);

		api.post(
			"/seller/store/product",
			{
				...productDetails,
				colors,
				dimensions,
				warranty: warranty + " " + warrantySpan,
				weight: weight + " " + weightUnits,
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
		const files = event.target.files;
		const temp = [];
		for (let i = 0; i < files.length; i++) {
			let file64 = await toBase64(files[i]);
			temp.push(file64);
		}
		setProductDetails({ ...productDetails, images: temp });
	};

	const getAllCategory = async () => {
		// Parent Category
		api.get("/seller/product/categories", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.categories;

				// Removing all repeating categories
				// let uniqueCategories = [
				// 	...new Map(
				// 		categoryList.map((item) => [
				// 			item["parentCategoryName"],
				// 			item,
				// 		])
				// 	).values(),
				// ];
				// setProductCategories(uniqueCategories);
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
										<FormGroup row>
											<FormControlLabel
												control={
													<Checkbox
														color="primary"
														checked={
															productDetails.hasSizes
														}
														onChange={
															HanderSizesChecked
														}
													/>
												}
												label="Add Diferent Sizes of Product"
											/>
										</FormGroup>
									</Grid>

									{productDetails.hasSizes ? (
										<>
											<Grid item xs={4}>
												<Select
													variant="outlined"
													margin="dense"
													required
													fullWidth
													label="Category"
													name="category"
													style={{ marginTop: 8 }}
													defaultValue={"DEFAULT"}
													onChange={handlerSize(
														"size"
													)}
												>
													<MenuItem
														value="DEFAULT"
														disabled
													>
														Select Product Size
													</MenuItem>
													<MenuItem value="S">
														Small (S)
													</MenuItem>
													<MenuItem value="M">
														Medium (M)
													</MenuItem>
													<MenuItem value="L">
														Large (L)
													</MenuItem>
													<MenuItem value="XL">
														Extra Large (XL)
													</MenuItem>
													<MenuItem value="XXL">
														Extra Extra Large (XXL)
													</MenuItem>
												</Select>
											</Grid>

											<Grid item xs={4}>
												<TextField
													variant="outlined"
													margin="dense"
													required
													fullWidth
													name="stock"
													label="Stock / Quantity"
													value={sizeAndStock.stock}
													onChange={handlerSize(
														"stock"
													)}
												/>
											</Grid>

											<Grid item xs={4}>
												<Button
													variant="outlined"
													color="primary"
													fullWidth
													style={{ marginTop: 9 }}
													onClick={
														HandlerAddStockAndSize
													}
												>
													Add
												</Button>
											</Grid>

											{productDetails.sizeAndStock
												.length > 0 ? (
												<Grid item xs={12}>
													{productDetails.sizeAndStock.map(
														(el, index) => (
															<Chip
																label={
																	el.size +
																	" (" +
																	el.stock +
																	")"
																}
																key={index}
																onDelete={handleDeleteSizeStock(
																	el
																)}
																style={{
																	margin: "2px 4px",
																}}
															/>
														)
													)}
												</Grid>
											) : (
												""
											)}
										</>
									) : (
										<Grid item xs={12}>
											<TextField
												variant="outlined"
												margin="dense"
												required
												fullWidth
												name="stock"
												label="Stock / Quantity"
												value={sizeAndStock.stock}
												onChange={handlerSize("stock")}
											/>
										</Grid>
									)}

									<Grid item xs={9}>
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
									<Grid item sm={3}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="WarrantySpan"
											name="WarrantySpan"
											style={{ marginTop: 8 }}
											defaultValue={"year"}
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

									<Grid item xs={9}>
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
									<Grid item sm={3}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Weight Unit"
											name="weightUnits"
											style={{ marginTop: 8 }}
											defaultValue={"KG"}
											onChange={handleWeightUnit}
										>
											<MenuItem value="KG">
												Kilograms
											</MenuItem>
											<MenuItem value="G">Grams</MenuItem>
											<MenuItem value="MG">
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
									<Grid item xs={4}>
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
									<Grid item xs={4}>
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
									<Grid item xs={4}>
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
								</Grid>
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
										spacing={2}
										justify="center"
										style={{ margin: "10px 0" }}
									>
										<Grid item>
											<div>
												<label htmlFor="contained-button-file">
													<Button
														size="small"
														variant="outlined"
														color="primary"
														component="span"
													>
														Select Images
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
									</Grid>
									<Grid container justify="center">
										<div
											style={{
												display: "flex",
											}}
										>
											{productDetails.images.length >
											0 ? (
												productDetails.images.map(
													(img, index) => (
														<Grid item key={index}>
															<img
																src={img}
																alt="product-images"
																height="60px"
																style={{
																	border: "1px solid black",
																	marginRight:
																		"20px",
																}}
															/>
														</Grid>
													)
												)
											) : (
												<Typography>
													Upload Product Images
												</Typography>
											)}
										</div>
									</Grid>
								</div>
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
							<Typography>Right Side</Typography>
						</Grid>
					</Grid>
				</div>
				{/* </Container> */}
			</Grid>
		</Grid>
	);
}
