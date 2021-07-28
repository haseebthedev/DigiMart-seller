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
		props.setIsDeletingPayMethod(false);
	};

	const confirmDelete = () => {
		props.confirmedDeletePayment();
	};

	return (
		<div>
			<Dialog open={props.DeletingPayMethod} onClose={handleClose}>
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
