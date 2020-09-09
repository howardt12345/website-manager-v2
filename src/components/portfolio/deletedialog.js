import React from 'react';

import { 
  Button,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';

export default function DeleteDialog(props) {
  const { name, onClose, onConfirm } = props;

  return (
    <div>
      <DialogTitle id="alert-dialog-title">{`Delete ${name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to delete ${name}? This will delete all the subcategories and photos of ${name}. This action cannot be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(); onClose(true); }} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </div>
  );
}