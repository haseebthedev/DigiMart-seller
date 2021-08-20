import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";

import {
	Grid,
	Paper,
	Typography,
	Divider,
	Select,
	MenuItem,
	TextField,
	Container,
	Modal,
	Button,
} from "@material-ui/core";

import { useUserContext } from "../../../context/UserContext";
import Pal from "../../../themes/palette";
import useStyles from "./styles";

export default function Orders() {
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

	// Edit Order Modal here
	const [editOrderOpen, setEditOrderOpen] = useState(false);
	const handleOpen = () => {
		setEditOrderOpen(true);
	};
	const handleClose = () => {
		setEditOrderOpen(false);
	};

	// OrdersList
	const [OrderDetails, setOrderdetails] = useState([]);
	// Order ProductsList
	const [ProductsDetails, setProductsDetails] = useState([]);

	const [editOrderDetails, setEditOrderDetails] = useState({
		_id: "",
		status: "",
		deliveryDate: "",
		storeId: "",
		storeName: "",
		buyerId: "",
		name: "",
		deliveryAddress: "",
		contactNumber: "",
		email: "",
		couponCode: "",
		totalDiscount: "",
		subTotalPrice: "",
		totalPrice: "",
		totalPurchasePrice: "",
		shippingFee: "",
		deliveryInstructions: "",
		totalQuantity: "",
	});

	const handlerOrderChange = (input) => (e) => {
		setEditOrderDetails({ ...editOrderDetails, [input]: e.target.value });
	};

	const handlerProductChange = (input, id) => (e) => {
		let productlist = ProductsDetails.map((el) =>
			el._id === id ? { ...el, [input]: e.target.value } : el
		);
		setProductsDetails(productlist);
	};

	const deleteProductfromOrder = (id) => {
		if (ProductsDetails.length > 1) {
			let newProducts = ProductsDetails.filter((prod) => prod._id !== id);
			setEditOrderDetails({ ...editOrderDetails, products: newProducts });
		} else {
			setSnackBar({
				...snackBarstate,
				type: "error",
				message:
					"You Can't delete all products. Instead, change its status!",
				open: true,
			});
		}
	};

	const handleUpdateOrder = async () => {
		await api
			.patch(
				`/seller/store/order/${editOrderDetails._id}`,
				{ ...editOrderDetails, products: ProductsDetails },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(() => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Order has been added successfully!",
					open: true,
				});
				setTimeout(() => {
					window.location.reload();
				}, 1500);
				handleClose();
			})
			.catch((error) => console.log(error));
	};

	const handerChangeStatus = (id) => async (e) => {
		let newStatus = e.target.value;

		const newOrderDetails = OrderDetails.map((order) =>
			order._id === id ? { ...order, status: newStatus } : order
		);

		await api
			.patch(
				`/seller/store/order/${id}`,
				{ status: newStatus },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(() => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Status has been Changed!",
					open: true,
				});
				setOrderdetails(newOrderDetails);
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went Wrong!",
					open: true,
				});
			});
	};

	const checkStatusColor = (checkStatusColor) => {
		let color = "";
		switch (checkStatusColor) {
			case "Pending":
				color = "rgba(255, 186, 8, 0.7)";
				break;
			case "Active":
				color = "rgba(52, 152, 219, 0.7)";
				break;
			case "Delivered":
				color = "rgba(112, 224, 0, 0.7)";
				break;
			case "Cancelled":
				color = "rgba(231, 76, 60, 0.7)";
				break;
			case "Returned":
				color = "rgba(239, 35, 60, 0.7)";
				break;
			default:
				color = "rgba(230, 126, 34, 0.7)";
		}

		return color;
	};

	const getAllOrders = async () => {
		await api
			.get("/seller/store/orders/view", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				// setProductsDetails(productArray);
				setOrderdetails(res.data.data.orders);
			})
			.catch((error) => console.log(error));
	};

	// Sort Order by Date Modal here
	const [SortOrderOpen, setSortOrderOpen] = useState(false);
	const handleSortOpen = () => {
		setSortOrderOpen(true);
	};
	const handleSortClose = () => {
		setSortOrderOpen(false);
	};

	// SORT ORDERS LIST
	const [DateFrom, setDateFrom] = useState(new Date());
	const [DateTo, setDateTo] = useState(new Date());

	const handleDateFromChange = (date) => {
		setDateFrom(date);
	};

	const handleDateToChange = (date) => {
		setDateTo(date);
	};

	const handlerSortDate = async () => {
		await api
			.post(
				"/seller/store/orders/date/range",
				{
					greaterThanDate: DateFrom,
					lesserThanDate: DateTo,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then((res) => {
				console.log("res", res.data.data.orders);
				setOrderdetails(res.data.data.orders);
				handleSortClose();
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getAllOrders();
		// eslint-disable-next-line
	}, []);

	const columns = [
		{
			title: "#",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
			hidden: false,
			export: true,
		},
		{
			title: "Order ID",
			field: "_id",
		},
		{ title: "Name", field: "name" },
		{ title: "Contact", field: "contactNumber" },
		{
			title: "Amount",
			field: "totalPrice",
			render: ({ totalPrice }) => <div>{"Rs. " + totalPrice}</div>,
		},
		{
			title: "Status",
			field: "status",
			align: "center",
			render: ({ status }) => (
				<div
					style={{
						height: 30,
						width: 100,
						display: "flex",
						justifyContent: "right",
						alignItems: "center",
						background: checkStatusColor(status),
						color: "#262626",
						borderRadius: 4,
					}}
				>
					<div
						style={{
							background: checkStatusColor(status),
							width: 15,
							height: 15,
							borderRadius: 8,
							marginRight: 5,
							marginLeft: 5,
						}}
					></div>
					{status}
				</div>
			),
		},
		{
			title: "Date",
			field: "createdAt",
			align: "center",
			render: ({ createdAt }) => <div>{createdAt.split("T")[0]}</div>,
		},
		{
			title: "Time",
			field: "createdAt",
			align: "center",
			render: ({ createdAt }) => {
				let time = new Date(createdAt);
				return <div>{time.toLocaleTimeString()}</div>;
			},
			export: false,
		},
		{
			field: "",
			title: "",
			align: "center",
			render: (rowData) => (
				<div>
					<Select
						id="status"
						style={{ marginTop: 8 }}
						defaultValue={"DEFAULT"}
						onChange={handerChangeStatus(rowData._id)}
					>
						<MenuItem value="DEFAULT" disabled>
							Status
						</MenuItem>
						<MenuItem value="Delivered">Delivered</MenuItem>
						<MenuItem value="Active">Active</MenuItem>
						<MenuItem value="Pending">Pending</MenuItem>
						<MenuItem value="Cancelled">Cancelled</MenuItem>
						<MenuItem value="Returned">Returned</MenuItem>
					</Select>
				</div>
			),
			export: false,
		},
	];

	return (
		<Grid container className={classes.root}>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				align="right"
				style={{ marginBottom: 20 }}
				onClick={handleSortOpen}
			>
				<Button variant="contained" color="primary" align="right">
					SORT BY DATE
				</Button>
			</Grid>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Orders"
					data={OrderDetails}
					columns={columns}
					actions={[
						(rowData) => ({
							icon: () => <EditIcon />,
							tooltip: "Edit Order Details",
							onClick: (event, rowData) => {
								setEditOrderDetails({
									editOrderDetails,
									...rowData,
								});
								setProductsDetails(rowData.products);
								handleOpen();
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
					detailPanel={(rowData) => {
						return (
							<div style={{ padding: "20px 40px" }}>
								<Typography
									variant="h6"
									style={{
										fontWeight: "bold",
										marginBottom: 10,
									}}
								>
									Ordered Items:
								</Typography>
								<Grid container spacing={2}>
									{rowData.products.map((prod, index) => (
										<Grid item xs={12} key={prod._id}>
											<Grid
												container
												spacing={4}
												style={{
													display: "flex",
													justifyContent:
														"space-between",
													marginBottom: 5,
												}}
											>
												<Grid
													item
													style={{
														display: "flex",
													}}
												>
													<div
														style={{
															marginRight: 20,
														}}
													>
														{index + 1 + ". "}
													</div>
													<div>
														<Typography>
															PID:{" "}
															{prod.productId}
														</Typography>
														<Typography>
															Name: {prod.name}
														</Typography>
														<Typography>
															Size: {prod.size}
														</Typography>
														<Typography>
															Color: {prod.color}
														</Typography>
														<Typography>
															Quantity:{" "}
															{prod.quantity}
														</Typography>
													</div>
												</Grid>
												<Grid item align="right">
													<div>
														<Typography>
															Price:{" "}
															{prod.buyPrice}
														</Typography>
														<Typography>
															Discount:{" "}
															{prod.discount}
														</Typography>
													</div>
												</Grid>
											</Grid>
										</Grid>
									))}
								</Grid>
								<Divider />
								<Grid container style={{ marginTop: 20 }}>
									<Grid item xs={6}>
										<Typography
											variant="h6"
											style={{
												fontWeight: "bold",
												marginBottom: 10,
											}}
										>
											Customer Details:
										</Typography>
										<div>
											<Typography>
												Name: {rowData.name}
											</Typography>
											<Typography>
												Email: {rowData.email}
											</Typography>
											<Typography>
												Delivery Address:{" "}
												{rowData.deliveryAddress}
											</Typography>
										</div>
									</Grid>
									<Grid item xs={6} align="right">
										<Typography>
											SubTotal: {rowData.subTotalPrice}
										</Typography>
										<Typography>
											Total Discount:{" "}
											{rowData.totalDiscount}
										</Typography>
										<Typography>
											Shipping Cost: {rowData.shippingFee}
										</Typography>
										<Typography
											style={{
												fontWeight: "bold",
												marginTop: 5,
												fontSize: 16,
											}}
										>
											Total Price: {rowData.totalPrice}
										</Typography>
									</Grid>
								</Grid>
							</div>
						);
					}}
				/>
			</Grid>

			{/* Edit Product */}
			<Modal
				open={editOrderOpen}
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
						maxWidth: "70vw",
						maxHeight: "80vh",
						overflow: "auto",
						scrollbarWidth: "2px",
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={12} align="center">
							<Typography variant="h5">
								Edit Order Details
							</Typography>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} md={4}>
								<form
									className={classes.form}
									noValidate
									style={{ padding: 20 }}
								>
									<Typography
										variant="h6"
										style={{
											fontWeight: "bold",
											marginBottom: 10,
										}}
									>
										Customer Details:
									</Typography>
									<div>
										<Typography
											style={{
												marginBottom: 10,
											}}
										>
											BID: {editOrderDetails.buyerId}
										</Typography>

										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											label="Name"
											value={editOrderDetails.name}
											onChange={handlerOrderChange(
												"name"
											)}
										/>

										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											label="Contact"
											value={
												editOrderDetails.contactNumber
											}
											onChange={handlerOrderChange(
												"contactNumber"
											)}
										/>
										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											label="Email"
											value={editOrderDetails.email}
											onChange={handlerOrderChange(
												"email"
											)}
										/>

										<TextField
											margin="dense"
											variant="outlined"
											fullWidth
											label="Delivery Address"
											value={
												editOrderDetails.deliveryAddress
											}
											onChange={handlerOrderChange(
												"deliveryAddress"
											)}
										/>
									</div>
								</form>
							</Grid>
							<Grid item xs={12} md={8}>
								<form
									className={classes.form}
									noValidate
									style={{ padding: 20 }}
								>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<Typography
												variant="h6"
												style={{
													fontWeight: "bold",
													marginBottom: 10,
												}}
											>
												Ordered Items:
											</Typography>
											{ProductsDetails.map(
												(prod, index) => (
													<Grid
														item
														xs={12}
														key={index}
														style={{
															marginBottom: 30,
														}}
													>
														<Grid container>
															<Grid item xs={10}>
																<Typography
																	style={{
																		marginBottom: 10,
																	}}
																>
																	PID:{" "}
																	{
																		prod.productId
																	}
																</Typography>

																<TextField
																	margin="dense"
																	variant="outlined"
																	fullWidth
																	label="Name"
																	value={
																		prod.name
																	}
																	onChange={handlerProductChange(
																		"name",
																		prod._id
																	)}
																/>
																<TextField
																	margin="dense"
																	variant="outlined"
																	fullWidth
																	label="Color"
																	value={
																		prod.color
																	}
																	onChange={handlerProductChange(
																		"color",
																		prod._id
																	)}
																/>
																<TextField
																	margin="dense"
																	variant="outlined"
																	fullWidth
																	label="Size"
																	value={
																		prod.size
																	}
																	onChange={handlerProductChange(
																		"size",
																		prod._id
																	)}
																/>
																<TextField
																	margin="dense"
																	variant="outlined"
																	fullWidth
																	label="Quantity"
																	value={
																		prod.quantity
																	}
																	onChange={handlerProductChange(
																		"quantity",
																		prod._id
																	)}
																/>
															</Grid>
															<Grid
																item
																xs={2}
																align="center"
															>
																<DeleteSweepIcon
																	style={{
																		fontSize: 30,
																	}}
																	onClick={() =>
																		deleteProductfromOrder(
																			prod._id
																		)
																	}
																/>
															</Grid>
														</Grid>
													</Grid>
												)
											)}
										</Grid>
									</Grid>
								</form>
							</Grid>

							{/* BUTTONS */}
							<Grid
								item
								xs={12}
								align="center"
								style={{ marginTop: -30, marginBottom: 20 }}
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
									onClick={handleUpdateOrder}
								>
									UPDATE
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Sort Orders by Date  */}
			<Modal
				open={SortOrderOpen}
				onClose={handleSortClose}
				onBackdropClick={handleSortClose}
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
						maxWidth: "70vw",
						maxHeight: "80vh",
					}}
				>
					<Grid container spacing={4} align="center">
						<Grid item xs={12} sm={12} md={12}>
							<Typography variant="h5">
								Sort Orders by Dates
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Grid
								container
								spacing={2}
								style={{ marginBottom: 10 }}
								align="center"
							>
								<Grid item xs={12} sm={12} md={6} lg={6}>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<KeyboardDatePicker
											margin="normal"
											label="Select Date"
											format="MM/dd/yyyy"
											value={DateFrom}
											maxDate={new Date().toLocaleString()}
											onChange={handleDateFromChange}
										/>
									</MuiPickersUtilsProvider>
								</Grid>
								<Grid item xs={12} sm={12} md={6} lg={6}>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<KeyboardDatePicker
											margin="normal"
											label="Select Date"
											format="MM/dd/yyyy"
											value={DateTo}
											maxDate={new Date().toLocaleString()}
											onChange={handleDateToChange}
										/>
									</MuiPickersUtilsProvider>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} style={{ marginBottom: 20 }}>
							<Button
								variant="outlined"
								color="primary"
								style={{ marginRight: 20 }}
								onClick={handleSortClose}
							>
								CANCEL
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handlerSortDate}
							>
								APPLY SORT
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Alert Snackbar */}
			<Snackbar
				open={open}
				anchorOrigin={{ vertical, horizontal }}
				autoHideDuration={1000}
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
