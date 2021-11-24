import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Grid, Paper, Button } from "@material-ui/core";
import { useUserContext } from "../../../../context/UserContext";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useStyles from "./styles";
import Pal from "../../../../themes/palette";

export default function ViewAllPayments() {
	const classes = useStyles();
	// context
	const { store } = useUserContext();
	const token = store.data.token;

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

	const [details, setDetails] = useState();

	// Edit Product Modal Settings here
	const handleChangeStatus = (id) => async (e) => {
		await api
			.get(`/seller/payment/${id}/status/received`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "SUCCESS: Transaction Status has been Updated!",
					open: true,
				});
				getAllDetails();
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: " +
						JSON.stringify(error.response.data.error.message),
					open: true,
				});
			});
	};

	const getAllDetails = async () => {
		await api
			.get("/seller/store/payments", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setDetails(res.data.data.payments);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	const columns = [
		{
			title: "ID",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
			hidden: false,
			export: false,
		},
		{
			title: "Order-ID",
			field: "orderId",
			width: 150,
		},
		{
			title: "Amount",
			field: "amount",
			width: 150,
		},
		// {
		// 	title: "Currency",
		// 	field: "currency",
		// 	width: 150,
		// 	render: ({ currency }) => <div>{currency.toUpperCase()}</div>,
		// },
		{
			title: "Payment Method",
			field: "paymentMethod",
			width: 150,
			render: ({ paymentMethod }) => (
				<div>{paymentMethod.toUpperCase()}</div>
			),
		},
		{
			title: "Sender Email",
			field: "senderEmail",
			width: 150,
		},
		// { title: "Store Name", field: "storeName", width: "0%" },
		{
			title: "Payment Status",
			field: "status",
			align: "center",
			render: ({ status }) => (
				<div
					style={{
						height: 30,
						width: 110,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						background:
							status === "Pending"
								? "rgba(231, 76, 60, 0.7)"
								: "rgba(112, 224, 0, 0.7)",

						color: "#262626",
						borderRadius: 4,
					}}
				>
					<div
						style={{
							background:
								status === "Pending"
									? "rgba(231, 76, 60, 0.7)"
									: "rgba(112, 224, 0, 0.7)",

							width: 15,
							height: 15,
							borderRadius: 8,
							marginRight: 5,
							marginLeft: 5,
						}}
					></div>
					{status === "succeeded" || status === "Received"
						? "Received"
						: "Pending"}
				</div>
			),
		},

		{
			field: "",
			title: "Actions",
			align: "center",
			render: (rowData) => (
				<div>
					<Button
						color="primary"
						// style={{backgroundColor: rowData.status === "Sent" || rowData.status === "Received" ? "#D3D3D3" : "rgba(231, 76, 60, 0.7)", color:"white"}}
						variant="contained"
						disabled={
							rowData.status === "succeeded" ||
							rowData.status === "Received"
								? true
								: false
						}
						onClick={handleChangeStatus(rowData._id)}
					>
						{rowData.status === "succeeded" ||
						rowData.status === "Received"
							? "Received"
							: "Received"}
					</Button>
				</div>
			),
			export: false,
		},
	];

	useEffect(() => {
		// fetching List of Buyers from API
		getAllDetails();
	}, []);

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Payment Transactions"
					data={details}
					columns={columns}
					options={{
						actionsColumnIndex: -1,
						headerStyle: {
							backgroundColor: Pal.palette.primary.main,
							color: "#fff",
							whiteSpace: "nowrap",
						},
						exportButton: true,
						tableLayout: "auto",
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
		</Grid>
	);
}
