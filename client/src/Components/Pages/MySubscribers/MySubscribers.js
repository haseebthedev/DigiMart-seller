import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import MaterialTable from "material-table";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Grid, Paper, Select, MenuItem } from "@material-ui/core";
import { useUserContext } from "../../../context/UserContext";
import ImgNotAvailable from "../../../assets/images/imgNotAvailable.jpg";
import Pal from "../../../themes/palette";
import useStyles from "./styles";

export default function Subscribers() {
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
	const [SubscribersList, setSubscribersList] = useState([]);

	const handerChangeStatus = (id) => async (e) => {
		let newStatus = e.target.value;

		const newSubsList = SubscribersList.map((el) =>
			el._id === id
				? { ...el, isAccountBlocked: newStatus === "true" }
				: el
		);

		await api
			.patch(
				`/seller/order/problem/${id}`,
				{ isAccountBlocked: newStatus },
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
				setSubscribersList(newSubsList);
			})
			.catch(() => {
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went Wrong!",
					open: true,
				});
			});
	};

	const getAllSubscribers = async () => {
		await api
			.get("/seller/store/subscribers", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setSubscribersList(res.data.data.subscribers);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getAllSubscribers();
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
			render: () => (
				<img
					src={ImgNotAvailable}
					alt="ProductImage"
					style={{ width: 40, height: 40, borderRadius: "50%" }}
				/>
			),
			hidden: false,
			export: false,
		},
		{ title: "Name", field: "name", hidden: false, export: true },
		{ title: "Email", field: "email" },
		{ title: "Phone", field: "phoneNumber" },
		{ title: "D.O.B", field: "birthday" },
		{ title: "Gender", field: "gender" },
		{
			title: "Date",
			field: "createdAt",
			render: ({ createdAt }) => <div>{createdAt.split("T")[0]}</div>,
		},

		{
			title: "Status",
			field: "status",
			align: "center",
			hidden: true,
			render: ({ isAccountBlocked }) => (
				<div
					style={{
						height: 30,
						width: 100,
						display: "flex",
						justifyContent: "right",
						alignItems: "center",
						background:
							isAccountBlocked === true
								? "rgba(112, 224, 0, 0.7)"
								: "rgba(231, 76, 60, 0.7)",
						color: "#262626",
						borderRadius: 4,
					}}
				>
					<div
						style={{
							background:
								isAccountBlocked === true
									? "rgba(112, 224, 0, 0.7)"
									: "rgba(231, 76, 60, 0.7)",
							width: 15,
							height: 15,
							borderRadius: 8,
							marginRight: 5,
							marginLeft: 5,
						}}
					></div>
					{isAccountBlocked === true ? "Active" : "Blocked"}
				</div>
			),
		},
		{
			field: "",
			title: "",
			align: "center",
			hidden: true,
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
						<MenuItem value="true">Active</MenuItem>
						<MenuItem value="false">Blocked</MenuItem>
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
					title="All Subscribers"
					data={SubscribersList}
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
