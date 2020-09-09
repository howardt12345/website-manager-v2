import React, { useState } from 'react';
import { ThemeToggleConsumer } from '@api';
import { MaterialUiIconPicker } from '@components/material-ui-icon-picker';

import { 
  Box,
  Button,
  DialogActions, DialogContent, DialogTitle,
  Icon,
  TextField,
  Tooltip,
} from '@material-ui/core';

export default function CategoryDialog(props) {
  const { edit, name, icon, onClose, onSave } = props;
  const [newName, setNewName] = useState(name);
  const [newIcon, setNewIcon] = useState(icon);

  return (
    <div>
      <DialogTitle>{edit ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        <TextField 
          id="outlined-basic" 
          label="Name" 
          variant="outlined" 
          defaultValue={name}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <Box m={1} />
        <ThemeToggleConsumer>
          {themecontext => (
            <Box display="flex" flexDirection='row' alignItems='center'>
              <Box flexGrow={1} justifyContent="flex-start">
                <MaterialUiIconPicker 
                  theme={themecontext.theme}
                  label={edit ? 'Edit Icon' : 'Pick Icon'}
                  modalTitle='Pick Icon'
                  onPick={(icon) => {
                    console.log(icon.name);
                    setNewIcon(icon.name);
                  }}
                />
              </Box>
              <Tooltip title={newIcon}>
                <Icon color='primary'>{newIcon}</Icon>
              </Tooltip>
            </Box>
          )}
        </ThemeToggleConsumer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {onSave({name: newName, icon: newIcon}); onClose(true)}} color="primary">
          OK
        </Button>
      </DialogActions>
    </div>
  );
}