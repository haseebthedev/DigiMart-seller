import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeletePaymentMethod(props) {
	const handleClose = () => {
		props.setDeletingMethod(false);
	};

	const confirmDelete = () => {
		props.confirmedDelete();
	};

	return (
		<div>
			<Dialog open={props.DeletingAccount} onClose={handleClose}>
				<DialogTitle>Payment Method Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to delete this Payment Method?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={confirmDelete}
						color="primary"
						variant="contained"
					>
						DELETE
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
