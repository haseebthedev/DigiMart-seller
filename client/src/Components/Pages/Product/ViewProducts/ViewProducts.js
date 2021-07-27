import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
	Grid,
	Paper,
	Modal,
	TextField,
	Container,
	Typography,
	Select,
	MenuItem,
	Button,
	LinearProgress,
} from "@material-ui/core";
import CSVReader from "react-csv-reader";

import { useUserContext } from "../../../../context/UserContext";

import DeleteProduct from "../../../FormDialog/DeleteProduct";

import useStyles from "./styles";
import Pal from "../../../../themes/palette";

export default function ViewProducts() {
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

	const [details, setDetails] = useState([]);

	const columns = [
		{ title: "Name", field: "name" },
		{ title: "Description", field: "description" },
		{ title: "Manufacturer", field: "manufacturer" },
		{ title: "Category", field: "category" },
		{ title: "Price", field: "price" },
		{ title: "StockAvailable", field: "stockAvailable" },
		{ title: "DiscountPercentage", field: "discountPercentage" },
		{ title: "Warranty", field: "warranty" },
	];

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

	const handleProductDetails = (input) => (e) => {
		setProductDetails({ ...productDetails, [input]: e.target.value });
	};

	const editProductHandler = (e) => {
		e.preventDefault();

		const {
			name,
			description,
			manufactureDate,
			category,
			price,
			stockAvailable,
			weight,
			discountPercentage,
			manufacturer,
			warranty,
			images,
			colors,
			storeName,
		} = productDetails;

		api.patch(
			`/seller/store/product/${productDetails._id}`,
			{
				name,
				description,
				manufactureDate,
				category,
				price,
				stockAvailable,
				weight,
				discountPercentage,
				manufacturer,
				warranty,
				images,
				colors,
				storeName,
			},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then((res) => {
				try {
					const newDetails = details.map((prod) =>
						prod._id === productDetails._id ? productDetails : prod
					);
					setDetails(newDetails);
					handleClose();
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "SUCCESS: Product has been Updated!",
						open: true,
					});
				} catch (error) {}
			})
			.catch((error) => {
				handleClose();
				setSnackBar({
					...snackBarstate,
					message: "ERROR: Something is not working properly!",
					type: "error",
					open: true,
				});
			});
	};

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const colorsHandler = (input) => (e) => {
		const temp = e.target.value;
		setProductDetails({ ...productDetails, [input]: temp.split(",") });
	};

	const fileHandler = async (event) => {
		const files = event.target.files;
		const temp = [];
		for (let i = 0; i < files.length; i++) {
			let file64 = await toBase64(files[i]);
			temp.push(file64);
		}
		setProductDetails({ ...productDetails, images: temp });
	};

	// Edit Product Modal Settings here
	const [modalOpen, setModelOpen] = useState(false);
	const handleOpen = () => {
		setModelOpen(true);
	};
	const handleClose = () => {
		setModelOpen(false);
	};

	// Import Products Modal
	const [ipmodalOpen, setIpmodalOpen] = useState(false);
	const openIPmodal = () => {
		setIpmodalOpen(true);
	};
	const closeIPmodal = () => {
		setIpmodalOpen(false);
	};

	useEffect(() => {
		// Retriving List of Products from API
		api.get("/seller/store/products", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setDetails(res.data.data.products);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);

		// Retriving List of Categories from API
		api.get("/seller/productCategories", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.categories;
				setProductCategories(categoryList);
			})
			.catch((error) => console.log("Error: " + error));
	}, [token]);

	const [isDeletingProduct, setIsDeletingProduct] = useState(false);

	// show delete Account Dialog
	const handlerAccountDelete = () => {
		setIsDeletingProduct(true);
	};
	// Delete Account Handler
	const confirmedDelete = () => {
		const productId = productDetails._id;

		// api to delete product
		api.delete(`/seller/store/product/${productId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				// Removing deleted Product from details array
				const newDetails = details.filter(
					(prod) => prod._id !== productId
				);
				setDetails(newDetails);
				setIsDeletingProduct(false);
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Product has been deleted!",
					open: true,
				});
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went wrong!",
					open: true,
				});
			});
	};

	// ProgressBar variant
	const [progressCSV, setProgressCSV] = useState("determinate");
	const [progressValue, setProgressValue] = useState(0);

	// parse config
	const papaparseOptions = {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		transformHeader: (header) =>
			header.charAt(0).toLowerCase().concat(header.slice(1)),
	};

	const [IPdata, setIPdata] = useState([]);

	const handleFileLoaded = (data) => {
		setProgressCSV("indeterminate");
		setTimeout(() => {
			setProgressValue(100);
			setProgressCSV("determinate");
		}, 1000);

		const newProducList = data.map((prod) =>
			prod.colors === undefined
				? { ...prod, colors: [], images: [] }
				: prod
		);
		setIPdata(newProducList);
	};

	const handeStartImport = async () => {
		setDetails([...IPdata, ...details]);
	};

	return (
		<Grid container className={classes.root}>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				align="right"
				style={{ marginBottom: 20 }}
			>
				<Button
					variant="contained"
					color="primary"
					align="right"
					onClick={openIPmodal}
				>
					IMPORT PRODUCTS
				</Button>
			</Grid>

			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Products"
					data={details}
					columns={columns}
					actions={[
						(rowData) => ({
							icon: () => <EditIcon />,
							tooltip: "Edit",
							onClick: (event, rowData) => {
								setProductDetails(rowData);
								handleOpen();
							},
						}),
						(rowData) => ({
							icon: () => <DeleteIcon />,
							tooltip: "Delete",
							onClick: (event, rowData) => {
								setProductDetails(rowData);
								handlerAccountDelete();
							},
						}),
					]}
					options={{
						actionsColumnIndex: -1,
						headerStyle: {
							backgroundColor: Pal.palette.primary.main,
							color: "#fff",
						},
						exportButton: true,
					}}
				/>
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

			<DeleteProduct
				DeletingProduct={isDeletingProduct}
				setDeletingProduct={setIsDeletingProduct}
				confirmedDelete={confirmedDelete}
			/>

			{/* =========================================================== */}

			{/* Edit Product */}
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
				<Container
					component={Paper}
					maxWidth="md"
					style={{ padding: 20 }}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} align="center">
							<Typography variant="h5">Edit Product</Typography>
						</Grid>
						<form
							className={classes.form}
							noValidate
							style={{ padding: 20 }}
						>
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
										onChange={handleProductDetails(
											"category"
										)}
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
										onChange={handleProductDetails(
											"category"
										)}
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
										onChange={handleProductDetails(
											"warranty"
										)}
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
										value={
											productDetails.discountPercentage
										}
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
									onClick={editProductHandler}
								>
									Save Changes
								</Button>
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
				</Container>
			</Modal>

			{/* Import Products Modal */}
			<Modal
				open={ipmodalOpen}
				onClose={closeIPmodal}
				onBackdropClick={closeIPmodal}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container
					component={Paper}
					maxWidth="sm"
					style={{ padding: 20 }}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} align="center">
							<Typography variant="h5">
								Import Products using CSV
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={12}
							style={{
								display: "flex",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
							<CSVReader
								onFileLoaded={handleFileLoaded}
								parserOptions={papaparseOptions}
							/>

							<Button
								variant="contained"
								color="primary"
								disabled={progressValue === 0 ? true : false}
								onClick={handeStartImport}
							>
								Start Importing
							</Button>
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="center">
							<LinearProgress
								variant={progressCSV}
								value={progressValue}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							{progressValue === 100 ? (
								<Typography variant="body1">
									Products have been loaded. Click on Start
									Importing Button now!
								</Typography>
							) : (
								<Typography variant="body1"></Typography>
							)}
						</Grid>
					</Grid>
				</Container>
			</Modal>

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
