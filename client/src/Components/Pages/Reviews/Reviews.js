import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import StartRatings from "react-star-ratings";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ReplyIcon from "@material-ui/icons/Reply";
import SendIcon from "@material-ui/icons/Send";
import ImgNotAvailable from "../../../assets/images/imgNotAvailable.jpg";

import {
	Grid,
	Paper,
	Typography,
	Modal,
	Container,
	TextField,
	Button,
} from "@material-ui/core";

import { useUserContext } from "../../../context/UserContext";
import Pal from "../../../themes/palette";
import useStyles from "./styles";

export default function Reviews() {
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

	// OrdersList
	const [ReviewsDetails, setReviewsDetails] = useState([]);
	const [vendorResponse, setVendorResponse] = useState({
		rid: "",
		response: "",
	});

	const [responseModalOpen, setResponseModalOpen] = useState(false);
	const openResponseModal = (id) => {
		setVendorResponse({ ...vendorResponse, rid: id });
		setResponseModalOpen(true);
	};
	const closeResponseModal = () => {
		setResponseModalOpen(false);
	};

	const handlerVendorResponse = (input) => async (e) => {
		setVendorResponse({ ...vendorResponse, [input]: e.target.value });
	};

	const [IFerrors, setIFerrors] = useState({
		responseError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// Message Response
		// var responseFormat = /^\w(\w(\.{1}|\s{1})?)+\w$/;
		if (vendorResponse.response.length > 1) {
			errors.responseError = "";
		} else {
			hasError = true;
			errors.responseError = "Invalid Response Message!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const submitVendorResponse = async () => {
		const hasErrors = InputValidation();

		if (hasErrors === false) {
			await api
				.patch(
					`/seller/store/product/review/${vendorResponse.rid}/response`,
					{
						response: vendorResponse.response,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then(() => {
					closeResponseModal();
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "SUCCESS: Your response has been sent!",
						open: true,
					});
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				})
				.catch(() => {
					closeResponseModal();
					setSnackBar({
						...snackBarstate,
						type: "error",
						message: "ERROR: Something went wrong!",
						open: true,
					});
				});
		}
	};

	const getAllReviews = async () => {
		api.get("/seller/store/products/reviews", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setReviewsDetails(res.data.data.reviews);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getAllReviews();
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
		{ title: "PID", field: "productId", hidden: true, export: true },
		{ title: "P. Name", field: "productName" },
		{ title: "User Name", field: "buyerName" },
		{ title: "User Email", field: "buyerEmail" },
		{
			title: "Added On",
			field: "createdAt",
			render: ({ createdAt }) => <div>{createdAt.split("T")[0]}</div>,
		},
		{
			title: "Rating",
			field: "rating",
			render: ({ rating }) => (
				<div>
					<StartRatings
						rating={rating}
						numberOfStars={5}
						starDimension={"15px"}
						starSpacing={"3px"}
						starRatedColor={Pal.palette.primary.main}
					/>
				</div>
			),
		},
	];

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Reviews"
					data={ReviewsDetails}
					columns={columns}
					actions={[
						(rowData) => ({
							icon: () => <ReplyIcon />,
							tooltip: "Send a Response",
							onClick: (event, rowData) =>
								openResponseModal(rowData._id),
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
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Typography
											variant="h6"
											style={{
												fontWeight: "bold",
												marginBottom: 15,
											}}
										>
											Image Uploaded by User :
										</Typography>

										{rowData.pictures.length > 0 ? (
											rowData.pictures.map(
												(img, index) => (
													<div key={index}>
														<img
															src={img}
															alt="productImage1"
															style={{
																width: 120,
																height: 120,
															}}
														/>
													</div>
												)
											)
										) : (
											<img
												src={ImgNotAvailable}
												alt="productImage"
												style={{
													width: 120,
													height: 120,
													background: "grey",
												}}
											/>
										)}
									</Grid>
									<Grid item xs={6}>
										<Typography
											variant="h6"
											style={{
												fontWeight: "bold",
											}}
										>
											User Comment:
										</Typography>
										{rowData.comment.length > 0 ? (
											<div>
												<Typography
													style={{
														textAlign: "justify",
														marginBottom: 15,
													}}
												>
													{rowData.comment}
												</Typography>
											</div>
										) : (
											<Typography
												style={{
													textAlign: "justify",
													marginBottom: 15,
												}}
											>
												No comment was written by
												Customer.
											</Typography>
										)}

										<Typography
											variant="h6"
											style={{
												fontWeight: "bold",
											}}
										>
											Vendor Response:
										</Typography>

										{rowData.response ? (
											<Typography
												style={{
													textAlign: "justify",
													marginBottom: 15,
												}}
											>
												{rowData.response}
											</Typography>
										) : (
											<Typography
												style={{
													textAlign: "justify",
												}}
											>
												No response from Vendor
											</Typography>
										)}
									</Grid>
								</Grid>
							</div>
						);
					}}
				/>
			</Grid>

			{/* Vendor Response Modal */}
			<Modal
				open={responseModalOpen}
				onClose={closeResponseModal}
				onBackdropClick={closeResponseModal}
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
								Enter Response Below:
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<TextField
								variant="outlined"
								margin="dense"
								required
								fullWidth
								multiline
								rows={3}
								label="Response"
								value={vendorResponse.response}
								onChange={handlerVendorResponse("response")}
								helperText={IFerrors.responseError}
								error={
									IFerrors.responseError.length > 0
										? true
										: false
								}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12} align="right">
							<Button
								style={{ marginRight: 5 }}
								variant="outlined"
								color="primary"
								onClick={closeResponseModal}
							>
								CANCEL
							</Button>
							<Button
								variant="contained"
								color="primary"
								endIcon={<SendIcon />}
								onClick={submitVendorResponse}
							>
								SEND
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Alert Snackbar */}
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
