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

	// states
	const [state, setState] = useState({
		name: "",
		category: "sports",
		biography: "A place to have trust.",
		warehouseAddress: "Street No. 231, 2484  Fairfield Road",
		physicalAddress: "Street No. 231, 2484  Fairfield Road",
		city: "Islamabad",
		country: "Pakistan",
		type: "individual",
		bankHolderName: "Haseeb Ahmed",
		bankName: "Meezan Bank Ltd.",
		accountNumber: "213213123612312",
		routingNumber: "21312312",
		checkAgreement: false,
	});

	const handleChange = (input) => (e) => {
		setState({ ...state, [input]: e.target.value });
	};
	const handleFinalize = (input) => (e) => {
		setState({ ...state, [input]: e.target.checked });
	};

	const handleNext = async () => {
		setActiveStep(activeStep + 1);

		// Saving Store/Payment data to Server
		if (activeStep === steps.length - 1) {
			const isStoreRegistered = true;
			const vendorData = { ...store.data.data, isStoreRegistered };
			const token = store.data.token;

			completeRegistration(dispatch, vendorData, token);
			props.setCompleteRegis(false);

			const {
				name,
				category,
				biography,
				warehouseAddress,
				physicalAddress,
				city,
				country,
				type,
				bankHolderName,
				bankName,
				accountNumber,
				routingNumber,
				checkAgreement,
			} = state;

			// SAVING STORE DETAILS INTO DATABASE
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
				.then((res) => console.log("Store Saved. RES: ", res))
				.catch((error) => console.log("Error: " + error));

			// SAVING PAYMENT DETAILS INTO DATABASE
			await api
				.patch(
					"/seller/addPaymentAccount",
					{
						// change this name
						AccountHolderName: bankHolderName,
						bankName,
						accountNumber,
						routingNumber,
						isStoreRegistered: checkAgreement,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => console.log("Payment Saved", res))
				.catch((error) => console.log("Error: " + error));

			await api
				.patch(
					"/seller/store/register",
					{
						name,
						city,
						category,
						warehouseAddress,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				.then((res) => console.log("Stored Registerd!!"))
				.catch((error) => console.log("Error: " + error));

			console.log("Registration has been completed...");
		}
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const getStepContent = (step) => {
		switch (step) {
			case 1:
				return <Store values={state} handleChange={handleChange} />;
			case 2:
				return (
					<PaymentForm values={state} handleChange={handleChange} />
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
							{activeStep !== 1 && (
								<Button
									onClick={handleBack}
									className={classes.button}
								>
									Back
								</Button>
							)}
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
									? "Save"
									: "Next"}
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
