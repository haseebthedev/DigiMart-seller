import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeleteAccount(props) {
	const handleClose = () => {
		props.setDeletingAccount(false);
	};

	const confirmDelete = () => {
		props.confirmedDelete();
	};

	return (
		<div>
			<Dialog open={props.DeletingAccount} onClose={handleClose}>
				<DialogTitle>Account Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to delete your Vendor Account?
					</DialogContentText>
					<DialogContentText color="error">
						Warning: This is a non-reverseable process and once your
						account gets deleted, it would delete your data from
						DigiMart.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={confirmDelete}
						color="secondary"
						variant="contained"
					>
						DELETE
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
