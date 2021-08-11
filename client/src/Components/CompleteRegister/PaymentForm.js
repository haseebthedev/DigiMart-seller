import React from "react";
import { Typography, Grid, TextField } from "@material-ui/core";

export default function PaymentForm(props) {
	// coming from dashboard page
	const { values, handleChange, IFerrors } = props;

	return (
		<React.Fragment>
			<Typography variant="h6">Payment method</Typography>
			<Typography
				variant="subtitle2"
				color="error"
				style={{ marginBottom: "20px" }}
			>
				This information will be used to withdraw earnings from
				accounts.
			</Typography>
			<Typography variant="subtitle1" gutterBottom>
				Linking a Foreign Bank Account
			</Typography>
			<Grid
				container
				spacing={3}
				style={{ marginTop: 10, marginBottom: "5px" }}
			>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						required
						label="Account Holder Name"
						fullWidth
						defaultValue={values.bankHolderName}
						onChange={handleChange("bankHolderName")}
						helperText={IFerrors.BankHolderNameError}
						error={
							IFerrors.BankHolderNameError.length > 0
								? true
								: false
						}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						required
						label="Bank Name"
						fullWidth
						defaultValue={values.bankName}
						onChange={handleChange("bankName")}
						helperText={IFerrors.bankNameError}
						error={IFerrors.bankNameError.length > 0 ? true : false}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						required
						id="iban"
						label="Account Number"
						fullWidth
						defaultValue={values.accountNumber}
						onChange={handleChange("accountNumber")}
						helperText={IFerrors.accountNumberError}
						error={
							IFerrors.accountNumberError.length > 0
								? true
								: false
						}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						label="Branch Code"
						fullWidth
						defaultValue={values.branchCode}
						onChange={handleChange("branchCode")}
						helperText={IFerrors.branchCodeError}
						error={
							IFerrors.branchCodeError.length > 0 ? true : false
						}
					/>
				</Grid>
			</Grid>

			{/* <Typography variant="subtitle1" align="center" gutterBottom>
        Linking a Local Bank Account
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: "15px" }}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="banckAccountTitle"
            label="Banck Account Title"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="accountNumber"
            label="Account No."
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField required id="bankName" label="Bank Name" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField required id="branchCode" label="Branch Code" fullWidth />
        </Grid>
      </Grid> */}
			{/* <Typography variant="subtitle1" align="center">
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
        */}
		</React.Fragment>
	);
}
