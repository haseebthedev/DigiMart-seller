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
	Switch,
	Chip,
	FormControlLabel,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import BallotIcon from "@material-ui/icons/Ballot";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import AddVendorSvg from "../../../../assets/images/AddVendor.svg";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";

export default function BuyVendorProduct() {
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

	const [productDetails] = useState({
		name: "test",
		description: "test",
		category: "Electronics",
		subCategory: "Fashion",
		brand: "Apple",
		colors: ["Red", "Green"],
		manufactureDate: "11/06/2003",
		salePrice: "200",
		weight: "200 grams",
		warranty: "2 YEARS",
		state: "New",
		shippingCost: "70",
		images: [],
		isOnSale: true,
		discountPercentage: "",
		discountPrice: "0",
		stockAvailable: "238",
		dimensions: "25in 56in 19in",
	});

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
								Buy Product of Vendor
							</Typography>
							<Divider />
							<form className={classes.form}>
								<Grid container spacing={2}>
									{/* Vendor Category */}
									<Grid item xs={12} sm={12} md={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Vendor Category"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose Vendor Category
											</MenuItem>
										</Select>
									</Grid>

									{/* Select Vendor from List */}
									<Grid item xs={12} sm={12} md={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Vendor"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Vendor
											</MenuItem>
											{console.log(vendorCategoryList)}
											{vendorCategoryList.map(
												(el, index) => (
													<MenuItem
														value={el.name}
														key={index}
													>
														Choose a Vendor
													</MenuItem>
												)
											)}
										</Select>
									</Grid>
								</Grid>

								{/* Select Vendor Product */}
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
											<Button
												startIcon={<BallotIcon />}
												size="small"
												variant="outlined"
												color="primary"
											>
												Select Product
											</Button>
										</Grid>
										<Grid item>
											<Typography
												style={{ marginTop: 4 }}
											>
												Product ID: 93423849238523
											</Typography>
										</Grid>
									</Grid>
								</div>

								{/* Product Details */}
								<Grid container>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										align="center"
										style={{
											marginTop: 5,
											marginBottom: 10,
										}}
									>
										<Typography variant="h5">
											Product Details
										</Typography>
									</Grid>

									<Grid container spacing={2}>
										<Grid item xs={12}>
											<TextField
												disabled
												margin="dense"
												variant="outlined"
												required
												fullWidth
												label="Name"
												value={productDetails.name}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												multiline
												rows={4}
												label="Description"
												value={
													productDetails.description
												}
											/>
										</Grid>
										<Grid item xs={6}>
											<Select
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Category"
												style={{
													marginTop: 8,
												}}
												defaultValue={
													productDetails.category
												}
											>
												<MenuItem
													value={
														productDetails.category
													}
													disabled
												>
													{productDetails.category}
												</MenuItem>
											</Select>
										</Grid>
										<Grid item xs={6}>
											<Select
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Sub Category"
												style={{
													marginTop: 8,
												}}
												defaultValue={
													productDetails.subCategory
												}
											>
												<MenuItem
													value={
														productDetails.subCategory
													}
													disabled
												>
													{productDetails.subCategory}
												</MenuItem>
											</Select>
										</Grid>
										<Grid item xs={12}>
											<Select
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Brand"
												name="brand"
												style={{
													marginTop: 8,
												}}
												defaultValue={
													productDetails.brand
												}
											>
												<MenuItem
													value={productDetails.brand}
													disabled
												>
													{productDetails.brand}
												</MenuItem>
											</Select>
										</Grid>
										<Grid item xs={12}>
											<TextField
												disabled
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
											/>
										</Grid>

										<Grid item xs={12}>
											<Select
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Category"
												name="category"
												style={{
													marginTop: 8,
												}}
												defaultValue={"DEFAULT"}
											>
												<MenuItem
													value="DEFAULT"
													disabled
												>
													Product Colors
												</MenuItem>
											</Select>
										</Grid>

										{productDetails.colors.length > 0 ? (
											<Grid item xs={12}>
												{productDetails.colors.map(
													(el, index) => (
														<Chip
															disabled
															icon={
																<Brightness1Icon
																	style={{
																		color: el,
																	}}
																/>
															}
															label={el}
															key={index}
															style={{
																margin: "2px 4px",
															}}
														/>
													)
												)}
											</Grid>
										) : (
											<Typography variant="error">
												Product Colors are not Available
											</Typography>
										)}

										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												name="stock"
												label="Stock / Quantity"
												value={
													productDetails.stockAvailable
												}
											/>
										</Grid>

										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												name="warranty"
												label="Warranty"
												value={productDetails.warranty}
											/>
										</Grid>

										<Grid item xs={6}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Vendor Price (Rs)"
												name="salePrice"
												value={productDetails.salePrice}
											/>
										</Grid>

										<Grid item xs={6}>
											<TextField
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Your Selling Price (Rs)"
												name="newSellerPrice"
												value={productDetails.salePrice}
											/>
										</Grid>

										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Weight"
												id="weight"
												name="weight"
												value={productDetails.weight}
											/>
										</Grid>

										<Grid item xs={12}>
											<Select
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Product State"
												name="state"
												style={{
													marginTop: 8,
												}}
												defaultValue={
													productDetails.state
												}
											>
												<MenuItem
													value={productDetails.state}
												>
													Product State:{" "}
													{productDetails.state}
												</MenuItem>
											</Select>
										</Grid>
										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Shipping Cost"
												name="shippingCost"
												value={
													productDetails.shippingCost
												}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												disabled
												variant="outlined"
												margin="dense"
												required
												fullWidth
												label="Dimensions"
												placeholder="100in 100in 100in"
												value={
													productDetails.dimensions
												}
											/>
										</Grid>

										<Grid
											item
											xs={12}
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												marginLeft: 10,
												marginRight: 10,
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
												{productDetails.images.length >
												0 ? (
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
																		padding:
																			"2px",
																	}}
																/>
															</Grid>
														)
													)
												) : (
													<Typography>
														No Product Images!
													</Typography>
												)}
											</Grid>
										</Grid>

										<Grid
											container
											spacing={2}
											style={{
												marginLeft: 5,
												marginRight: 5,
											}}
										>
											<Grid item xs={4}>
												<div
													style={{
														display: "flex",
														justifyContent:
															"center",
														border: "1px solid #c4c4c4",
														borderRadius: 4,
														marginTop: 8,
													}}
												>
													<FormControlLabel
														margin="normal"
														control={
															<Switch
																disabled
																color="primary"
																checked={
																	productDetails.isOnSale
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
														disabled
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
													/>
												</Grid>
											) : (
												""
											)}
										</Grid>
									</Grid>

									<Grid
										container
										style={{ margin: "10px 0px" }}
									>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={12}
										>
											<Button
												fullWidth
												size="large"
												variant="contained"
												color="primary"
												className={classes.submit}
											>
												Add Product in Store
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</form>
						</Grid>

						{/* Illustration */}
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
