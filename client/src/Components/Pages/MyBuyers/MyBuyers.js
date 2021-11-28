import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Grid, Paper } from "@material-ui/core";
import { useUserContext } from "../../../context/UserContext";
import ImgNotAvailable from "../../../assets/images/imgNotAvailable.jpg";
import Pal from "../../../themes/palette";
import useStyles from "./styles";

export default function MyBuyers() {
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
	const [BuyersList, setBuyersList] = useState([]);

	const getAllBuyers = async () => {
		await api
			.get("/seller/store/buyers", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setBuyersList(res.data.data.buyers);
			})
			.catch((error) => {
				setSnackBar({
					...snackBarstate,
					message:
						"ERROR: " +
						JSON.stringify(error.response.data.error.message),
					type: "error",
					open: true,
				});
			});
	};

	useEffect(() => {
		getAllBuyers();
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
			title: "Image",
			field: "images",
			render: ({ profilePic }) => (
				<img
					src={profilePic ? profilePic : ImgNotAvailable}
					alt="ProductImage"
					style={{ width: 40, height: 40, borderRadius: "50%" }}
				/>
			),
			hidden: false,
			export: false,
		},
		{
			title: "Name",
			field: "name",
			render: ({ name }) => (
				<div>{name.replace(/\b\w/g, (c) => c.toUpperCase())}</div>
			),
			hidden: false,
			export: true,
		},
		{ title: "Email", field: "email" },
		{ title: "Phone", field: "phoneNumber" },
		{
			title: "D.O.B",
			field: "birthday",
			render: ({ birthday }) => <div>{birthday ? birthday : "-"}</div>,
		},
		{
			title: "Gender",
			field: "gender",
			render: ({ gender }) => <div>{gender ? gender : "N/A"}</div>,
		},
		{
			title: "Date",
			field: "createdAt",
			render: ({ createdAt }) => <div>{createdAt.split("T")[0]}</div>,
		},

		{
			title: "Status",
			field: "status",
			render: ({ isAccountActive }) => (
				<div>{isAccountActive === true ? "Active" : "InActive"}</div>
			),
		},
	];

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Buyers"
					data={BuyersList}
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
