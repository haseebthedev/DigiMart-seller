import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import StorefrontIcon from "@material-ui/icons/Storefront";
import {
	Grid,
	Paper,
	Modal,
	Container,
	Typography,
	Card,
	CardMedia,
	CardContent,
} from "@material-ui/core";
import ImageNotAvailable from "../../../../assets/images/imgNotAvailable.jpg";
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

	// Modal
	const [modalSS, setModelSS] = useState(false);
	const OpenModalSS = () => {
		setModelSS(true);
	};
	const CloseModalSS = () => {
		setModelSS(false);
	};

	// VendorDetails
	const [vendorId, setVendorId] = useState("");
	const [vendorDetails, setVendorDetails] = useState({});
	const [vendorsList, setVendorsList] = useState([]);

	// Vendor Products
	const [productList, setProductList] = useState([]);

	const handleVendorId = (id) => {
		setVendorId(id);
	};

	const handleVendorDetails = (details) => {
		setVendorDetails({ ...vendorDetails, ...details });
	};

	const getAllVendorProducts = async () => {
		if (vendorId !== "") {
			await api
				.get(`/seller/vendor/${vendorId}/products`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setProductList(res.data.data.products))
				.catch((error) => console.log(error));
		}
	};

	const retrivingAllVendors = async () => {
		await api
			.get("/seller/vendors/active/list", {
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

	useEffect(() => {
		getAllVendorProducts();
		// eslint-disable-next-line
	}, [vendorId]);

	function trimProdName(name) {
		let res = "";
		if (name.length > 14) {
			res = name.toString().substring(0, 13) + "...";
		} else {
			res = name;
		}
		return res;
	}

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
							tooltip: "View Store",
							onClick: (event, rowData) => {
								handleVendorDetails(rowData);
								handleVendorId(rowData._id);
								OpenModalSS();
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
				/>

				{/* Show Vendor Store Modal */}
				<Modal
					open={modalSS}
					onClose={CloseModalSS}
					onBackdropClick={CloseModalSS}
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
									<div
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<StorefrontIcon
											fontSize="large"
											color="primary"
										/>
										<Typography
											variant="h5"
											align="center"
											style={{
												color: Pal.palette.primary.main,
											}}
										>
											Store Name:{" "}
											{vendorDetails.companyName}
										</Typography>
									</div>
									<Grid
										container
										style={{
											marginTop: 20,
											overflowY: "scroll",
											maxHeight: "710px",
										}}
										spacing={3}
										// justify="center"
									>
										{productList.length > 0 ? (
											productList.map((prod) => (
												<Grid
													item
													xs={12}
													sm={3}
													md={3}
													key={prod._id}
													style={{ marginBottom: 20 }}
												>
													<Card
														style={{
															position:
																"relative",
														}}
													>
														<CardMedia
															className={
																classes.media
															}
															image={
																prod.images
																	.length > 0
																	? prod
																			.images[0]
																	: ImageNotAvailable
															}
															title="Product Image"
														/>
														<CardContent
															style={{
																padding: 6,
															}}
															align="center"
														>
															<Typography
																style={{
																	marginTop: 4,
																	color: Pal
																		.palette
																		.primary
																		.main,
																	fontWeight:
																		"bold",
																}}
																gutterBottom
															>
																{trimProdName(
																	prod.name
																)}
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
															<Typography
																style={{
																	marginTop: 8,
																	fontSize: 12,
																}}
															>
																Stock :{" "}
																{prod.salePrice}{" "}
																{" - "} Brand :{" "}
																{prod.brand}
															</Typography>
															<Typography
																style={{
																	marginTop: 4,
																	color: Pal
																		.palette
																		.primary
																		.main,
																	fontWeight:
																		"bold",
																}}
																align="center"
															>
																Rs.{" "}
																{prod.salePrice}
															</Typography>
														</CardContent>
													</Card>
												</Grid>
											))
										) : (
											<Grid item xs={12}>
												<Typography>
													There are No Products
													uploaded yet!
												</Typography>
											</Grid>
										)}
									</Grid>
								</form>
							</Grid>
						</Grid>
					</Container>
				</Modal>

				{/* Alertbar */}
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
