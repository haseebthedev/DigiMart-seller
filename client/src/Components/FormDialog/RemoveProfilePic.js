import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

export default function RemoveProfilePic(props) {
	const handleClose = () => {
		props.setRemoveProfilePic(false);
	};

	const confirmRemove = () => {
		props.confirmedRemoveProfilePic();
	};

	return (
		<div>
			<Dialog open={props.RemoveProfilePic} onClose={handleClose}>
				<DialogTitle>Removing Profile Picture</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Do you really want to remove your Profile Picture?
					</DialogContentText>
					{/* <DialogContentText color="error">
						Warning: This is a non-reverseable process and once your
						account gets deleted, it would delete your data from
						DigiMart.
					</DialogContentText> */}
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
