import React from "react";
import { Typography, Grid, TextField } from "@material-ui/core";

export default function PaymentForm(props) {
	// coming from dashboard page
	const { values, handleChange } = props;

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
			<Typography variant="subtitle1" align="center" gutterBottom>
				Linking a Foreign Bank Account
			</Typography>
			<Grid container spacing={3} style={{ marginBottom: "15px" }}>
				<Grid item xs={12} md={6}>
					<TextField
						required
						label="Bank Holder Name"
						fullWidth
						defaultValue={values.bankHolderName}
						onChange={handleChange("bankHolderName")}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						required
						label="Bank Name"
						fullWidth
						defaultValue={values.bankName}
						onChange={handleChange("bankName")}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						required
						id="iban"
						label="Account Number"
						fullWidth
						defaultValue={values.accountNumber}
						onChange={handleChange("accountNumber")}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						required
						id="routingNumber"
						label="Routing Number"
						fullWidth
						defaultValue={values.routingNumber}
						onChange={handleChange("routingNumber")}
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
