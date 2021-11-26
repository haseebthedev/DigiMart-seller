import React, { useState } from "react";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import PersonIcon from "@material-ui/icons/Person";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PaymentIcon from "@material-ui/icons/Payment";
import DoneIcon from "@material-ui/icons/Done";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
	useStyles,
	ColorlibConnector,
	useColorlibStepIconStyles,
} from "./styles";
import Store from "./Store";
import PaymentForm from "./PaymentForm";
import Finalizing from "./Finalizing";
import api from "../../Axios/api";
import {
	useUserContext,
	completeRegistration,
} from "../../context/UserContext";

export default function CompleteRegister(props) {
	const classes = useStyles();
	const steps = ["Account", "Store", "Payment", "Finalizing"];
	const [activeStep, setActiveStep] = useState(1);

	// context
	const { store, dispatch } = useUserContext();
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

	// states
	const [state, setState] = useState({
		name: "",
		category: "DEFAULT",
		biography: "A place to have trust.",
		warehouseAddress: "Block-F, Satellite Town, Lahore",
		physicalAddress: "Street No. 231, 2484  Fairfield Road",
		city: "Islamabad",
		country: "Pakistan",
		type: "individual",
		paymentMethod: "STRIPE",
		AccountHolderName: "",
		accountNumber: "",
		checkAgreement: false,
	});

	const [IFerrors, setIFerrors] = useState({
		nameError: "",
		categoryError: "",
		biographyError: "",
		cityError: "",
		countryError: "",
		warehouseAddressError: "",
		physicalAddressError: "",

		AccountHolderNameError: "",
		accountNumberError: "",
	});

	const handleChange = (input) => (e) => {
		setState({ ...state, [input]: e.target.value });
	};
	const handleFinalize = (input) => (e) => {
		setState({ ...state, [input]: e.target.checked });
	};

	const StoreInputValidation = () => {
		const errors = {};
		var hasError = false;

		// store name
		var noSpecial = /^[^*|":<>[\]{}`\\'();@&$]+$/;
		if (state.name.match(noSpecial)) {
			errors.nameError = "";
		} else {
			hasError = true;
			errors.nameError = "Name cannot contains Special Characters!";
		}

		// store category
		if (state.category.match("DEFAULT")) {
			hasError = true;
			errors.categoryError = "Please Choose a Store Category!";
		} else {
			errors.categoryError = "";
		}

		// biography
		var bioFormat = /^[a-zA-Z0-9-@#!&$,.{1}\s]*$/;
		if (state.biography.match(bioFormat) && state.biography.length > 10) {
			errors.biographyError = "";
		} else {
			hasError = true;
			errors.biographyError = "Kindly enter a short Biography.";
		}

		// city
		var cityFormat = /^[a-zA-Z]*$/;
		if (state.city.match(cityFormat) && state.city.length > 3) {
			errors.cityError = "";
		} else {
			hasError = true;
			errors.cityError = "Kindly Enter Valid City Name!";
		}

		// Country
		var countryFormat = /^[a-zA-Z]*$/;
		if (state.country.match(countryFormat) && state.country.length > 3) {
			errors.countryError = "";
		} else {
			hasError = true;
			errors.countryError = "Kindly Enter Valid Country Name!";
		}

		// Warehouse/Physical Address
		var addressFormat = /^[a-zA-Z0-9.,-@#&\s]*$/;

		if (
			state.physicalAddress.match(addressFormat) &&
			state.physicalAddress.length > 10
		) {
			errors.physicalAddressError = "";
		} else {
			hasError = true;
			errors.physicalAddressError =
				"Kindly Enter a Valid Physical Address!";
		}

		if (state.warehouseAddress.match(addressFormat)) {
			errors.warehouseAddressError = "";
		} else {
			hasError = true;
			errors.warehouseAddressError =
				"Kindly Enter a Valid Warehouse Address!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const PaymentInputValidation = () => {
		const errors = {};
		var hasError = false;

		// Account Holder name
		var noSpecAndNum = /^[^0-9*|?^#!"-:<>[\]{}`\\'();@&$]+$/;
		if (
			state.AccountHolderName.match(noSpecAndNum) &&
			!state.AccountHolderName.match(/\s{2}/) &&
			state.AccountHolderName.length > 2
		) {
			errors.AccountHolderNameError = "";
		} else {
			hasError = true;
			errors.AccountHolderNameError = "Please enter your Valid Name";
		}

		// Account No.
		if (
			!state.accountNumber.match(/\s{1}/) &&
			state.accountNumber.length > 5
		) {
			errors.accountNumberError = "";
		} else {
			hasError = true;
			errors.accountNumberError = "Please enter your Valid Stripe ID";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const handleNext = async () => {
		// Store Registration
		if (activeStep === 1) {
			var StoreErrorExists = StoreInputValidation();

			if (StoreErrorExists === false) {
				// SAVING STORE DETAILS INTO DATABASE
				const {
					name,
					category,
					biography,
					warehouseAddress,
					physicalAddress,
					city,
					country,
					type,
				} = state;

				await api
					.post(
						"/seller/store/register",
						{
							name,
							category,
							city,
							country,
							type,
							warehouseAddress,
							buissnessAddress: physicalAddress,
							biography,
						},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					)
					.then((res) => {
						setSnackBar({
							...snackBarstate,
							type: "success",
							message: "SUCCESS: Your Store has been created!",
							open: true,
						});
					})
					.catch((error) => {
						setSnackBar({
							...snackBarstate,
							type: "error",
							message:
								"ERROR: " +
								JSON.stringify(
									error.response.data.error.message
								),
							open: true,
						});
					});

				setActiveStep(activeStep + 1);
			}
		}

		// Adding Payment Method
		if (activeStep === 2) {
			var PayErrorExists = PaymentInputValidation();

			if (PayErrorExists === false) {
				const { paymentMethod, AccountHolderName, accountNumber } =
					state;

				await api
					.patch(
						"/seller/addPaymentAccount",
						{
							// change this name
							isPrimaryAccount: true,
							paymentMethod,
							AccountHolderName,
							accountNumber,
						},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					)
					.then((res) => {
						setSnackBar({
							...snackBarstate,
							type: "success",
							message: "Your Payment Method has been saved!",
							open: true,
						});
					})
					.catch((error) => {
						setSnackBar({
							...snackBarstate,
							type: "error",
							message:
								"ERROR: " +
								JSON.stringify(
									error.response.data.error.message
								),
							open: true,
						});
					});

				setActiveStep(activeStep + 1);
			}
		}

		// Finalizing the Registration
		if (activeStep === 3) {
			setActiveStep(activeStep + 1);

			let isStoreRegistered = true;
			let vendorData = {
				...store.data.data,
				isStoreRegistered,
			};
			let token = store.data.token;

			completeRegistration(dispatch, vendorData, token);
			props.setCompleteRegis(false);
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 1:
				return (
					<Store
						values={state}
						handleChange={handleChange}
						IFerrors={IFerrors}
					/>
				);
			case 2:
				return (
					<PaymentForm
						values={state}
						handleChange={handleChange}
						IFerrors={IFerrors}
					/>
				);
			case 3:
				return (
					<Finalizing values={state} handleChange={handleFinalize} />
				);
			default:
				throw new Error("Unknown step");
		}
	};

	return (
		<React.Fragment>
			<Stepper
				activeStep={activeStep}
				className={classes.stepper}
				connector={<ColorlibConnector />}
			>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel StepIconComponent={ColorlibStepIcon}>
							<Typography
								variant="body2"
								className={classes.stepperLabel}
							>
								{label}
							</Typography>
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<React.Fragment>
				{activeStep === steps.length ? (
					<React.Fragment>
						<Typography variant="h5" gutterBottom align="center">
							Thank you for your registration.
						</Typography>
						<Typography variant="subtitle1" align="justify">
							Your application is being reviewed. We have emailed
							your registration confirmation, and will send you an
							update when your application gets approval.
						</Typography>
					</React.Fragment>
				) : (
					<React.Fragment>
						{getStepContent(activeStep)}
						<div className={classes.buttons}>
							<Button
								disabled={
									activeStep === steps.length - 1 &&
									state.checkAgreement === false
										? true
										: false
								}
								variant="contained"
								color="primary"
								onClick={handleNext}
								className={classes.button}
							>
								{activeStep === steps.length - 1
									? "FINISH"
									: "SAVE"}
							</Button>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>

			{/*  Snackbar Alert */}
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
		</React.Fragment>
	);
}

function ColorlibStepIcon(props) {
	const classes = useColorlibStepIconStyles();
	const { active, completed } = props;
	const icons = {
		1: <PersonIcon />,
		2: <StorefrontIcon />,
		3: <PaymentIcon />,
		4: <DoneIcon />,
	};

	return (
		<div
			className={clsx(classes.root, {
				[classes.active]: active,
				[classes.completed]: completed,
			})}
		>
			{icons[String(props.icon)]}
		</div>
	);
}

ColorlibStepIcon.propTypes = {
	active: PropTypes.bool,
	completed: PropTypes.bool,
	icon: PropTypes.node,
};
