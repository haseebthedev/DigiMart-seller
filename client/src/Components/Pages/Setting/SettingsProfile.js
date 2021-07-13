import React, { useState } from "react";
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
} from "@material-ui/core";
import FileBase64 from "react-file-base64";
import { Redirect } from "react-router-dom";
import { useUserContext, logoutUser } from "../../../context/UserContext";
import useStyles from "./styles";

// components
import DeleteAccount from "../../FormDialog/DeleteAccount";
import DeactivateAccount from "../../FormDialog/DeactivateAccount";

export default function VendorCenter() {
	const classes = useStyles();

	// context
	const { store, dispatch } = useUserContext();
	const token = store.data.token;

	const [profileData, setProfileData] = useState({
		profilePic: "",
		name: "Haseeb Ahmed",
		email: "haseeb@gmail.com",
		phoneNumber: "+923455488210",
		isDarkModeEnabled: false,
		isNotificationsEnabled: true,
	});
	const [isLoggedOut, setIsLoggedOut] = React.useState(false);

	const [isDeletingAccount, setIsDeletingAccount] = useState(false);
	const [isDeactivatingAccount, setIsDeactivatingAccount] = useState(false);

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

	const onProfileChange = (files) => {
		setProfileData({ ...profileData, profilePic: files.base64 });
	};
	const handleChange = (input) => (e) => {
		setProfileData({ ...profileData, [input]: e.target.value });
	};
	const handleChangeSwitch = (input) => (e) => {
		setProfileData({ ...profileData, [input]: e.target.checked });
	};

	// UPDATE REQUEST SENDING HERE
	const handleSubmitUpdate = () => {
		api.patch(
			"/seller/me",
			{
				...profileData,
			},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then((res) => console.log("Profile Updated. RES: ", res))
			.catch((error) => console.log("Error: " + error));
	};

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
										justifyContent: "space-between",
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
									<FileBase64
										size="60"
										multiple={false}
										onDone={onProfileChange}
									/>
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

								<FormControlLabel
									margin="normal"
									control={
										<Switch
											color="secondary"
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
								/>
								<FormControlLabel
									margin="normal"
									control={
										<Switch
											color="secondary"
											checked={
												profileData.isNotificationsEnabled
											}
											onChange={handleChangeSwitch(
												"isNotificationsEnabled"
											)}
										/>
									}
									label="Receive system Notifications"
									labelPlacement="start"
									className={classes.switch}
								/>

								<Button
									fullWidth
									variant="contained"
									color="secondary"
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
				</Container>
			</Grid>
		</Grid>
	);
}
