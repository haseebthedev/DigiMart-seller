import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
            Warning: Deactivating your Vendor account would make your Store
            unpublished from DigiMart thus you wouldn't be able to sell your
            products.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmDeactivate}
            color="secondary"
            variant="contained"
          >
            DEACTIVATE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
