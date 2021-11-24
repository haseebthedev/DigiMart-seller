import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Grid, Paper } from "@material-ui/core";
import { useUserContext } from "../../../../context/UserContext";
import api from "../../../../Axios/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useStyles from "./styles";
import Pal from "../../../../themes/palette";

const ViewWithdrawalsRequestsHistory = () => {
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

	const getAllDetails = async () => {
		await api
			.get("/seller/store/withdraws/history", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				// console.log(res);
				setDetails(res.data.data.Withdrawals);
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
			title: "Amount",
			field: "withdrawAmount",
			width: 150,
		},
		{
			title: "Currency",
			field: "currency",
			width: 150,
		},
		{
			title: "Payment Method",
			field: "paymentMethod",
			width: 150,
		},
		{ title: "Store Name", field: "storeName", width: "0%" },
		{
			title: "Created At",
			field: "createdAt",
			width: "0%",
			render: ({ createdAt }) => {
				let date = new Date(createdAt);
				return <div>{date.toLocaleDateString()}</div>;
			},
		},
		{
			title: "Status",
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
							status === "Requested"
								? "rgba(231, 76, 60, 0.7)"
								: "rgba(112, 224, 0, 0.7)",

						color: "#262626",
						borderRadius: 4,
					}}
				>
					<div
						style={{
							background:
								status === "Requested"
									? "rgba(231, 76, 60, 0.7)"
									: "rgba(112, 224, 0, 0.7)",

							width: 15,
							height: 15,
							borderRadius: 8,
							marginRight: 5,
							marginLeft: 5,
						}}
					></div>
					{status === "Sent" ? "Received" : "Requested"}
				</div>
			),
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
					title="Payment Withdrawal History"
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
		</Grid>
	);
};

export default ViewWithdrawalsRequestsHistory;
