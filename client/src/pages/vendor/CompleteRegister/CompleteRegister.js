import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import PersonIcon from "@material-ui/icons/Person";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PaymentIcon from "@material-ui/icons/Payment";
import DoneIcon from "@material-ui/icons/Done";
import "@date-io/date-fns";
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
import axios from "axios";

import {
  useUserContext,
  completeRegistration,
} from "../../../context/UserContext";

export default function CompleteRegister(props) {
  const classes = useStyles();
  const steps = ["Account", "Store", "Payment", "Finalizing"];
  const [activeStep, setActiveStep] = useState(1);

  // context
  const { store, dispatch } = useUserContext();

  // states
  const [state, setState] = useState({
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

  const handleNext = () => {
    setActiveStep(activeStep + 1);

    // Saving Store/Payment data to Server
    if (activeStep === steps.length - 1) {
      const isStoreRegistered = true;
      const vendorData = { ...store.data.data, isStoreRegistered };
      const token = store.data.token;

      completeRegistration(dispatch, vendorData, token);
      props.setCompleteRegis(false);

      const {
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

      const storeURL = "http://localhost:8080/store/register";
      axios
        .post(storeURL, {
          category,
          biography,
          warehouseAddress,
          physicalAddress,
          city,
          country,
          type,
        })
        .then((res) => console.log("Store Saved. RES: ", res))
        .catch((error) => console.log("Error: " + error));

      const paymentURL =
        "http://localhost:8080/seller/addBankDetailsAndRegisterStore";
      axios
        .post(
          paymentURL,
          {
            // change this name
            bankHolderName,
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
        return <PaymentForm values={state} handleChange={handleChange} />;
      case 3:
        return <Finalizing values={state} handleChange={handleFinalize} />;
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Stepper
            activeStep={activeStep}
            className={classes.stepper}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <Typography variant="body2" className={classes.stepperLabel}>
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
                  Your application is being reviewed. We have emailed your
                  registration confirmation, and will send you an update when
                  your application gets approval.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 1 && (
                    <Button onClick={handleBack} className={classes.button}>
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
                    color="secondary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Save" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
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
