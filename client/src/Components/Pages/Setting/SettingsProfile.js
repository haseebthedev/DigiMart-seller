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
		name: "",
		email: "",
		phoneNumber: "",
		isDarkModeEnabled: false,
		isNotificationsEnabled: false,
	});

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		emailError: "",
		phoneNumberError: "",
	});

	const [isLoggedOut, setIsLoggedOut] = useState(false);
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
				// setIsLoggedOut(true);
				// return logoutUser(dispatch);
				console.log("delete account...");
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

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// name
		var noNumber = /^([^0-9]*)$/;
		if (profileData.name.match(noNumber)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError =
				"Name cannot contains Numbers or Special Characters!";
		}

		// email
		// eslint-disable-next-line
		var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (profileData.email.match(mailFormat)) {
			errors.emailError = "";
		} else {
			hasError = true;
			errors.emailError = "Entered Email address is invalid!";
		}

		// phone
		var phoneFormat = /^(\+92)?[0-9]{10}$/;
		if (profileData.phoneNumber.match(phoneFormat)) {
			errors.phoneNumberError = "";
		} else {
			hasError = true;
			errors.phoneNumberError = "Entered Phone Number is invalid!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	// UPDATE REQUEST SENDING HERE
	const handleSubmitUpdate = async () => {
		var errorExists = InputValidation();

		if (errorExists === false) {
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
		}
	};

	// Modal Settings here
	const [modalOpen, setModelOpen] = React.useState(false);

	const handleOpen = () => {
		setModelOpen(true);
	};

	const handleClose = () => {
		setModelOpen(false);
	};

	const getProfileDetails = () => {
		api.get("/seller/personalDetails", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				const {
					profilePic,
					name,
					email,
					phoneNumber,
					isDarkModeEnabled,
					isNotificationsEnabled,
				} = res.data.data.seller;

				setProfileData({
					profilePic,
					name,
					email,
					phoneNumber,
					isDarkModeEnabled,
					isNotificationsEnabled,
				});
			})
			.catch((error) =>
				setSnackBar({
					...snackBarstate,
					type: "error",
					message:
						"ERROR: System is busy or not responding at the moment!",
					open: true,
				})
			);
	};

	useEffect(() => {
		getProfileDetails();
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
									value={profileData.name}
									onChange={handleChange("name")}
									helperText={IFerrors.nameError}
									error={
										IFerrors.nameError.length > 0
											? true
											: false
									}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									value={profileData.email}
									onChange={handleChange("email")}
									helperText={IFerrors.emailError}
									error={
										IFerrors.emailError.length > 0
											? true
											: false
									}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="phone"
									label="Phone No."
									name="phoneNumber"
									placeholder="+923XXXXXXXXX"
									inputProps={{ maxLength: 13 }}
									value={profileData.phoneNumber}
									onChange={handleChange("phoneNumber")}
									helperText={IFerrors.phoneNumberError}
									error={
										IFerrors.phoneNumberError.length > 0
											? true
											: false
									}
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
