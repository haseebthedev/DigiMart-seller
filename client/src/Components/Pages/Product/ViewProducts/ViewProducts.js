import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

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
	Chip,
	FormControlLabel,
	Switch,
} from "@material-ui/core";

import CSVReader from "react-csv-reader";
import { useUserContext } from "../../../../context/UserContext";

import Pal from "../../../../themes/palette";
import useStyles from "./styles";
import DeleteProduct from "../../../FormDialog/DeleteProduct";
import DeleteAllProducts from "../../../FormDialog/DeleteAllProducts";
import ImgNotAvailable from "../../../../assets/images/imgNotAvailable.jpg";

export default function ViewProducts() {
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

	const [details, setDetails] = useState([]);

	const columns = [
		{
			title: "ID",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
			hidden: false,
			export: false,
		},
		{
			title: "Image",
			field: "images",
			render: ({ images }) => (
				<img
					src={images.length > 0 ? images[0] : ImgNotAvailable}
					alt="ProductImage"
					style={{ width: 40, height: 40, borderRadius: "50%" }}
				/>
			),
			hidden: false,
			export: false,
		},
		{ title: "Name", field: "name", hidden: false, export: true },
		{
			title: "description",
			field: "description",
			hidden: true,
			export: true,
		},
		{ title: "Brand", field: "brand", hidden: false, export: true },
		{ title: "Category", field: "category", hidden: false, export: true },
		{
			title: "purchasePrice",
			field: "purchasePrice",
			hidden: true,
			export: true,
		},
		{
			title: "SalePrice",
			field: "salePrice",
			render: ({ salePrice }) => <div>{"$" + salePrice}</div>,
			hidden: false,
			export: true,
		},
		{
			title: "State",
			field: "state",
			hidden: true,
			export: true,
		},
		{
			title: "StockAvailable",
			field: "stockAvailable",
			hidden: false,
			export: true,
		},
		{
			title: "discountPercentage",
			field: "discountPercentage",
			hidden: true,
			export: true,
		},
		{ title: "Warranty", field: "warranty", hidden: true, export: true },
		{
			title: "Colors",
			field: "colors",
			render: ({ colors }) => <div>{colors[0]}</div>,
			hidden: true,
			export: false,
		},
		{
			title: "isVisibilityEnabled",
			field: "isVisibilityEnabled",
			render: ({ isVisibilityEnabled }) => (
				<div>{isVisibilityEnabled}</div>
			),
			hidden: true,
			export: true,
		},
		{
			title: "manufactureDate",
			field: "manufactureDate",
			hidden: true,
			export: true,
		},
		{
			title: "shippingCost",
			field: "shippingCost",
			hidden: true,
			export: true,
		},
		{
			title: "dimensions",
			field: "dimensions",
			hidden: true,
			export: true,
		},
		{
			title: "weight",
			field: "weight",
			hidden: true,
			export: true,
		},
		{
			title: "Owner",
			field: "vendorCompanyName",
			render: ({ vendorCompanyName }) => (
				<div>{vendorCompanyName ? vendorCompanyName : "SELF"}</div>
			),
			hidden: false,
			export: false,
		},
	];

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
		discountPercentage: "",
		discountPrice: "",
		stockAvailable: "",
		dimensions: "",
		isOnSale: false,
		warranty: "",
		weight: "",
	});
	const [colors, setColors] = useState([]);

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		descriptionError: "",
		categoryError: "",
		subCategoryError: "",
		brandError: "",
		purchasePriceError: "",
		salePriceError: "",
		stateError: "",
		shippingCostError: "",
		stockError: "",
		warrantyError: "",
		weightError: "",
		dimensionsError: "",
		discountPercentageError: "",
	});

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

	const handlerDeletePImage = (index) => {
		const pImages = productDetails.images.filter(
			(el, eindex) => eindex !== index
		);

		setProductDetails({
			...productDetails,
			images: pImages,
		});
	};

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

		// brand
		if (productDetails.brand.length === 0) {
			hasError = true;
			errors.brandError = "Please Choose the Product brand!";
		} else {
			errors.brandError = "";
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
		if (productDetails.stockAvailable.toString().match(stockFormat)) {
			errors.stockError = "";
		} else {
			hasError = true;
			errors.stockError = "Entered stock amount is invalid.";
		}

		// Shipping cost
		var shippingFormat = /^[1-9]\d*$/;
		if (productDetails.shippingCost.toString().match(shippingFormat)) {
			errors.shippingCostError = "";
		} else {
			hasError = true;
			errors.shippingCostError = "Entered Shipping Amount is invalid.";
		}

		// price
		var PriceFormat = /^\d+(.\d{1,2})?$/;
		if (productDetails.purchasePrice.toString().match(PriceFormat)) {
			errors.purchasePriceError = "";
		} else {
			hasError = true;
			errors.purchasePriceError = "Entered Amount is invalid.";
		}

		if (productDetails.salePrice.toString().match(PriceFormat)) {
			errors.salePriceError = "";
		} else {
			hasError = true;
			errors.salePriceError = "Entered Amount is invalid.";
		}

		// warranty
		var warrantyFormat =
			/[0-9]+\s[\bday\b|\bdays\b|\byear\b|\byears\b|\bmonth\b|\bmonths\b|\bweek\b|\bweeks\b]+/;
		if (productDetails.warranty.match(warrantyFormat)) {
			errors.warrantyError = "";
		} else {
			hasError = true;
			errors.warrantyError = "Entered Warranty is invalid.";
		}

		// weight
		var weightFormat =
			/[0-9]+\s[\bgram\b|\bgrams\b|\bkilogram\b|\bkilograms\b|\bmiligram\b|\bmiligrams\b]+/;
		if (productDetails.weight.match(weightFormat)) {
			errors.weightError = "";
		} else {
			hasError = true;
			errors.weightError = "Entered Weight Amount is invalid.";
		}

		if (productDetails.isOnSale === true) {
			// discountFormat
			var discountFormat = /\b(0*([1-9][0-9]?|100))\b/;
			if (
				productDetails.discountPercentage
					.toString()
					.match(discountFormat)
			) {
				errors.discountError = "";
			} else {
				hasError = true;
				errors.discountError = "Entered Discount Amount is invalid.";
			}
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const editProductHandler = (e) => {
		e.preventDefault();

		var hasError = InputValidation();

		if (hasError === false) {
			api.patch(
				`/seller/store/product/${productDetails._id}`,
				{
					...productDetails,
					colors,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => {
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
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch(() => {
					handleClose();
					setSnackBar({
						...snackBarstate,
						message: "ERROR: Something is not working properly!",
						type: "error",
						open: true,
					});
				});
		}
	};

	// Edit Product Modal
	const [modalOpen, setModelOpen] = useState(false);
	const handleOpen = () => {
		setModelOpen(true);
	};
	const handleClose = () => {
		setModelOpen(false);
	};
	// View Product Modal
	const [VPmodalOpen, setVPModelOpen] = useState(false);
	const handleVPOpen = () => {
		setVPModelOpen(true);
	};
	const handleVPClose = () => {
		setVPModelOpen(false);
	};

	// Import Products List
	const [IPdata, setIPdata] = useState([]);

	// Import Products Modal
	const [ipmodalOpen, setIpmodalOpen] = useState(false);
	const openIPmodal = () => {
		setIpmodalOpen(true);
	};
	const closeIPmodal = () => {
		setIpmodalOpen(false);

		// reseting all form values
		setProgressCSV("determinate");
		setProgressCSV(0);
		setSelectedFile("");
		setIPdata([]);
	};

	// Delete Product Dialog
	const [isDeletingProduct, setIsDeletingProduct] = useState(false);
	// Delete All Products Modal
	const [isDelAllProducts, setDelAllProdmodalOpen] = useState(false);

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

	// show delete Account Dialog
	const handlerAllProductsDelete = () => {
		setDelAllProdmodalOpen(true);
	};
	// Delete Account Handler
	const confirmedDeleteProducts = () => {
		api.delete(`/seller/store/products`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(() => {
				setDetails([]);
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: All of your Products have been deleted!",
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
	const [selectedFile, setSelectedFile] = useState();

	const handleFileLoaded = (data, fileInfo) => {
		setSelectedFile(fileInfo.name);
		setProgressCSV("indeterminate");

		setTimeout(() => {
			setProgressValue(100);
			setProgressCSV("determinate");
		}, 1000);

		setIPdata(data);
	};

	const handeStartImport = async () => {
		try {
			var hasError = false;
			for (let i = 0; i < IPdata.length; i++) {
				await api
					.post("/seller/store/product", IPdata[i], {
						headers: { Authorization: `Bearer ${token}` },
					})
					// eslint-disable-next-line
					.catch(() => {
						hasError = true;
						setSnackBar({
							...snackBarstate,
							type: "error",
							message: "Datafile contains wrong format!",
							open: true,
						});
					});
			}
			if (hasError === false) {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "Products have been added successfully!",
					open: true,
				});
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		} catch (error) {
			setSnackBar({
				...snackBarstate,
				type: "error",
				message: "ERROR: System is not responsind at the moment!",
				open: true,
			});
		}
	};

	// parse config
	const papaparseOptions = {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		transformHeader: (header) =>
			header.charAt(0).toLowerCase().concat(header.slice(1)),
	};

	const retrivingAllProducts = async () => {
		await api
			.get("/seller/store/products", {
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
	};

	// Get Categories and Sub Categories from API
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

	useEffect(() => {
		// Retriving List of Products from API
		retrivingAllProducts();

		// Retriving List of Categories from API
		getAllCategory();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getSubCategory();
		// eslint-disable-next-line
	}, [productDetails.category]);

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
					onClick={handlerAllProductsDelete}
					style={{ marginRight: 20 }}
				>
					DELETE ALL PRODUCTS
				</Button>
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
							icon: () => <VisibilityIcon />,
							tooltip: "View",
							onClick: (event, rowData) => {
								setProductDetails(rowData);
								setColors(rowData.colors);
								handleVPOpen();
							},
						}),
						(rowData) => ({
							icon: () => <EditIcon />,
							tooltip: "Edit",
							onClick: (event, rowData) => {
								setProductDetails(rowData);
								setColors(rowData.colors);
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
							fontWeight: "bold",
						},
						exportButton: true,
					}}
					localization={{
						pagination: {
							labelRowsSelect: "Rows per page",
						},
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
					style={{
						padding: "20px",
						maxWidth: "50vw",
						maxHeight: "80vh",
						overflow: "auto",
						scrollbarWidth: "2px",
					}}
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
								<Grid item xs={12}>
									<TextField
										margin="dense"
										variant="outlined"
										required
										fullWidth
										label="Name"
										value={productDetails.name}
										onChange={handleProductDetails("name")}
										helperText={IFerrors.nameError}
										error={
											IFerrors.nameError.length > 0
												? true
												: false
										}
									/>
								</Grid>
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
										helperText={IFerrors.descriptionError}
										error={
											IFerrors.descriptionError.length > 0
												? true
												: false
										}
									/>
								</Grid>
								<Grid item xs={6}>
									<Select
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Category"
										style={{ marginTop: 8 }}
										value={productDetails.category}
										defaultValue={"DEFAULT"}
										onChange={handleProductDetails(
											"category"
										)}
										error={
											IFerrors.categoryError.length > 0
												? true
												: false
										}
									>
										<MenuItem value="DEFAULT" disabled>
											Choose a Product Category
										</MenuItem>
										{productCategories.map((el, index) => (
											<MenuItem
												value={el.name}
												key={index}
											>
												{el.name}
											</MenuItem>
										))}
									</Select>
								</Grid>
								<Grid item xs={6}>
									<Select
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Sub Category"
										style={{ marginTop: 8 }}
										defaultValue={"DEFAULT"}
										value={productDetails.subCategory}
										onChange={handleProductDetails(
											"subCategory"
										)}
										error={
											IFerrors.subCategoryError.length > 0
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
									<Select
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Brand"
										name="brand"
										style={{ marginTop: 8 }}
										value={productDetails.brand}
										defaultValue="DEFAULT"
										onChange={handleProductDetails("brand")}
										error={
											IFerrors.brandError.length > 0
												? true
												: false
										}
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
										value={productDetails.manufactureDate}
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
										<MenuItem value="Green">Green</MenuItem>
										<MenuItem value="Black">Black</MenuItem>
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
										value={productDetails.stockAvailable}
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

								<Grid item xs={12}>
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
										helperText={IFerrors.warrantyError}
										error={
											IFerrors.warrantyError.length > 0
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
										label="Purchase Price"
										value={productDetails.purchasePrice}
										onChange={handleProductDetails(
											"purchasePrice"
										)}
										helperText={IFerrors.purchasePriceError}
										error={
											IFerrors.purchasePriceError.length >
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
										label="Sale Price (Rs)"
										name="salePrice"
										value={productDetails.salePrice}
										onChange={handleProductDetails(
											"salePrice"
										)}
										helperText={IFerrors.salePriceError}
										error={
											IFerrors.salePriceError.length > 0
												? true
												: false
										}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Weight"
										id="weight"
										name="weight"
										value={productDetails.weight}
										onChange={handleProductDetails(
											"weight"
										)}
										helperText={IFerrors.weightError}
										error={
											IFerrors.weightError.length > 0
												? true
												: false
										}
									/>
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
										value={productDetails.state}
										onChange={handleProductDetails("state")}
									>
										<MenuItem value="DEFAULT">
											Select the Product State
										</MenuItem>
										<MenuItem value="New">New</MenuItem>
										<MenuItem value="Used">Used</MenuItem>
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
										helperText={IFerrors.shippingCostError}
										error={
											IFerrors.shippingCostError.length >
											0
												? true
												: false
										}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Dimensions"
										placeholder="100in 100in 100in"
										value={productDetails.dimensions}
										onChange={handleProductDetails(
											"dimensions"
										)}
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
								</Grid>
								<Grid
									item
									style={{ marginBottom: 10, marginLeft: 10 }}
								>
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

								<Grid
									container
									spacing={2}
									style={{ marginLeft: 5, marginRight: 5 }}
								>
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

								{/* SAVE CHANGES BUTTON */}
								<Grid
									item
									xs={12}
									sm={12}
									md={12}
									align="center"
									style={{ margin: "20px 0" }}
								>
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

			{/* View Product */}
			<Modal
				open={VPmodalOpen}
				onClose={handleVPClose}
				onBackdropClick={handleVPClose}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container
					component={Paper}
					style={{
						padding: "20px",
						maxWidth: "50vw",
						maxHeight: "80vh",
						overflow: "auto",
						scrollbarWidth: "2px",
					}}
				>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} align="center">
							<Typography variant="h5">
								Product Details
							</Typography>
						</Grid>
						<form
							className={classes.form}
							noValidate
							style={{ padding: 20 }}
						>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										margin="dense"
										variant="outlined"
										fullWidth
										label="Name"
										value={productDetails.name}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										multiline
										rows={4}
										label="Description"
										value={productDetails.description}
									/>
								</Grid>
								<Grid item xs={6}>
									<Select
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Category"
										style={{ marginTop: 8 }}
										value={productDetails.category}
										defaultValue={"DEFAULT"}
									>
										<MenuItem value="DEFAULT" disabled>
											Choose a Product Category
										</MenuItem>
										{productCategories.map((el, index) => (
											<MenuItem
												value={el.name}
												key={index}
											>
												{el.name}
											</MenuItem>
										))}
									</Select>
								</Grid>
								<Grid item xs={6}>
									<Select
										variant="outlined"
										margin="dense"
										required
										fullWidth
										label="Sub Category"
										style={{ marginTop: 8 }}
										defaultValue={"DEFAULT"}
										value={productDetails.subCategory}
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
										value={productDetails.brand}
										defaultValue="DEFAULT"
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
										fullWidth
										placeholder="dd/MM/YYYY"
										label="Manufacture Date"
										name="manufactureDate"
										value={productDetails.manufactureDate}
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
									>
										<MenuItem value="DEFAULT" disabled>
											Select Product Color
										</MenuItem>
										<MenuItem value="Red">Red</MenuItem>
										<MenuItem value="Green">Green</MenuItem>
										<MenuItem value="Black">Black</MenuItem>
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
										fullWidth
										name="stock"
										label="Stock / Quantity"
										value={productDetails.stockAvailable}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										name="warranty"
										label="Warranty"
										value={productDetails.warranty}
									/>
								</Grid>

								<Grid item xs={6}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										label="Purchase Price"
										value={productDetails.purchasePrice}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										label="Sale Price (Rs)"
										name="salePrice"
										value={productDetails.salePrice}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										label="Weight"
										id="weight"
										name="weight"
										value={productDetails.weight}
									/>
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
										value={productDetails.state}
									>
										<MenuItem value="DEFAULT">
											Select the Product State
										</MenuItem>
										<MenuItem value="New">New</MenuItem>
										<MenuItem value="Used">Used</MenuItem>
										<MenuItem value="Refurbished">
											Refurbished
										</MenuItem>
									</Select>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										label="Shipping Cost"
										name="shippingCost"
										value={productDetails.shippingCost}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										margin="dense"
										fullWidth
										label="Dimensions"
										value={productDetails.dimensions}
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
															width="70px"
															height="70px"
															style={{
																border: "3px solid #e1e1e1",
																padding: "2px",
															}}
														/>
													</Grid>
												)
											)
										) : (
											<Typography>
												No Product Images Uploaded!
											</Typography>
										)}
									</Grid>
								</Grid>

								<Grid
									container
									spacing={2}
									style={{ marginLeft: 5, marginRight: 5 }}
								>
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
											/>
										</Grid>
									) : (
										""
									)}
								</Grid>

								<Grid
									item
									xs={12}
									sm={12}
									md={12}
									align="center"
									style={{ margin: "20px 0" }}
								>
									<Button
										variant="outlined"
										color="primary"
										onClick={handleVPClose}
									>
										CLOSE
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
							<div>
								<label htmlFor="contained-button-file">
									<Button
										variant="contained"
										color="primary"
										component="span"
									>
										Select File
									</Button>
								</label>
								<CSVReader
									inputId="contained-button-file"
									onFileLoaded={handleFileLoaded}
									parserOptions={papaparseOptions}
									inputStyle={{ display: "none" }}
								/>
							</div>
							<div>
								<Typography variant="subtitle2" color="primary">
									{selectedFile}
								</Typography>
							</div>

							<div>
								<Button
									variant="contained"
									color="primary"
									disabled={
										progressValue === 0 ? true : false
									}
									onClick={handeStartImport}
								>
									Start Importing
								</Button>
							</div>
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="center">
							{!selectedFile ? (
								<div></div>
							) : (
								<LinearProgress
									variant={progressCSV}
									value={progressValue}
								/>
							)}
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							{selectedFile ? (
								<Typography variant="body1" align="center">
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

			{/* Snackbar Alert */}
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

			{/* Delete Confirmation Dialog */}
			<DeleteProduct
				DeletingProduct={isDeletingProduct}
				setDeletingProduct={setIsDeletingProduct}
				confirmedDelete={confirmedDelete}
			/>

			<DeleteAllProducts
				DeletingAllProduct={isDelAllProducts}
				setDeletingAllProduct={setDelAllProdmodalOpen}
				confirmedDelete={confirmedDeleteProducts}
			/>
		</Grid>
	);
}
