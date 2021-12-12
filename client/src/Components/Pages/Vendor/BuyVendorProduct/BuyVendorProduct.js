import React, { useState, useEffect } from "react";
import clsx from "clsx";
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
	Modal,
	Checkbox,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Container,
	FormControlLabel,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import BallotIcon from "@material-ui/icons/Ballot";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import AddVendorSvg from "../../../../assets/images/AddVendor.svg";
import ImageNotAvailable from "../../../../assets/images/imgNotAvailable.jpg";
import Pal from "../../../../themes/palette";
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

	// Modal
	const [modalSP, setModelSP] = useState(false);
	const OpenModalSP = () => {
		setModelSP(true);
	};
	const CloseModalSP = () => {
		setModelSP(false);
	};

	const [vendorCategoryList, setVendorCategoryList] = useState([]);
	const [VendorCategory, setVendorCategory] = useState("");
	const [vendorList, setVendorList] = useState([]);
	const [vendorId, setVendorId] = useState("");

	const [SellerProductPrice, setSellerProductPrice] = useState("");
	const [BuyingStock, setBuyingStock] = useState("");

	const HandlerNewPrice = (e) => {
		setSellerProductPrice(e.target.value);
	};

	const HandlerBuyStock = (e) => {
		setBuyingStock(e.target.value);
	};

	// Vendor Products
	const [productList, setProductList] = useState([]);
	const [productId, setproductId] = useState("");
	const [productDetails, setProductDetails] = useState({
		name: "",
		description: "",
		category: "",
		subCategory: "",
		vendorCompanyName: "Other",
		colors: [],
		manufactureDate: "",
		purchasePrice: "",
		salePrice: "",
		state: "",
		shippingCost: "",
		images: [],
		discountPercentage: "",
		discountPrice: "",
		stockAvailable: "",
		dimensions: "",
		isOnSale: false,
		warranty: "",
		weight: "",
	});

	const handleCategory = (e) => {
		setVendorCategory(e.target.value);
	};

	const handleVendorId = (e) => {
		setVendorId(e.target.value);
	};

	const selectProduct = (id) => {
		setproductId(id);
	};

	const getProductDetails = async () => {
		await api
			.get(`/seller/vendor/product/${productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				let product = res.data.data.product;
				setProductDetails({ ...productDetails, ...product });
				CloseModalSP();
			})
			.catch((error) => console.log("Error: " + error));
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

	const getAllVendorUsingCategory = async () => {
		if (VendorCategory !== "") {
			await api
				.get(`/seller/vendors/${VendorCategory}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					let vendors = res.data.data.vendors;
					setVendorList(vendors);
				})
				.catch((error) => console.log("Error: " + error));
		}
	};

	const getAllVendorProducts = async () => {
		if (vendorId !== "") {
			await api
				.get(`/seller/vendor/${vendorId}/products`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setProductList(res.data.data.products))
				.catch((error) => console.log(error));
		}
	};

	const handlerAddProductToStore = async () => {
		const { discountPercentage, salePrice, stockAvailable } =
			productDetails;
		let newProduct = productDetails;

		// let discountPrice =
		// 	SellerProductPrice -
		// 	SellerProductPrice * (discountPercentage / 100);

		const vendorProductId = newProduct["_id"];

		const PropToDelete = [
			"createdAt",
			"discountPrice",
			"purchasePrice",
			"updatedAt",
			"__v",
			// "_id",
			"vendorId",
			"vendorCategory",
			"vendorTypeOfBusiness",
		];

		for (let i = 0; i < PropToDelete.length; i++) {
			delete newProduct[PropToDelete[i]];
		}

		newProduct = {
			...newProduct,
			vendorProductId,
			purchasePrice: salePrice,
			salePrice:
				SellerProductPrice !== "" ? SellerProductPrice : salePrice,
			stockAvailable: BuyingStock,
			storeId: "611a3788a097252998d7ab46",
			discountPrice: null,
		};

		if (BuyingStock <= stockAvailable) {
			await api
				.post(
					"/seller/store/product",
					{ ...newProduct },
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						open: true,
						message: "SUCCESS: " + JSON.stringify(res.data.message),
					});

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						message:
							"ERROR: " +
							JSON.stringify(error.response.data.error.message),
						type: "error",
						open: true,
					});
				});
		} else {
			setSnackBar({
				...snackBarstate,
				message:
					"ERROR: Entered stock is greater than available stock!",
				type: "error",
				open: true,
			});
		}
	};

	useEffect(() => {
		getAllVendorCategory();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getAllVendorUsingCategory();
		// eslint-disable-next-line
	}, [VendorCategory]);

	useEffect(() => {
		getAllVendorProducts();
		// eslint-disable-next-line
	}, [vendorId]);

	function trimProdName(name) {
		let res = "";
		if (name.length > 14) {
			res = name.toString().substring(0, 13) + "...";
		} else {
			res = name;
		}
		return res;
	}

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
											style={{ marginTop: 8 }}
											value={
												VendorCategory
													? VendorCategory
													: "DEFAULT"
											}
											defaultValue={"DEFAULT"}
											onChange={handleCategory}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose Vendor Category
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
									</Grid>

									{/* Select Vendor from List */}
									<Grid item xs={12} sm={12} md={12}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handleVendorId}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Vendor
											</MenuItem>
											{vendorList.map((el, index) => (
												<MenuItem
													value={el._id}
													key={index}
												>
													{el.companyName}
												</MenuItem>
											))}
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
												onClick={OpenModalSP}
											>
												Select Product
											</Button>
										</Grid>
										<Grid item>
											<Typography
												style={{ marginTop: 4 }}
											>
												{productId
													? "Product ID: " + productId
													: ""}
											</Typography>
										</Grid>
									</Grid>
								</div>

								{productId !== "" && modalSP === false ? (
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
													value={
														productDetails.category
													}
												>
													<MenuItem
														value={
															productDetails.category
														}
														disabled
													>
														{
															productDetails.category
														}
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
													value={
														productDetails.subCategory
													}
												>
													<MenuItem
														value={
															productDetails.subCategory
														}
														disabled
													>
														{
															productDetails.subCategory
														}
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
													label="Company Name"
													name="Company Name"
													style={{
														marginTop: 8,
													}}
													value={
														productDetails.vendorCompanyName
													}
												>
													<MenuItem
														value={
															productDetails.vendorCompanyName
														}
														disabled
													>
														{
															productDetails.vendorCompanyName
														}
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

											{productDetails.colors.length >
											0 ? (
												<Grid item xs={12}>
													{productDetails.colors.map(
														(el, index) => (
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
																style={{
																	margin: "2px 4px",
																}}
															/>
														)
													)}
												</Grid>
											) : (
												<Grid item xs={12}>
													<Typography
														style={{
															textAlign: "center",
														}}
													>
														Product Colors are not
														Available
													</Typography>
												</Grid>
											)}

											<Grid item xs={6}>
												<TextField
													disabled
													variant="outlined"
													margin="dense"
													fullWidth
													label="Stock Available"
													value={
														productDetails.stockAvailable
													}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													variant="outlined"
													margin="dense"
													required
													fullWidth
													label="Stock You Want to Buy"
													value={BuyingStock}
													onChange={HandlerBuyStock}
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
													value={
														productDetails.warranty
													}
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
													value={
														productDetails.salePrice
													}
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
													value={SellerProductPrice}
													onChange={HandlerNewPrice}
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
													value={
														productDetails.weight
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
													label="Product State"
													name="state"
													style={{
														marginTop: 8,
													}}
													value={productDetails.state}
												>
													<MenuItem
														value={
															productDetails.state
														}
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
													{productDetails.images
														.length > 0 ? (
														productDetails.images.map(
															(img, index) => (
																<Grid
																	item
																	key={index}
																	align="center"
																>
																	<img
																		src={
																			img
																		}
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
													onClick={
														handlerAddProductToStore
													}
												>
													Add Product in Store
												</Button>
											</Grid>
										</Grid>
									</Grid>
								) : (
									""
								)}

								{/* Product Details */}
							</form>
						</Grid>

						{/* Select Product Modal */}
						<Modal
							open={modalSP}
							onClose={CloseModalSP}
							onBackdropClick={CloseModalSP}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Container component={Paper} maxWidth="md">
								<Grid
									container
									style={{ padding: 20 }}
									spacing={4}
								>
									<Grid item xs={12} sm={12} md={12}>
										<form>
											<Typography variant="h5">
												Select a Product to Buy
											</Typography>
											<Grid
												container
												style={{
													marginTop: 20,
													overflowY: "scroll",
													maxHeight: "410px",
												}}
												spacing={3}
												justify="center"
											>
												{productList.length > 0 ? (
													productList.map((prod) => (
														<Grid
															item
															xs={12}
															sm={3}
															md={3}
															key={prod._id}
														>
															<Card
																style={{
																	position:
																		"relative",
																}}
															>
																<CardMedia
																	className={
																		classes.media
																	}
																	image={
																		prod
																			.images
																			.length >
																		0
																			? prod
																					.images[0]
																			: ImageNotAvailable
																	}
																	title="Product Image"
																/>
																<CardContent
																	style={{
																		padding: 6,
																	}}
																	align="center"
																>
																	<Typography
																		style={{
																			marginTop: 4,
																			color: Pal
																				.palette
																				.primary
																				.main,
																			fontWeight:
																				"bold",
																		}}
																		gutterBottom
																	>
																		{trimProdName(
																			prod.name
																		)}
																	</Typography>
																	<Typography
																		variant="caption"
																		style={{
																			color: "rgb(74 74 74)",
																			background:
																				"rgb(205 205 205 / 49%)",
																			padding:
																				"2px 6px",
																			borderRadius: 4,
																		}}
																	>
																		{
																			prod.category
																		}
																	</Typography>
																	<Typography
																		style={{
																			marginTop: 8,
																			fontSize: 12,
																		}}
																	>
																		Stock:{" "}
																		{
																			prod.stockAvailable
																		}
																	</Typography>
																</CardContent>

																<CardActions
																	style={{
																		justifyContent:
																			"center",
																	}}
																>
																	<Typography
																		style={{
																			marginTop: 4,
																			color: Pal
																				.palette
																				.primary
																				.main,
																			fontWeight:
																				"bold",
																			border:
																				`1px solid ` +
																				Pal,
																		}}
																		align="center"
																	>
																		Rs.{" "}
																		{
																			prod.salePrice
																		}
																	</Typography>
																	<Button
																		size="small"
																		color="primary"
																		variant="outlined"
																		onClick={() =>
																			selectProduct(
																				prod._id
																			)
																		}
																	>
																		SELECT
																	</Button>
																	<div
																		style={{
																			position:
																				"absolute",
																			top: 0,
																			right: 0,
																		}}
																	>
																		<Checkbox
																			className={
																				classes.root
																			}
																			checkedIcon={
																				<span
																					className={clsx(
																						classes.icon,
																						classes.checkedIcon
																					)}
																				/>
																			}
																			icon={
																				<span
																					className={
																						classes.icon
																					}
																				/>
																			}
																			checked={
																				prod._id ===
																				productId
																			}
																			onClick={() =>
																				selectProduct(
																					prod._id
																				)
																			}
																		/>
																	</div>
																</CardActions>
															</Card>
														</Grid>
													))
												) : (
													<Grid item xs={12}>
														<Typography>
															There are No
															Products uploaded
															yet!
														</Typography>
													</Grid>
												)}
											</Grid>
										</form>
									</Grid>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										align="right"
									>
										<Button
											variant="outlined"
											color="primary"
											style={{ marginRight: 10 }}
											onClick={CloseModalSP}
										>
											Cancel
										</Button>
										<Button
											variant="contained"
											color="primary"
											style={{ marginRight: 10 }}
											onClick={getProductDetails}
										>
											SUBMIT
										</Button>
									</Grid>
								</Grid>
							</Container>
						</Modal>

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

			{/* Alertbar */}
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
