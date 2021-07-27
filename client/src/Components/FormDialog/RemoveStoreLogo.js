import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function RemoveStoreLogo(props) {
	const handleClose = () => {
		props.setStoreLogoRemove(false);
	};

	const confirmRemove = () => {
		props.confirmedRemoveStoreLogo();
	};

	return (
		<div>
			<Dialog open={props.RemoveStoreLogo} onClose={handleClose}>
				<DialogTitle>Removing Store Logo</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to remove your Store Logo?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={confirmRemove}
						color="primary"
						variant="contained"
					>
						Remove
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
