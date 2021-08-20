import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ImgNotAvailable from "../../../assets/images/imgNotAvailable.jpg";

import { Grid, Paper, Typography, Select, MenuItem } from "@material-ui/core";

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

	const handerChangeStatus = (id) => async (e) => {
		let newStatus = e.target.value;
		const newComplaintsList = ComplaintsList.map((el) =>
			el._id === id
				? { ...el, isProblemResolved: newStatus === "true" }
				: el
		);

		console.log(newComplaintsList);

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
						width: 100,
						display: "flex",
						justifyContent: "right",
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
						defaultValue={"DEFAULT"}
						onChange={handerChangeStatus(rowData._id)}
					>
						<MenuItem value="DEFAULT" disabled>
							Status
						</MenuItem>
						<MenuItem value="true">Resolved</MenuItem>
						<MenuItem value="false">Pending</MenuItem>
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
										{ComplaintsList.screenShot !== "" ? (
											<img
												src={ComplaintsList.screenShot}
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
