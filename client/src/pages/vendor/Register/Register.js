import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

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

import AccountForm from "./AccountForm";
import Store from "./Store";
import PaymentForm from "./PaymentForm";
import Finalizing from "./Finalizing";

const steps = ["Account", "Store", "Payment", "Finalizing"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AccountForm />;
    case 1:
      return <Store />;
    case 2:
      return <PaymentForm />;
    case 3:
      return <Finalizing />;
    default:
      throw new Error("Unknown step");
  }
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Digi-Mart
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Register() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="secondary" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" color="background" noWrap>
            Digi-Mart
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Registration for Vendor
          </Typography>
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
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Register" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}
