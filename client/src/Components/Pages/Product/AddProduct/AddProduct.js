import React, { useState, useEffect } from "react";
import {
	Button,
	TextField,
	Grid,
	Typography,
	Avatar,
	Paper,
	Select,
	MenuItem,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import useStyles from "./styles";
import { useUserContext } from "../../../../context/UserContext";

export default function AddProduct() {
	const classes = useStyles();

	// context
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

	const [productDetails, setProductDetails] = useState({
		name: "Feeder",
		description: "Amazing Product",
		manufactureDate: "11/06/2003",
		category: "Electronics",
		price: "1000",
		stockAvailable: 10,
		weight: 20,
		discountPercentage: 10,
		manufacturer: "Oppo china",
		warranty: "19 days",
		images: [],
		colors: [],
	});

	// updating BankDetails usestate
	const handleProductDetails = (input) => (e) => {
		setProductDetails({ ...productDetails, [input]: e.target.value });
	};

	const addProductHandler = (e) => {
		e.preventDefault();

		api.post(
			"/seller/store/product",
			{
				...productDetails,
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

	const colorsHandler = (input) => (e) => {
		const temp = e.target.value;
		setProductDetails({ ...productDetails, [input]: temp.split(",") });
	};

	// Retriving List from Categories from API
	useEffect(() => {
		api.get("/seller/productCategories", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.categories;
				setProductCategories(categoryList);
			})
			.catch((error) => console.log("Error: " + error));
	}, [token]);

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LibraryAddIcon />
					</Avatar>
					<Typography variant="h5">Add Product</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} md={6} lg={6}>
								<TextField
									autoFocus
									margin="dense"
									variant="outlined"
									autoComplete="pName"
									required
									fullWidth
									label="Name"
									name="name"
									value={productDetails.name}
									onChange={handleProductDetails("name")}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={6}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									label="Brand"
									id="brandName"
									name="manufacturer"
									value={productDetails.manufacturer}
									onChange={handleProductDetails(
										"manufacturer"
									)}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12} md={12} lg={12}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									multiline
									rows={4}
									label="Description"
									name="description"
									value={productDetails.description}
									onChange={handleProductDetails(
										"description"
									)}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<Select
									variant="outlined"
									margin="dense"
									required
									fullWidth
									label="Category"
									name="category"
									style={{ marginTop: 8 }}
									defaultValue={"DEFAULT"}
									onChange={handleProductDetails("category")}
								>
									<MenuItem value="DEFAULT" disabled>
										Choose a Product Category
									</MenuItem>
									{productCategories.map((el, index) => (
										<MenuItem
											value={el.parentCategoryName}
											key={index}
										>
											{el.parentCategoryName}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<Select
									variant="outlined"
									margin="dense"
									required
									fullWidth
									label="Category"
									name="category"
									style={{ marginTop: 8 }}
									defaultValue={"DEFAULT"}
									onChange={handleProductDetails("category")}
								>
									<MenuItem value="DEFAULT" disabled>
										Choose sub-category
									</MenuItem>
									{productCategories.map((el, index) => (
										<MenuItem
											value={el.parentCategoryName}
											key={index}
										>
											{el.parentCategoryName}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									placeholder="dd/MM/YYYY"
									label="Manufacture Date"
									name="manufactureDate"
									value={productDetails.manufactureDate}
									onChange={handleProductDetails(
										"manufactureDate"
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									placeholder="Blue, Red etc."
									label="Colors"
									name="colors"
									value={productDetails.colors}
									onChange={colorsHandler("colors")}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									label="Price (Rs)"
									name="price"
									value={productDetails.price}
									onChange={handleProductDetails("price")}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									name="stock"
									label="Stock / Quantity"
									value={productDetails.stockAvailable}
									onChange={handleProductDetails(
										"stockAvailable"
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									name="warranty"
									label="Warranty"
									value={productDetails.warranty}
									onChange={handleProductDetails("warranty")}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={6} lg={3}>
								<TextField
									variant="outlined"
									margin="dense"
									required
									fullWidth
									label="Discount(%)"
									id="discount"
									name="discount"
									value={productDetails.discountPercentage}
									onChange={handleProductDetails(
										"discountPercentage"
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
								spacing={4}
								justify="center"
								style={{ margin: "10px 0" }}
							>
								<Grid item>
									<input
										type="file"
										multiple
										accept="image/png, image/jpeg"
										onChange={fileHandler}
									/>
								</Grid>
							</Grid>
							<Grid container justify="center">
								<div
									style={{
										display: "flex",
									}}
								>
									{productDetails.images.length > 0 ? (
										productDetails.images.map(
											(img, index) => (
												<Grid item key={index}>
													<img
														src={img}
														alt="product-images"
														height="100px"
														style={{
															border: "1px solid black",
															marginRight: "20px",
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
						<Button
							size="large"
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={addProductHandler}
						>
							Add Product
						</Button>
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
				</div>
			</Grid>
		</Grid>
	);
}
