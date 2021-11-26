import React from "react";
import {
	Typography,
	Grid,
	TextField,
	Select,
	MenuItem,
} from "@material-ui/core";

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
				Linking a Stripe Payment Account
			</Typography>
			<Grid container spacing={3} style={{ marginTop: 5 }}>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Username"
						placeholder="Haseeb Butt etc."
						onChange={handleChange("AccountHolderName")}
						helperText={IFerrors.AccountHolderNameError}
						error={
							IFerrors.AccountHolderNameError.length > 0
								? true
								: false
						}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Stripe ID"
						placeholder="acct_1JKPRS2eJzfRUora etc."
						onChange={handleChange("accountNumber")}
						helperText={IFerrors.accountNumberError}
						error={
							IFerrors.accountNumberError.length > 0
								? true
								: false
						}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
