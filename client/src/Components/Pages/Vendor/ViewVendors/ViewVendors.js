import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import StorefrontIcon from "@material-ui/icons/Storefront";
import { Grid, Paper } from "@material-ui/core";
import { useUserContext } from "../../../../context/UserContext";
import Pal from "../../../../themes/palette";
import useStyles from "./styles";

export default function ViewVendors() {
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

	// VendorDetails
	const [vendorsList, setVendorsList] = useState([]);

	const columns = [
		{
			title: "ID",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
			hidden: false,
			export: false,
		},
		{
			title: "Company",
			field: "companyName",
			hidden: false,
			export: true,
		},
		{
			title: "email",
			field: "email",
			hidden: true,
			export: true,
		},
		{
			title: "Phone",
			field: "businessNumber",
			hidden: false,
			export: true,
		},
		{ title: "City", field: "city", hidden: false, export: true },
		{
			title: "Type",
			field: "typeOfBusiness",
			hidden: false,
			export: true,
		},
		{
			title: "Auth",
			field: "isAuthenticBrand",
			hidden: true,
			export: true,
		},
		{
			title: "Rep. Name",
			field: "contactPersonName",
			hidden: false,
			export: true,
		},
		{
			title: "Rep. Contact",
			field: "contactPersonNumber",
			hidden: false,
			export: true,
		},
		{
			title: "Rep. Desig.",
			field: "contactPersonDesignation",
			hidden: false,
			export: true,
		},
		{
			title: "Rep. Email",
			field: "contactPersonEmail",
			hidden: false,
			export: true,
		},
	];

	const retrivingAllVendors = async () => {
		await api
			.get("/seller/vendors", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				let vendorList = res.data.data.vendors;
				setVendorsList(vendorList);
			})
			.catch((error) => console.log("Error: " + error));
	};

	useEffect(() => {
		retrivingAllVendors();
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Vendors"
					data={vendorsList}
					columns={columns}
					actions={[
						(rowData) => ({
							icon: () => <StorefrontIcon />,
							tooltip: "Buy Vendor Product",
							onClick: (event, rowData) => {},
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
		</Grid>
	);
}
