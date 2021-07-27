import React, { useState } from "react";
import api from "../../../Axios/api";
import {
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	TextField,
	Container,
	Grid,
	Avatar,
	Modal,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useUserContext } from "../../../context/UserContext";
import { Redirect } from "react-router-dom";
import ImageCrop from "../../ImageCropDialog/ImageCrop";

import RemoveStoreLogo from "../../FormDialog/RemoveStoreLogo";

import useStyles from "./styles";

export default function VendorCenter() {
	const classes = useStyles();

	// context
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

	const [storeData, setStoreData] = useState({
		logo: null,
		name: "Haseeb Ahmed",
		biography: "We love to sell products online",
		category: "Electronic",
		warehouseAddress: "Street # 213, Block-F, Satellite Town",
	});
	const [isLoggedOut] = useState(false);
	const [isStoreLogoRemove, setStoreLogoRemove] = useState(false);

	const onSelectlogo = (image) => {
		setStoreData({ ...storeData, logo: image });
	};
	const handleChange = (input) => (e) => {
		setStoreData({ ...storeData, [input]: e.target.value });
	};

	// UPDATE REQUEST SENDING HERE
	const handleSubmitUpdate = () => {
		api.patch(
			"/seller/store/me",
			{
				...storeData,
			},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then((res) =>
				setSnackBar({
					...snackBarstate,
					type: "success",
					message: "Your Store has been updated!",
					open: true,
				})
			)
			.catch((error) =>
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: " +
						JSON.stringify(error.response.data.error.message),
					open: true,
				})
			);
	};

	// Modal Settings here
	const [modalOpen, setModelOpen] = React.useState(false);

	const handleOpen = () => {
		setModelOpen(true);
	};

	const handleClose = () => {
		setModelOpen(false);
	};

	// Show delete ProfilePic dialog
	const handlerRemoveStoreLogo = (e) => {
		e.preventDefault();
		setStoreLogoRemove(true);
	};

	const confirmedRemoveStoreLogo = () => {
		setStoreData({ ...storeData, logo: null });
		setStoreLogoRemove(false);
	};

	let currentValue = storeData.category || "DEFAULT";

	return (
		<Grid container className={classes.root}>
			{isLoggedOut ? <Redirect to="/vendor/login" /> : ""}
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<Container component="div" maxWidth="sm">
					<div className={classes.paper}>
						<Grid className={classes.settingsSpacing}>
							<form className={classes.form}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-evenly",
										alignItems: "center",
										marginBottom: "20px",
									}}
								>
									<Avatar
										alt="profile photo"
										src={storeData.logo}
										className={
											classes.avatarInProfileSetting
										}
									>
										{"LOGO HERE"}
									</Avatar>
									<div>
										<Button
											color="primary"
											onClick={handleOpen}
										>
											Upload
										</Button>
										<Button
											onClick={handlerRemoveStoreLogo}
										>
											Remove Image
										</Button>
									</div>
								</div>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="name"
									label="Store Name"
									name="storeName"
									defaultValue={storeData.name}
									onChange={handleChange("name")}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="biography"
									label="Biography"
									name="biography"
									defaultValue={storeData.biography}
									onChange={handleChange("biography")}
								/>

								<FormControl fullWidth>
									<InputLabel style={{ marginLeft: "10px" }}>
										Category
									</InputLabel>
									<Select
										variant="outlined"
										value={currentValue}
										defaultValue={"DEFAULT"}
										onChange={handleChange("category")}
										align="left"
										style={{ marginTop: "20px" }}
									>
										<MenuItem value="DEFAULT" disabled>
											Choose a Category...
										</MenuItem>
										<MenuItem value="Electronic">
											Electronics
										</MenuItem>
										<MenuItem value="Health">
											Health and Beauty
										</MenuItem>
										<MenuItem value="Groceries">
											Groceries & Pets
										</MenuItem>
										<MenuItem value="Lifestyle">
											Home & Lifestyle
										</MenuItem>
										<MenuItem value="fashion">
											Fashion & Clothing
										</MenuItem>
										<MenuItem value="sports">
											Sports
										</MenuItem>
										<MenuItem value="automotive">
											Automotive and Bikes
										</MenuItem>
									</Select>
								</FormControl>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="warehouseAddress"
									label="Warehouse Address"
									name="warehouseAddress"
									defaultValue={storeData.warehouseAddress}
									onChange={handleChange("warehouseAddress")}
								/>

								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={handleSubmitUpdate}
								>
									SAVE CHANGES
								</Button>
							</form>
						</Grid>
					</div>
					<RemoveStoreLogo
						RemoveStoreLogo={isStoreLogoRemove}
						setStoreLogoRemove={setStoreLogoRemove}
						confirmedRemoveStoreLogo={confirmedRemoveStoreLogo}
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
				</Container>
			</Grid>
			<Modal
				open={modalOpen}
				onClose={handleClose}
				onBackdropClick={handleClose}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						backgroundColor: "#FFF",
						width: "70vw",
						height: "70vh",
						padding: "20px",
						position: "relative",
					}}
				>
					<ImageCrop
						onProfileChange={onSelectlogo}
						handleClose={handleClose}
					/>
				</div>
			</Modal>
		</Grid>
	);
}
