import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";
import {
	Link,
	Button,
	TextField,
	FormControlLabel,
	Container,
	Grid,
	Switch,
	Paper,
	Avatar,
	Modal,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
	useUserContext,
	logoutUser,
	updateProfile,
} from "../../../context/UserContext";
import useStyles from "./styles";

// components
import DeleteAccount from "../../FormDialog/DeleteAccount";
import DeactivateAccount from "../../FormDialog/DeactivateAccount";
import RemoveProfilePic from "../../FormDialog/RemoveProfilePic";
import ImageCrop from "../../ImageCropDialog/ImageCrop";

export default function VendorCenter() {
	const classes = useStyles();

	// context
	const { store, dispatch } = useUserContext();
	const token = store.data.token;

	const [profileData, setProfileData] = useState({
		profilePic: null,
		name: store.data.data.name,
		email: store.data.data.email,
		phoneNumber: store.data.data.phoneNumber,
		isDarkModeEnabled: store.data.data.isDarkModeEnabled,
		isNotificationsEnabled: store.data.data.isNotificationsEnabled,
	});

	const [isLoggedOut, setIsLoggedOut] = React.useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);
	const [isDeactivatingAccount, setIsDeactivatingAccount] = useState(false);
	const [isProfilePicRemove, setIsProfilePicRemove] = useState(false);

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

	// show delete Account Dialog
	const handlerAccountDelete = (e) => {
		e.preventDefault();
		setIsDeletingAccount(true);
	};
	// Delete Account Handler
	const confirmedDelete = () => {
		setIsDeletingAccount(false);

		api.delete("/seller/me", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(function (res) {
				setIsLoggedOut(true);
				return logoutUser(dispatch);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	// show deactivating Account Dialog
	const handlerAccountDeactivate = (e) => {
		e.preventDefault();
		setIsDeactivatingAccount(true);
	};
	// Deactivate Account Handler
	const confirmedDeactivate = () => {
		setIsDeactivatingAccount(false);

		api.patch(
			"/seller/deActivateAccount",
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then(function (res) {
				setIsLoggedOut(true);
				return logoutUser(dispatch);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	// Show delete ProfilePic dialog
	const handlerRemoveProfilePic = (e) => {
		e.preventDefault();
		setIsProfilePicRemove(true);
	};

	const confirmedRemoveProfilePic = () => {
		setProfileData({ ...profileData, profilePic: null });
		setIsProfilePicRemove(false);
	};

	const onProfileChange = (image) => {
		setProfileData({ ...profileData, profilePic: image });
	};
	const handleChange = (input) => (e) => {
		setProfileData({ ...profileData, [input]: e.target.value });
	};
	const handleChangeSwitch = (input) => (e) => {
		setProfileData({ ...profileData, [input]: e.target.checked });
	};

	// UPDATE REQUEST SENDING HERE
	const handleSubmitUpdate = async () => {
		await api
			.patch(
				"/seller/me",
				{
					...profileData,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(async (res) => {
				// console.log("before");
				const oldData = store.data.data;
				const newData = { ...oldData, ...profileData };

				setTimeout(function () {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "Your Profile has been updated!",
						open: true,
					});
					setTimeout(function () {
						updateProfile(dispatch, newData, token);
					}, 1000);
				}, 1000);
			})
			.catch((error) =>
				setSnackBar({
					...snackBarstate,
					type: "error",
					message: "ERROR: Something went wrong!",
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

	useEffect(() => {
		const {
			profilePic,
			name,
			email,
			phoneNumber,
			isDarkModeEnabled,
			isNotificationsEnabled,
		} = store.data.data;
		setProfileData({
			profilePic,
			name,
			email,
			phoneNumber,
			isDarkModeEnabled,
			isNotificationsEnabled,
		});
		// eslint-disable-next-line
	}, []);

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
										src={profileData.profilePic}
										className={
											classes.avatarInProfileSetting
										}
									></Avatar>

									<div>
										<Button
											color="primary"
											onClick={handleOpen}
										>
											Upload
										</Button>
										<Button
											onClick={handlerRemoveProfilePic}
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
									label="Username"
									name="username"
									defaultValue={profileData.name}
									onChange={handleChange("name")}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									defaultValue={profileData.email}
									onChange={handleChange("email")}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="phone"
									label="Phone No."
									name="phoneNumber"
									defaultValue={profileData.phoneNumber}
									onChange={handleChange("phoneNumber")}
								/>

								{/* <FormControlLabel
									margin="normal"
									control={
										<Switch
											color="primary"
											checked={
												profileData.isDarkModeEnabled
											}
											onChange={handleChangeSwitch(
												"isDarkModeEnabled"
											)}
										/>
									}
									label="Dark Mode"
									labelPlacement="start"
									className={classes.switch}
								/> */}
								<FormControlLabel
									margin="normal"
									control={
										<Switch
											color="primary"
											checked={
												profileData.isNotificationsEnabled
											}
											onChange={handleChangeSwitch(
												"isNotificationsEnabled"
											)}
										/>
									}
									label="Receive system Notifications: "
									labelPlacement="start"
									className={classes.switch}
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
								<Grid container justify="center" spacing={2}>
									<Grid item>
										<Link
											color="error"
											component="button"
											variant="body2"
											onClick={handlerAccountDeactivate}
										>
											Deactivate Account
										</Link>
									</Grid>
									<Grid item>
										<Link
											color="error"
											component="button"
											variant="body2"
											onClick={handlerAccountDelete}
										>
											Delete Account
										</Link>
									</Grid>
								</Grid>
							</form>
						</Grid>
					</div>
					<DeleteAccount
						DeletingAccount={isDeletingAccount}
						setDeletingAccount={setIsDeletingAccount}
						confirmedDelete={confirmedDelete}
					/>
					<DeactivateAccount
						DeactivatingAccount={isDeactivatingAccount}
						setDeactivatingAccount={setIsDeactivatingAccount}
						confirmedDeactivate={confirmedDeactivate}
					/>
					<RemoveProfilePic
						RemoveProfilePic={isProfilePicRemove}
						setRemoveProfilePic={setIsProfilePicRemove}
						confirmedRemoveProfilePic={confirmedRemoveProfilePic}
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
						onProfileChange={onProfileChange}
						handleClose={handleClose}
					/>
				</div>
			</Modal>
		</Grid>
	);
}
