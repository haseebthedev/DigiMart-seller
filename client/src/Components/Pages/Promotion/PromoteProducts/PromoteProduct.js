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
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ImageNotAvailable from "../../../../assets/images/imgNotAvailable.jpg";
import { useUserContext } from "../../../../context/UserContext";
import useStyles from "./styles";

export default function AddProduct() {
	const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;
	const storeName = store.data.data.storeName;

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

	const [selectedDate, setSelectedDate] = useState(
		new Date().toLocaleString()
	);
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const [pid, setPid] = useState("");
	const [AllCategories, setAllCategories] = useState([]);
	const [PPAudiencedetails, setPPAudiencedetails] = useState([]);
	const [productList, setProductList] = useState([]);
	const [PPdetails, setPPdetails] = useState({
		productName: "",
		category: "",
		description: "",
		discount: 0,
		promoCode: "-",
		longUrl: "",
		shortUrl: "",
		urlCode: "",
		isUrlAlreadyCreated: false,
		isScheduled: false,
	});

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
				"Buy",
				"Sale",
				"Shop",
				"Xtreme",
				"2021",
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
			longUrl: `https://digi-mart.com/products/${pid}`,
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
				.catch(() =>
					setSnackBar({
						...snackBarstate,
						type: "error",
						message:
							"ERROR: System is busy or Server is not responding!",
						open: true,
					})
				);
		}
	};

	const getAllCategory = async () => {
		api.get("/seller/product/categories", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const categoryList = res.data.data.categories;
				let uniqueCategories = [
					...new Map(
						categoryList.map((item) => [
							item["parentCategoryName"],
							item,
						])
					).values(),
				];
				setAllCategories(uniqueCategories);
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

	const getPPAudienceByCategory = async () => {
		if (PPdetails.category !== "") {
			await api
				.get(`/seller/promotion/audience/${PPdetails.category}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) =>
					setPPAudiencedetails(res.data.data.promotionAudience)
				)
				.catch((error) => {
					setSnackBar({
						...snackBarstate,
						type: "error",
						message:
							"ERROR: System is busy or Server is not responding!",
						open: true,
					});
				});
		}
	};

	// =======================================================

	useEffect(() => {
		getPPAudienceByCategory();
		// eslint-disable-next-line
	}, [PPdetails.category]);

	useEffect(() => {
		getAllCategory();
		getAllProducts();
		// eslint-disable-next-line
	}, []);

	const addProductForPromotion = async () => {
		let promotedAudienceId = "";
		let promotionSource = "";
		PPAudiencedetails.map((el) => {
			promotedAudienceId = el._id;
			promotionSource = el.promotionSource;
			return el;
		});
		let promotionMessage = `Buy exciting '${PPdetails.category}' from ${storeName}. Enter our Promo Code '${PPdetails.promoCode}' to get Amazing discounts on your favourite Products. Click below link to place your Order Now!\n${PPdetails.shortUrl}`;
		let dateAndTime = new Date(selectedDate).toLocaleString();
		let promotion_date = dateAndTime.split(", ")[0];
		let promotion_Time = dateAndTime.split(", ")[1];

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

		var dataToSend = {
			productId: pid,
			promotionMessage,
			promotedAudienceId,
			promotionSource,
		};

		if (isUrlAlreadyCreated === false) {
			dataToSend["productName"] = productName;
			dataToSend["category"] = category;
			dataToSend["description"] = description;
			dataToSend["discount"] = discount;
			dataToSend["promoCode"] = promoCode;
			dataToSend["longUrl"] = longUrl;
			dataToSend["shortUrl"] = shortUrl;
			dataToSend["urlCode"] = urlCode;
		} else {
			dataToSend["productName"] = productName;
			dataToSend["category"] = category;
			dataToSend["description"] = description;
			dataToSend["discount"] = discount;
			dataToSend["promoCode"] = promoCode;
			dataToSend["shortUrl"] = shortUrl;
		}

		if (isScheduled === true) {
			dataToSend["promotion_date"] = promotion_date;
			dataToSend["promotion_Time"] = promotion_Time;
			console.log("Scheduled");
		}

		var error = shortUrl === "" ? true : false;
		var URL = isScheduled === true ? "promote/schedule" : "promote";

		if (error === false) {
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
				.then(() =>
					setSnackBar({
						...snackBarstate,
						type: "success",
						message:
							"CONGRATULATIONS: Your Product has been Added into Promotion List!",
						open: true,
					})
				)
				.catch(() =>
					setSnackBar({
						...snackBarstate,
						type: "error",
						message:
							"ERROR: Kindly enter Valid Product Details to Promote!",
						open: true,
					})
				);
		} else {
			setSnackBar({
				...snackBarstate,
				type: "error",
				message: "ERROR: Kindly generate Short URL first!",
				open: true,
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
								Add Product Details
							</Typography>
							<Divider />
							<form className={classes.form}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={6} lg={6}>
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
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={6} lg={6}>
										<Select
											variant="outlined"
											margin="dense"
											required
											fullWidth
											label="Category"
											name="category"
											style={{ marginTop: 8 }}
											defaultValue={"DEFAULT"}
											onChange={handlePPdetails(
												"category"
											)}
										>
											<MenuItem value="DEFAULT" disabled>
												Choose a Product Category
											</MenuItem>
											{AllCategories.map((el, index) => (
												<MenuItem
													value={
														el.parentCategoryName
													}
													key={index}
												>
													{el.parentCategoryName}
												</MenuItem>
											))}
										</Select>
									</Grid>
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={12} md={12} lg={12}>
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
										/>
									</Grid>
								</Grid>
								<Grid
									container
									spacing={2}
									style={{ marginBottom: 10 }}
								>
									<Grid item xs={12} sm={6} md={6} lg={6}>
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
									<Grid item xs={12} sm={6} md={3} lg={3}>
										<Button
											fullWidth
											variant="outlined"
											style={{ marginTop: 9 }}
											onClick={getCoupon}
										>
											Get Coupon
										</Button>
									</Grid>
								</Grid>
								<Divider />
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
									<Grid item xs={12} sm={12} md={12} lg={12}>
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
											Note: Scheduling the Promotion of
											Product will start your promotion
											upon given date.
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
													minDate={new Date()}
													onChange={handleDateChange}
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
													onChange={handleDateChange}
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
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={4}>
							<div
								style={{
									border: "1px solid rgb(224 224 224)",
									borderRadius: 6,
									padding: 15,
									marginBottom: 20,
								}}
							>
								<Typography variant="h5">Note:</Typography>
								<Typography variant="body2">
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
									align="center"
									spacing={3}
								>
									{productList.map((prod) => (
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
													className={classes.media}
													image={
														prod.images.length > 0
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
															padding: "2px 6px",
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
																prod._id === pid
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
									))}
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
