import React, { useEffect } from "react";
import api from "../../../Axios/api";
import {
	Button,
	TextField,
	Grid,
	Link,
	Paper,
	Avatar,
	Typography,
	Container,
} from "@material-ui/core";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";

import useStyles from "./styles";
import { useUserContext } from "../../../context/UserContext";

// component
import DeleteBankDetails from "../../FormDialog/DeleteBankDetails";

export default function EditBankDetails() {
	const classes = useStyles();

	// context
	const { store } = useUserContext();
	const token = store.data.token;

	const [BankDetails, setBankDetails] = React.useState({
		bankHolderName: "",
		accountNumber: "",
		bankName: "",
		routingNumber: "",
	});

	const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

	// updating BankDetails usestate
	const handleChange = (input) => (e) => {
		setBankDetails({ ...BankDetails, [input]: e.target.value });
	};

	// Retriving Old Bank Details
	useEffect(() => {
		api.get("/seller/personalDetails", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then(function (res) {
				const oldBankDetails = res.data.data;
				setBankDetails(oldBankDetails);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	}, [token]);

	// Request to save here...
	const handlerSaveEdit = () => {
		api.patch(
			"/seller/me",
			{ ...BankDetails },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then((res) => console.log("BanK Details updated..."))
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	// show delete Account Dialog
	const handlerAccountDelete = (e) => {
		e.preventDefault();
		setIsDeletingAccount(true);
	};

	// Delete Account Handler
	const confirmedDelete = () => {
		setIsDeletingAccount(false);

		let bankDetails = {
			bankHolderName: "",
			accountNumber: "",
			bankName: "",
			routingNumber: "",
		};
		console.log("Deleting your account....");

		api.patch(
			"/seller/me",
			{
				...bankDetails,
			},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then((res) => setBankDetails(bankDetails))
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<Container component="div" maxWidth="sm">
					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<LibraryAddIcon />
						</Avatar>
						<Typography variant="h5">Edit Payments</Typography>

						<form className={classes.form}>
							<TextField
								variant="outlined"
								margin="normal"
								fullWidth
								label="Bank Holder Name"
								name="bankHolderName"
								value={BankDetails.bankHolderName}
								onChange={handleChange("bankHolderName")}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								fullWidth
								label="Account Number"
								name="accountNumber"
								value={BankDetails.accountNumber}
								onChange={handleChange("accountNumber")}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								fullWidth
								label="Routing No."
								name="routingNumber"
								value={BankDetails.routingNumber}
								onChange={handleChange("routingNumber")}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								fullWidth
								label="Bank Name"
								name="bankName"
								value={BankDetails.bankName}
								onChange={handleChange("bankName")}
							/>

							<Button
								fullWidth
								variant="contained"
								color="secondary"
								className={classes.submit}
								onClick={handlerSaveEdit}
							>
								SAVE CHANGES
							</Button>
							<Grid container justify="center" spacing={2}>
								<Grid item>
									<Link
										color="error"
										component="button"
										variant="body2"
										onClick={handlerAccountDelete}
									>
										Delete Bank Details
									</Link>
								</Grid>
							</Grid>
						</form>
					</div>
					<DeleteBankDetails
						DeletingAccount={isDeletingAccount}
						setDeletingAccount={setIsDeletingAccount}
						confirmedDelete={confirmedDelete}
					/>
				</Container>
			</Grid>
		</Grid>
	);
}
