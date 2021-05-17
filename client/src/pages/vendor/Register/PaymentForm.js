import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export default function PaymentForm() {
  return (
    <React.Fragment>
      <Typography variant="h6">Payment method</Typography>
      <Typography
        variant="subtitle2"
        color="error"
        style={{ marginBottom: "20px" }}
      >
        This information will be used to withdraw earnings from accounts.
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Linking a Bank Account
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: "15px" }}>
        <Grid item xs={12} md={6}>
          <TextField required id="firstName" label="First Name" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField required id="lastName" label="Last Name" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="accountNumber"
            label="Account Number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField required id="branchCode" label="Branch Code" fullWidth />
        </Grid>
      </Grid>
      <Typography variant="subtitle1" align="center">
        Adding a Credit Card (Optional)
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: "15px" }}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
