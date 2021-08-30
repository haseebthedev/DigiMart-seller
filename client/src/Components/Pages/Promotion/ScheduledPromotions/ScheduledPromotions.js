import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
	Grid,
	Paper,
	Modal,
	Container,
	Typography,
	Button,
	Divider,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";

import { useUserContext } from "../../../../context/UserContext";
import DeleteScheduledPromotion from "../../../FormDialog/DeleteScheduledPromotion";

import Pal from "../../../../themes/palette";

export default function ScheduledPromotions() {
	// const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;

	// PP details
	const [pid, setPid] = useState("");

	const columns = [
		{ title: "PID", field: "_id" },
		{ title: "PNAME", field: "productName" },
		{ title: "Product URL", field: "shortUrl" },
		{ title: "Discount", field: "discount" },
		{ title: "Promotion Time", field: "promotion_Time" },
		{ title: "Promotion Date", field: "promotion_date" },
	];

	const [PPdetails, setPPdetails] = useState([]);

	// Delete Promotion Modal
	const [isDeletingPP, setIsDeletingPP] = useState(false);
	const handlerDeletePP = () => {
		setIsDeletingPP(true);
	};
	const confirmedDelete = () => {
		// api to delete PP schedule
		api.delete(`/seller/store/product/promote/schedule/${pid}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				// Removing deleted PP
				const newPPdetails = PPdetails.filter(
					(prod) => prod._id !== pid
				);
				setPPdetails(newPPdetails);
				// setSnackBar({
				// 	...snackBarstate,
				// 	type: "success",
				// 	message: "SUCCESS: Schuduled Promotiom has been deleted!",
				// 	open: true,
				// });
			})
			.catch((error) => {
				// setSnackBar({
				// 	...snackBarstate,
				// 	type: "error",
				// 	message: "ERROR: Something went wrong!",
				// 	open: true,
				// });
				console.log("error");
			});
		setIsDeletingPP(false);
	};

	// Edit Product Modal Settings here
	const [editModalOpen, setEditModalOpen] = useState(false);
	const handleEditModalOpen = () => {
		setEditModalOpen(true);
	};
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState(new Date());
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};
	const handleTimeChange = (time) => {
		setSelectedTime(time);
	};

	const [setSPdetails] = useState({});

	const handlerUpdatePP = async () => {
		let date = selectedDate.toLocaleString().split(", ")[0];
		let time = selectedTime.toLocaleTimeString();

		await api
			.patch(
				`/seller/store/product/promote/schedule/${pid}`,
				{
					promotion_Time: time,
					promotion_date: date,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then((res) => console.log(res))
			.catch((error) => console.log("ERROR: " + error));
	};

	const getAllSchedulePromotions = async () => {
		await api
			.get("/seller/store/products/promote/schedule", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setPPdetails(res.data.data.promotions))
			.catch((error) => console.log("ERROR: " + error));
	};

	useEffect(() => {
		getAllSchedulePromotions();
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Scheduled Promotions"
					data={PPdetails}
					columns={columns}
					actions={[
						(rowData) => ({
							icon: () => <EditIcon />,
							tooltip: "Edit",
							onClick: (event, rowData) => {
								setPid(rowData._id);
								setSPdetails(rowData);
								handleEditModalOpen();
							},
						}),
						(rowData) => ({
							icon: () => <DeleteIcon />,
							tooltip: "Delete",
							onClick: (event, rowData) => {
								setPid(rowData._id);
								handlerDeletePP();
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
				/>
			</Grid>

			{/* Edit Product */}
			<Modal
				open={editModalOpen}
				onClose={handleEditModalClose}
				onBackdropClick={handleEditModalClose}
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
						<Grid item xs={12} sm={12} md={12} lg={12}>
							<Typography variant="h5" gutterBottom>
								Update Date/Time of Promotion
							</Typography>
							<Divider />
							<form style={{ margin: 20 }}>
								<Grid container spacing={2} align="center">
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardDatePicker
												margin="normal"
												label="Select New Date"
												format="yyyy/MM/dd"
												value={selectedDate}
												onChange={handleDateChange}
											/>
										</MuiPickersUtilsProvider>
									</Grid>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<MuiPickersUtilsProvider
											utils={DateFnsUtils}
										>
											<KeyboardTimePicker
												margin="normal"
												label="Select New Time"
												value={selectedTime}
												onChange={handleTimeChange}
											/>
										</MuiPickersUtilsProvider>
									</Grid>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										align="center"
										style={{ marginTop: 10 }}
									>
										<Button
											variant="outlined"
											color="primary"
											style={{ marginRight: 10 }}
											onClick={handleEditModalClose}
										>
											Cancel
										</Button>
										<Button
											variant="contained"
											color="primary"
											onClick={handlerUpdatePP}
										>
											Save Changes
										</Button>
									</Grid>
								</Grid>
							</form>
						</Grid>
					</Grid>
				</Container>
			</Modal>

			{/* Delete Scheduled Promotion */}
			<DeleteScheduledPromotion
				DeletingPP={isDeletingPP}
				setDeletingPP={setIsDeletingPP}
				confirmedDelete={confirmedDelete}
			/>
		</Grid>
	);
}
