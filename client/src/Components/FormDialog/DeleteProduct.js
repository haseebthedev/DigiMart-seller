import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeleteProduct(props) {
	const handleClose = () => {
		props.setDeletingProduct(false);
	};

	const confirmDelete = () => {
		props.confirmedDelete();
	};

	return (
		<div>
			<Dialog open={props.DeletingProduct} onClose={handleClose}>
				<DialogTitle>Product Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to delete this Product?
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
