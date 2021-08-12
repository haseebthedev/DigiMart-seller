import React, { useState } from "react";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
} from "@material-ui/core";
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
		bankHolderName: "",
		bankName: "",
		branchCode: "",
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

		BankHolderNameError: "",
		bankNameError: "",
		branchCodeError: "",
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
		if (state.bankHolderName.match(noSpecAndNum)) {
			errors.BankHolderNameError = "";
		} else {
			hasError = true;
			errors.BankHolderNameError =
				"Please enter your Valid Account Holder Name.";
		}

		// Bank name
		var bankNameFormat = /^[A-Za-z\s]+$/;
		if (state.bankName.match(bankNameFormat)) {
			errors.bankNameError = "";
		} else {
			hasError = true;
			errors.bankNameError = "Please enter your Valid Bank Name.";
		}

		// Account No.
		var accountFormat = /^\w{1,16}$/;
		if (state.accountNumber.match(accountFormat)) {
			errors.accountNumberError = "";
		} else {
			hasError = true;
			errors.accountNumberError =
				"Please enter your Valid Bank Account Number (IBAN)";
		}

		// Account No.
		var branchCodeFormat = /^[A-Za-z]{4}[a-zA-Z0-9]*/;
		if (state.branchCode.match(branchCodeFormat)) {
			errors.branchCodeError = "";
		} else {
			hasError = true;
			errors.branchCodeError =
				"Please enter your Valid Branch Code or Contact your Bank!";
		}

		setIFerrors({ ...IFerrors, ...errors });
		return hasError;
	};

	const handleNext = async () => {
		if (activeStep === 1) {
			var StoreErrorExists = StoreInputValidation();
			console.log("Store page", activeStep);

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
					.then((res) => console.log("res", res))
					.catch((error) => console.log("Error: " + error));

				setActiveStep(activeStep + 1);
			}
		}

		if (activeStep === 2) {
			var PayErrorExists = PaymentInputValidation();
			console.log("Payments page", activeStep);

			console.log("error status ", IFerrors);

			if (PayErrorExists === false) {
				const { bankHolderName, bankName, accountNumber } = state;

				await api
					.patch(
						"/seller/addPaymentAccount",
						{
							// change this name
							AccountHolderName: bankHolderName,
							bankName,
							accountNumber,
							paymentMethod: "BANK",
							isPrimaryAccount: true,
						},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					)
					.then((res) => console.log("Payment Saved", res))
					.catch((error) => console.log("Error: " + error));
				console.log("Registration has been completed...");

				setActiveStep(activeStep + 1);
			}
		}

		if (activeStep === 3) {
			setActiveStep(activeStep + 1);
			console.log("Finalize page");

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
							{/* {activeStep !== 1 && (
								<Button
									onClick={handleBack}
									className={classes.button}
								>
									Back
								</Button>
							)} */}
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
