import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ReplyIcon from "@material-ui/icons/Reply";
import SendIcon from "@material-ui/icons/Send";
import ImgNotAvailable from "../../../assets/images/imgNotAvailable.jpg";

import {
	Grid,
	Paper,
	Typography,
	Select,
	MenuItem,
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
	const [ComplaintsList, setComplaintsList] = useState([]);
	const [complaintResponse, setComplaintResponse] = useState({
		_id: "",
		response: "",
	});

	const [responseModalOpen, setResponseModalOpen] = useState(false);
	const openResponseModal = (id) => {
		setComplaintResponse({ ...complaintResponse, _id: id });
		setResponseModalOpen(true);
	};
	const closeResponseModal = () => {
		setResponseModalOpen(false);
	};

	const handlerComplaintResponse = (input) => async (e) => {
		setComplaintResponse({ ...complaintResponse, [input]: e.target.value });
	};

	const [IFerrors, setIFerrors] = useState({
		responseError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// Message Response
		var responseFormat = /^\w(\w(\.{1}|\s{1})?)+\w$/;
		if (
			complaintResponse.response.match(responseFormat) &&
			complaintResponse.response.length > 1
		) {
			errors.responseError = "";
		} else {
			hasError = true;
			errors.responseError = "Invalid Response Message!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const submitComplaintResponse = async () => {
		const hasErrors = InputValidation();

		if (hasErrors === false) {
			await api
				.patch(
					`---API__HERE___${complaintResponse.rid}`,
					{
						response: complaintResponse.response,
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
				.catch((error) => {
					closeResponseModal();
					setSnackBar({
						...snackBarstate,
						message: "ERROR: " + JSON.stringify(error.response),
						type: "error",
						open: true,
					});
				});
		}
	};

	const handerChangeStatus = (id) => async (e) => {
		let newStatus = e.target.value;
		const newComplaintsList = ComplaintsList.map((el) =>
			el._id === id
				? { ...el, isProblemResolved: newStatus === "true" }
				: el
		);

		await api
			.patch(
				`/seller/order/problem/${id}`,
				{ isProblemResolved: newStatus },
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
				setComplaintsList(newComplaintsList);
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

	const getAllComplaints = async () => {
		await api
			.get("/seller/problem/orders", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setComplaintsList(res.data.data.orderProblems);
			})
			.catch((error) => console.log(error));
	};

	const getComplaintStatusOptions = (status) => {
		switch (status) {
			case false:
				return <MenuItem value="true">Resolved</MenuItem>;
		}
	};

	useEffect(() => {
		getAllComplaints();
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
		{ title: "Order ID", field: "orderID", hidden: false, export: true },
		{ title: "Buyer Email", field: "email" },

		{ title: "Subject", field: "subject" },
		{
			title: "Date",
			field: "createdAt",
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
			title: "Status",
			field: "status",
			align: "center",
			render: ({ isProblemResolved }) => (
				<div
					style={{
						height: 30,
						width: 110,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						background:
							isProblemResolved === true
								? "rgba(112, 224, 0, 0.7)"
								: "rgba(231, 76, 60, 0.7)",
						color: "#262626",
						borderRadius: 4,
					}}
				>
					<div
						style={{
							background:
								isProblemResolved === true
									? "rgba(112, 224, 0, 0.7)"
									: "rgba(231, 76, 60, 0.7)",
							width: 15,
							height: 15,
							borderRadius: 8,
							marginRight: 5,
							marginLeft: 5,
						}}
					></div>
					{isProblemResolved === true ? "Resolved" : "Pending"}
				</div>
			),
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
						value={"DEFAULT"}
						onChange={handerChangeStatus(rowData._id)}
						disabled={
							rowData.isProblemResolved === false ? false : true
						}
					>
						<MenuItem value="DEFAULT" disabled>
							Status
						</MenuItem>
						{getComplaintStatusOptions(rowData.isProblemResolved)}
						{/* <MenuItem value="true">Resolved</MenuItem>
						<MenuItem value="false">Pending</MenuItem> */}
					</Select>
				</div>
			),
			export: false,
		},
	];

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Complaints"
					data={ComplaintsList}
					columns={columns}
					// actions={[
					// 	(rowData) => ({
					// 		icon: () => <ReplyIcon />,
					// 		tooltip: "Send a Response",
					// 		onClick: (event, rowData) =>
					// 			openResponseModal(rowData._id),
					// 	}),
					// ]}
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

										{rowData.screenShot !== "" ? (
											<img
												src={rowData.screenShot}
												alt="productImage1"
												style={{
													width: 120,
													height: 120,
												}}
											/>
										) : (
											<img
												src={ImgNotAvailable}
												alt="productImage"
												style={{
													width: 120,
													height: 120,
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
											Complaint Details:
										</Typography>
										<Typography>
											Subject : {rowData.subject}
										</Typography>
										<Typography>
											Description : {rowData.description}
										</Typography>
									</Grid>
								</Grid>
							</div>
						);
					}}
				/>
			</Grid>

			{/* Seller Response Modal */}
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
								Enter Message Below:
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
								value={complaintResponse.response}
								onChange={handlerComplaintResponse("response")}
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
								onClick={submitComplaintResponse}
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
