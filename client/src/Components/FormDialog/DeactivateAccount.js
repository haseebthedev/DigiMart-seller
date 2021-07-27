import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeactivateAccount(props) {
	const handleClose = () => {
		props.setDeactivatingAccount(false);
	};

	const confirmDeactivate = () => {
		props.confirmedDeactivate();
	};

	return (
		<div>
			<Dialog open={props.DeactivatingAccount} onClose={handleClose}>
				<DialogTitle>Account Deactivation</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to deactivate your Vendor Account?
					</DialogContentText>
					<DialogContentText color="error">
						Warning: Deactivating your Vendor account would make
						your Store unpublished from DigiMart thus you wouldn't
						be able to sell your products.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={confirmDeactivate}
						color="primary"
						variant="contained"
					>
						DEACTIVATE
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
