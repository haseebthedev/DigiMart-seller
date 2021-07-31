import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeleteScheduledPromotion(props) {
	const handleClose = () => {
		props.setDeletingPP(false);
	};

	const confirmDelete = () => {
		props.confirmedDelete();
	};

	return (
		<div>
			<Dialog open={props.DeletingPP} onClose={handleClose}>
				<DialogTitle>Promotion Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to delete this Promotion?
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
						YES, DELETE
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
