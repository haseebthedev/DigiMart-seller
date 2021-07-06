import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function DeleteBankDetails(props) {
  const handleClose = () => {
    props.setDeletingAccount(false);
  };

  const confirmDelete = () => {
    props.confirmedDelete();
  };

  return (
    <div>
      <Dialog open={props.DeletingAccount} onClose={handleClose}>
        <DialogTitle>Bank Details Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete your Bank Details?
          </DialogContentText>
          <DialogContentText color="error">
            Attention: You can not take withdrawal from DigiMart until you link
            your bank details within payments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" variant="contained">
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
