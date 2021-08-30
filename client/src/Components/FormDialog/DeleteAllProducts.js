import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function DeleteAllProducts(props) {
	const handleClose = () => {
		props.setDeletingAllProduct(false);
	};

	const confirmDelete = () => {
		props.confirmedDelete();
	};

	return (
		<div>
			<Dialog open={props.DeletingAllProduct} onClose={handleClose}>
				<DialogTitle>Product Repository Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to delete all Products of Store?
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
