import React, { useState } from "react";
import api from "../../../Axios/api";
import {
	Button,
	TextField,
	Container,
	Grid,
	Paper,
	Avatar,
	Typography,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useUserContext } from "../../../context/UserContext";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import HelpIcon from "@material-ui/icons/Help";
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

	const [ProbDetails, setProbDetails] = useState({
		subject: "",
		description: "",
		screenShot: "",
	});

	const handlerProbDetails = (input) => (e) => {
		setProbDetails({ ...ProbDetails, [input]: e.target.value });
	};

	async function uploadImage(file) {
		const NAME_OF_UPLOAD_PRESET = "ddyaz57o";
		const YOUR_CLOUDINARY_ID = "dbsd56hgh";

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", NAME_OF_UPLOAD_PRESET);
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${YOUR_CLOUDINARY_ID}/image/upload`,
			{
				method: "POST",
				body: data,
			}
		);
		const img = await res.json();
		return img.secure_url;
	}

	const fileHandler = async (event) => {
		let files = event.target.files;
		let temp = await uploadImage(files[0]);
		setProbDetails({ ...ProbDetails, screenShot: temp });
	};

	const [IFerrors, setIFerrors] = useState({
		subjectError: "",
		descriptionError: "",
	});

	const InputValidation = () => {
		const errors = {};
		var hasError = false;

		// subject
		var textFormat = /^[A-Za-z0-9.,'!()#&+-\s]+$/;
		if (ProbDetails.subject.match(textFormat)) {
			errors.subjectError = "";
		} else {
			hasError = true;
			errors.subjectError =
				"Invalid Input. Name cannot contains several Special Characters!";
		}

		// description
		if (ProbDetails.description.match(textFormat)) {
			errors.descriptionError = "";
		} else {
			hasError = true;
			errors.descriptionError =
				"Description contains several characters that aren't allowed!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const HandlerReportAProblem = async () => {
		var hasError = InputValidation();

		if (hasError === false) {
			await api
				.post(
					`/seller/reportProblem`,
					{ ...ProbDetails },
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => {
					setSnackBar({
						...snackBarstate,
						type: "success",
						message: "SUCCESS: You Problem has been Reported!",
						open: true,
					});
					setProbDetails({
						subject: "",
						description: "",
						screenShot: "",
					});
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
		}
	};

	return (
		<Grid container className={classes.root}>
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
										className={
											classes.avatarInProfileSetting
										}
									>
										<HelpIcon
											className={
												classes.avatarInProfileSetting
											}
										/>
									</Avatar>
									<Typography variant="h5" color="primary">
										Report a Problem
									</Typography>
								</div>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									label="Subject"
									placeholder="Server is Down etc."
									value={ProbDetails.subject}
									onChange={handlerProbDetails("subject")}
									helperText={IFerrors.subjectError}
									error={
										IFerrors.subjectError.length > 0
											? true
											: false
									}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									multiline
									placeholder="Explain problem here."
									label="Description"
									value={ProbDetails.description}
									onChange={handlerProbDetails("description")}
									helperText={IFerrors.descriptionError}
									error={
										IFerrors.descriptionError.length > 0
											? true
											: false
									}
								/>

								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										marginTop: 20,
										marginBottom: 5,
										padding: 20,
										height: 110,
										border: "1px solid #c4c4c4",
										borderRadius: 6,
									}}
								>
									{ProbDetails.screenShot === "" ? (
										<Typography>
											No Image Uploaded!
										</Typography>
									) : (
										<Grid item align="center">
											<img
												src={ProbDetails.screenShot}
												alt="Prob-images"
												width="60px"
												height="60px"
												style={{
													border: "3px solid #e1e1e1",
													padding: "2px",
												}}
											/>
										</Grid>
									)}
								</div>

								<Grid
									item
									style={{ marginBottom: 10 }}
									align="left"
								>
									<div>
										<label htmlFor="contained-button-file">
											<Button
												size="small"
												startIcon={
													<AddPhotoAlternateIcon />
												}
												variant="outlined"
												color="primary"
												component="span"
											>
												Upload Image
											</Button>
										</label>
										<input
											id="contained-button-file"
											type="file"
											accept="image/png, image/jpeg"
											onChange={fileHandler}
											hidden
										/>
									</div>
								</Grid>

								<Button
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									onClick={HandlerReportAProblem}
								>
									Send Response
								</Button>
							</form>
						</Grid>
					</div>
				</Container>
			</Grid>

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
	);
}
