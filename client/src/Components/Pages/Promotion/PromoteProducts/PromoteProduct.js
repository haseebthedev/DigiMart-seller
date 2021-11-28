import React, { useState, useEffect } from "react";
import "date-fns";
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
	FormGroup,
	FormControlLabel,
	Container,
	Modal,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Checkbox,
} from "@material-ui/core";
import api from "../../../../Axios/api";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import Pal from "../../../../themes/palette";
import CSVReader from "react-csv-reader";
import MaterialTable from "material-table";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import promotion from "../../../../assets/images/promotion.svg";
import ImageNotAvailable from "../../../../assets/images/imgNotAvailable.jpg";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";

export default function PromoteProduct(props) {
	const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;
	const city = store.data.data.city;

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

	// =======================================================

	const [selectedDate, setSelectedDate] = useState(new Date());
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const [pid, setPid] = useState("");
	const [AllCategories, setAllCategories] = useState([]);
	const [productList, setProductList] = useState([]);
	const [PPdetails, setPPdetails] = useState({
		productName: "",
		category: "",
		description: "",
		discount: "",
		promoCode: "-",
		longUrl: "",
		shortUrl: "",
		urlCode: "",
		isUrlAlreadyCreated: false,
		isScheduled: false,
	});
	const [ProvideDiscount, setProvideDiscount] = useState(false);

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		categoryError: "",
		descriptionError: "",
		discountError: "",
		longUrlError: "",
		shortUrlError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// name
		var nameFormat = /^[0-9A-Za-z\s_+()'#@&-]+$/;
		if (PPdetails.productName.match(nameFormat)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError =
				"Invalid Input. Name cannot contains several Special Characters!";
		}

		// description
		var descFormat = /^[A-Za-z0-9.,'!()#&+-\s]+$/;
		if (PPdetails.description.match(descFormat)) {
			errors.descriptionError = "";
		} else {
			hasError = true;
			errors.descriptionError =
				"Description contains several characters that aren't allowed!";
		}

		// Product category
		if (PPdetails.category.length === 0) {
			hasError = true;
			errors.categoryError = "Please Choose a Category for Product!";
		} else {
			errors.categoryError = "";
		}

		// discountFormat
		if (ProvideDiscount === true) {
			var discountFormat = /\b(0*([1-9][0-9]?|100))\b/;
			if (PPdetails.discount.match(discountFormat)) {
				errors.discountError = "";
			} else {
				hasError = true;
				errors.discountError =
					"Entered Discount Percentage is invalid.";
			}
		}

		// shortUrl
		if (PPdetails.shortUrl == "") {
			hasError = true;
			errors.shortUrlError = "Please generate a short URL!";
		} else {
			errors.shortUrlError = "";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const handlePPSchedule = (input) => (e) => {
		setPPdetails({ ...PPdetails, [input]: e.target.checked });
	};

	const handlePPdetails = (input) => (e) => {
		setPPdetails({ ...PPdetails, [input]: e.target.value });
	};

	const selectProductForPromo = async (id) => {
		await api
			.get(`/seller/store/product/promote/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				const { isProductValidForPromotion } = res.data.data;

				if (isProductValidForPromotion === false) {
					setSnackBar({
						...snackBarstate,
						type: "error",
						message: res.data.message,
						open: true,
					});
				} else {
					setPid(id);
				}
			})
			.catch((error) => console.log(error));
	};

	const getCoupon = () => {
		var coupon = "-";
		if (PPdetails.discount > 0) {
			const words = [
				PPdetails.discount,
				"Best",
				"Wow",
				"Silver",
				"Insane",
				"Shopping",
				"Buy",
				"Sale",
				"Golden",
				"Buddy",
				"Cool",
				"Amazing",
				"Shop",
				"Order",
				"Crazy",
				"Buying",
				"Xtreme",
				"2022",
			];
			coupon =
				words[Math.floor(Math.random() * words.length)] +
				"" +
				words[Math.floor(Math.random() * words.length)];
			setPPdetails({ ...PPdetails, promoCode: coupon });
			setSnackBar({
				...snackBarstate,
				type: "success",
				message: "SUCCESS: Discount Coupon has been generated!",
				open: true,
			});
		} else {
			setSnackBar({
				...snackBarstate,
				type: "warning",
				message: "Kindly, Enter some discount to generate Coupon Code!",
				open: true,
			});
		}
	};

	const getProductURL = () => {
		setPPdetails({
			...PPdetails,
			longUrl: `https://digimart-buyer.netlify.app/product?productId=${pid}`,
		});
		setModelSP(false);
	};

	const generateShortURL = async () => {
		if (PPdetails.longUrl !== "") {
			await api
				.post(
					"/seller/store/product/url/shorten",
					{
						longUrl: PPdetails.longUrl,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					if (res.data.data.isUrlAlreadyCreated === true) {
						setPPdetails({
							...PPdetails,
							shortUrl: res.data.data.shortUrl,
							isUrlAlreadyCreated: true,
						});

						setSnackBar({
							...snackBarstate,
							type: "warning",
							message: res.data.message,
							open: true,
						});
					}
					if (res.data.data.isUrlAlreadyCreated === false) {
						setPPdetails({
							...PPdetails,
							longUrl: res.data.data.longUrl,
							shortUrl: res.data.data.shortUrl,
							urlCode: res.data.data.urlCode,
							isUrlAlreadyCreated: false,
						});
						setSnackBar({
							...snackBarstate,
							type: "success",
							message: "SUCCESS: " + res.data.message,
							open: true,
						});
					}
				})
				.catch((error) => {
					console.log("result url error...");

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
				type: "error",
				open: true,
				message: `ERROR: Please Select a Product first!`,
			});
		}
	};

	const getAllCategory = async () => {
		api.get("/seller/product/mainCategories/list", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.mainCategories;
				setAllCategories(categoryList);
			})
			.catch(() =>
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: System is busy or Server is not responding!",
					open: true,
				})
			);
	};

	const getAllProducts = async () => {
		await api
			.get("/seller/store/products", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setProductList(res.data.data.products))
			.catch(() => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: System is busy or Server is not responding!",
					open: true,
				});
			});
	};

	const [promotionType, setPromotionType] = useState("");
	const [contactsType, setContactsType] = useState("");
	const [fileName, setfileName] = useState("");
	const [contactsList, setContactsList] = useState([]);
	const [constactsSelected, setContactsSelected] = useState([]);

	// Contacts Type
	const handlerType = (e) => {
		setContactsType(e.target.value);
		setContactsList([]);
	};

	// Contacts OnFileLoaded
	const handlerOnFileLoaded = (data, fileInfo) => {
		if (contactsType === "SMS") {
			let validFields = ["name", "number"];
			let isValid = data.map((el) =>
				Object.keys(el).every((val) => validFields.includes(val))
			);

			if (isValid.includes(false)) {
				// Invalid file format
				setSnackBar({
					...snackBarstate,
					type: "error",
					open: true,
					message: `ERROR: The file contains invalid data format!`,
				});
			} else {
				console.log("Success!");
				setfileName(fileInfo.name);
				const newData = data.map((el) => {
					return { name: el.name, number: "+" + el.number };
				});
				setContactsList(newData);
			}
		} else {
			let validFields = ["name", "email"];
			let isValid = data.map((el) =>
				Object.keys(el).every((val) => validFields.includes(val))
			);

			if (isValid.includes(false)) {
				// Invalid file format
				setSnackBar({
					...snackBarstate,
					type: "error",
					open: true,
					message: `ERROR: The file contains invalid data format!`,
				});
			} else {
				console.log("Success!");
				setContactsList(data);
				setfileName(fileInfo.name);
			}
		}
	};

	const handleSelectContacts = (row) => {
		setContactsSelected(row);
	};

	const SmsColumns = [
		{
			title: "ID",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
		},
		{
			title: "Name",
			field: "name",
		},
		{
			title: "Contact",
			field: "number",
		},
	];

	const EmailColumns = [
		{
			title: "ID",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
		},
		{
			title: "Name",
			field: "name",
		},
		{
			title: "Email",
			field: "email",
		},
	];

	const papaparseOptions = {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
	};

	useEffect(() => {
		getAllCategory();
		getAllProducts();
		// eslint-disable-next-line
	}, []);

	const addProductForPromotion = async () => {
		var {
			isUrlAlreadyCreated,
			productName,
			category,
			description,
			discount,
			promoCode,
			longUrl,
			shortUrl,
			urlCode,
			isScheduled,
		} = PPdetails;

		var promotionMessage = "";

		if (ProvideDiscount === false) {
			promotionMessage = `Buy exciting '${category}' from ${city}. Get Amazing discounts on your favourite Products. Click below link to place your Order Now!\n${shortUrl}`;
		} else {
			promotionMessage = `Buy exciting '${category}' from ${city}. Enter our Promo Code '${promoCode}' to get Amazing discounts on your favourite Products. Click below link to place your Order Now!\n${shortUrl}`;
		}

		var dataToSend = {
			productId: pid,
			promotionMessage: promotionMessage,
		};

		// Import Contacts
		if (promotionType === "IC") {
			dataToSend["importedAudienceData"] = constactsSelected;
			dataToSend["importedAudiencePromotionSource"] = contactsType;
		}

		// Previous Buyer
		if (promotionType === "PB") {
			dataToSend["isPromoteToAllBuyers"] = true;
			dataToSend["buyerPromotionSource"] = "Both";
			dataToSend["selectedBuyersData"] = [];
			dataToSend["message"] = "testing message";
		}

		// Scrapped Audience already saved in DB
		if (promotionType === "TA") {
			dataToSend["isPromoteToSavedPromotionAudience"] = true;
		}

		// Realtime Promotion
		if (promotionType === "RA") {
			dataToSend["isPromoteToRealTimeScrappedAudience"] = true;
			dataToSend["numOfScrappedAudience"] = 10;
			dataToSend["audienceInterestCategory"] = category;
		}

		// Formatting Date/Time
		let dateAndTime = new Date(selectedDate).toLocaleString();
		let promotion_date = dateAndTime.split(", ")[0];
		let promotion_Time = dateAndTime.split(", ")[1];

		// Adding/Nullifying Discount
		if (ProvideDiscount === false) {
			dataToSend["discount"] = null;
			dataToSend["promoCode"] = null;
		} else {
			dataToSend["discount"] = discount;
			dataToSend["promoCode"] = promoCode;
		}

		if (isUrlAlreadyCreated === false) {
			dataToSend["productName"] = productName;
			dataToSend["productCategory"] = category;
			dataToSend["description"] = description;
			dataToSend["longUrl"] = longUrl;
			dataToSend["shortUrl"] = shortUrl;
			dataToSend["urlCode"] = urlCode;
		} else {
			dataToSend["productName"] = productName;
			dataToSend["productCategory"] = category;
			dataToSend["description"] = description;
			dataToSend["shortUrl"] = shortUrl;
		}

		if (isScheduled === true) {
			dataToSend["promotion_date"] = promotion_date;
			dataToSend["promotion_Time"] = promotion_Time;
			dataToSend["isPromotionScheduled"] = isScheduled;
		}

		var URL = isScheduled === true ? "promote/schedule" : "promote";

		var hasError = InputValidation();

		if (hasError === false) {
			console.log("Data Sending:: ", dataToSend);

			await api
				.post(
					`/seller/store/product/${URL}`,
					{
						...dataToSend,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message:
							"CONGRATULATIONS: Your Product has been Added into Promotion List!",
						open: true,
					});

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						type: "error",
						open: true,
						message:
							"ERROR: " +
							JSON.stringify(error.response.data.error.message),
					});
				});
		}
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<div className={classes.paper}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={12} md={12} lg={8}>
							<Typography variant="h4" gutterBottom>
								Add Promotion Details
							</Typography>
							<Divider />

							{/* Dropdown Promotion Type */}
							<div className={classes.form}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Typography>
											Select the Type of Promotion:
										</Typography>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											style={{ marginTop: 8 }}
											defaultValue="DEFAULT"
											onChange={(e) =>
												setPromotionType(e.target.value)
											}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Promotion Type
											</MenuItem>
											<MenuItem value="IC">
												Using Import Contacts
											</MenuItem>
											<MenuItem value="TA">
												Using Targeted Audience
											</MenuItem>
											<MenuItem value="PB">
												Using Previous Buyers
											</MenuItem>
											<MenuItem value="RA">
												Using Realtime Audience
												(PREMIUM)
											</MenuItem>
										</Select>
									</Grid>
								</Grid>
							</div>

							{/* Import Contact */}
							{promotionType === "IC" ? (
								<div>
									<form className={classes.form}>
										<Typography>
											Medium (EMAIL/SMS):
										</Typography>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Category"
											name="category"
											style={{ marginTop: 8 }}
											defaultValue="DEFAULT"
											onChange={handlerType}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose Type of Contacts
											</MenuItem>
											<MenuItem value="SMS" key="sms">
												SMS
											</MenuItem>
											<MenuItem value="Email" key="email">
												Email
											</MenuItem>
										</Select>

										<div>
											<div style={{ marginTop: 20 }}>
												<label
													htmlFor="contained-button-file"
													style={{
														display: "flex",
														justifyContent:
															"flex-start",
														alignItems: "center",
													}}
												>
													<Button
														size="small"
														startIcon={
															<AddPhotoAlternateIcon />
														}
														variant="outlined"
														color="primary"
														component="span"
														disabled={
															contactsType == ""
																? true
																: false
														}
													>
														Upload CSV
													</Button>
													<Typography
														style={{
															marginLeft: 10,
														}}
													>
														{fileName}
													</Typography>
												</label>
												<CSVReader
													inputId="contained-button-file"
													onFileLoaded={
														handlerOnFileLoaded
													}
													parserOptions={
														papaparseOptions
													}
													inputStyle={{
														display: "none",
													}}
													accept=".csv"
												/>
											</div>
											<Typography
												style={{ marginTop: 40 }}
												variant="h4"
											>
												Select Contacts to Promote:
											</Typography>
											<div style={{ marginTop: 20 }}>
												<MaterialTable
													title="All Contacts"
													data={contactsList}
													columns={
														contactsType === "SMS"
															? SmsColumns
															: EmailColumns
													}
													options={{
														selection: true,
														actionsColumnIndex: -1,
														headerStyle: {
															backgroundColor:
																Pal.palette
																	.primary
																	.main,
															color: "#fff",
															fontWeight: "bold",
														},
														exportButton: false,
														paging: false,
														search: true,
													}}
													onSelectionChange={
														handleSelectContacts
													}
												/>
											</div>
										</div>
									</form>
								</div>
							) : (
								<div></div>
							)}

							{/* Product Details */}
							{promotionType !== "" ? (
								<form className={classes.form}>
									<Typography
										style={{
											marginTop: 40,
											marginBottom: 20,
										}}
										variant="h4"
									>
										Enter Product Information:
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<TextField
												margin="dense"
												variant="outlined"
												required
												fullWidth
												label="Product Name"
												name="productName"
												value={PPdetails.productName}
												onChange={handlePPdetails(
													"productName"
												)}
												helperText={IFerrors.nameError}
												error={
													IFerrors.nameError.length >
													0
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
												label="Category"
												name="category"
												style={{ marginTop: 8 }}
												defaultValue="DEFAULT"
												onChange={handlePPdetails(
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
													Choose a Product Category
												</MenuItem>

												{AllCategories.map(
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
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<TextField
												margin="dense"
												variant="outlined"
												required
												fullWidth
												multiline
												rows={4}
												label="Description"
												name="description"
												value={PPdetails.description}
												onChange={handlePPdetails(
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
									<Grid
										container
										spacing={2}
										style={{ marginBottom: 10 }}
									>
										<Grid item xs={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															checked={
																ProvideDiscount
															}
															onClick={() =>
																setProvideDiscount(
																	!ProvideDiscount
																)
															}
														/>
													}
													label="Do you want to provide Discount?"
													style={{ marginTop: 10 }}
												/>
											</FormGroup>
										</Grid>
									</Grid>
									{ProvideDiscount && (
										<Grid container spacing={2}>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={6}
											>
												<TextField
													margin="dense"
													variant="outlined"
													fullWidth
													label="Discount (%)"
													name="discount"
													value={PPdetails.discount}
													onChange={handlePPdetails(
														"discount"
													)}
													helperText={
														IFerrors.discountError
													}
													error={
														IFerrors.discountError
															.length > 0
															? true
															: false
													}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={3}
												lg={3}
												align="center"
											>
												<div
													style={{
														marginTop: 10,
														border: "1px solid rgb(224 224 224)",
														padding: 5,
													}}
												>
													<Typography color="primary">
														{PPdetails.promoCode}
													</Typography>
												</div>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={3}
												lg={3}
											>
												<Button
													fullWidth
													variant="outlined"
													style={{ marginTop: 9 }}
													onClick={getCoupon}
													disabled={
														PPdetails.promoCode ===
														"-"
															? false
															: true
													}
												>
													Get Coupon
												</Button>
											</Grid>
										</Grid>
									)}

									<Divider style={{ marginTop: 15 }} />

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
													size="small"
													variant="contained"
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
													{pid
														? `Product ID: ${pid}`
														: ""}
												</Typography>
											</Grid>
										</Grid>
									</div>
									<Grid container spacing={2}>
										<Grid item xs={6} sm={6} md={8} lg={8}>
											<TextField
												margin="dense"
												variant="outlined"
												fullWidth
												label="Product URL"
												name="productURL"
												value={PPdetails.longUrl}
												disabled
												helperText={
													IFerrors.shortUrlError
												}
												error={
													IFerrors.shortUrlError
														.length > 0
														? true
														: false
												}
											/>
										</Grid>
										<Grid item xs={6} sm={6} md={4} lg={4}>
											<Button
												variant="outlined"
												fullWidth
												style={{ marginTop: 9 }}
												onClick={generateShortURL}
											>
												Shortener URL
											</Button>
										</Grid>
									</Grid>
									<Grid
										container
										spacing={2}
										style={{ marginBottom: 10 }}
									>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={12}
										>
											<Typography color="primary">
												{PPdetails.shortUrl}
											</Typography>
										</Grid>
									</Grid>

									<Grid container spacing={2}>
										<Grid item xs={12} sm={12}>
											<FormGroup row>
												<FormControlLabel
													control={
														<Checkbox
															color="primary"
															checked={
																PPdetails.isScheduled
															}
															onChange={handlePPSchedule(
																"isScheduled"
															)}
														/>
													}
													label="Scheduling the Promotion of Product"
												/>
											</FormGroup>
										</Grid>
									</Grid>
									<Grid item xs={12} sm={12} md={12} lg={12}>
										<FormGroup row>
											<Typography
												variant="body2"
												align="center"
											>
												Note: Scheduling the Promotion
												of Product will start your
												promotion upon given date.
											</Typography>
										</FormGroup>
									</Grid>

									{PPdetails.isScheduled === true ? (
										<Grid
											container
											spacing={2}
											style={{ marginBottom: 10 }}
											align="center"
										>
											<Grid
												item
												xs={12}
												sm={12}
												md={6}
												lg={6}
											>
												<MuiPickersUtilsProvider
													utils={DateFnsUtils}
												>
													<KeyboardDatePicker
														margin="normal"
														label="Select Date"
														format="MM/dd/yyyy"
														value={selectedDate}
														minDate={new Date().toLocaleString()}
														onChange={
															handleDateChange
														}
													/>
												</MuiPickersUtilsProvider>
											</Grid>
											<Grid
												item
												xs={12}
												sm={12}
												md={6}
												lg={6}
											>
												<MuiPickersUtilsProvider
													utils={DateFnsUtils}
												>
													<KeyboardTimePicker
														margin="normal"
														label="Select Time"
														value={selectedDate}
														disablePast
														onChange={
															handleDateChange
														}
													/>
												</MuiPickersUtilsProvider>
											</Grid>
										</Grid>
									) : (
										""
									)}

									<Grid
										container
										spacing={2}
										style={{ marginTop: 20 }}
									>
										<Grid item xs={12} sm={6} md={6} lg={6}>
											<Button
												variant="contained"
												color="primary"
												fullWidth
												style={{ marginTop: 9 }}
												onClick={addProductForPromotion}
											>
												START PROMOTION
											</Button>
										</Grid>
										<Grid item xs={12} sm={6} md={6} lg={6}>
											<Button
												variant="contained"
												fullWidth
												style={{ marginTop: 9 }}
											>
												SCHEDULE PROMOTIONS
											</Button>
										</Grid>
									</Grid>
								</form>
							) : (
								<div></div>
							)}
						</Grid>

						{/* Illustration */}
						<Grid item xs={false} sm={false} md={false} lg={4}>
							<div
								style={{
									border: "1px solid rgb(224 224 224)",
									borderRadius: 6,
									padding: 15,
									marginBottom: 20,
								}}
							>
								<img
									src={promotion}
									alt="Product promotion"
									style={{ maxWidth: "400px" }}
								/>
								<Typography variant="h5">
									Promotion Tip:
								</Typography>
								<Typography
									variant="body2"
									style={{ textAlign: "justify" }}
								>
									All the details of Product entered here will
									be send as SMS / Email to interested buyers.
									So, kindly add valid details of Product
									only.
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
			</Grid>

			{/* Select Product for Promotion */}
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
					<Grid container style={{ padding: 20 }} spacing={4}>
						<Grid item xs={12} sm={12} md={12}>
							<form>
								<Typography variant="h5">
									Select a Product to Promote
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
														position: "relative",
													}}
												>
													<CardMedia
														className={
															classes.media
														}
														image={
															prod.images.length >
															0
																? prod.images[0]
																: ImageNotAvailable
														}
														title="Contemplative Reptile"
													/>
													<CardContent
														style={{
															padding: 4,
														}}
													>
														<Typography
															variant="body1"
															style={{
																marginTop: 4,
															}}
															gutterBottom
														>
															{prod.name}
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
															{prod.category}
														</Typography>
													</CardContent>

													<CardActions
														style={{
															justifyContent:
																"center",
														}}
													>
														<Button
															size="small"
															color="primary"
															variant="outlined"
														>
															VIEW
														</Button>
														<Button
															size="small"
															color="primary"
															variant="outlined"
															onClick={() =>
																selectProductForPromo(
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
																	pid
																}
																onChange={() =>
																	selectProductForPromo(
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
												There are No Products uploaded
												yet!
											</Typography>
										</Grid>
									)}
								</Grid>
							</form>
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="right">
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
								onClick={getProductURL}
							>
								SUBMIT
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/*  Snackbar Alert */}
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
