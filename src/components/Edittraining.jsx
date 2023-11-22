import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment'; // For date formatting
import EditIcon from '@mui/icons-material/Edit';

export default function EditTraining(props) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: '' // Assuming this is a URL to the customer as per your API structure
  });

  const handleClickOpen = () => {
    setTraining({
      date: moment(props.training.date).format('YYYY-MM-DDTHH:mm'),
      duration: props.training.duration,
      activity: props.training.activity,
      customer: props.training.customer
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setTraining({ ...training, [event.target.name]: event.target.value });
};

const updateTraining = () => {
    props.updateTraining(training);
    handleClose();
};

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}><EditIcon /></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Training</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="date"
            label="Date"
            type="datetime-local"
            fullWidth
            value={training.date}
            onChange={e => handleInputChange(e)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (min)"
            type="number"
            fullWidth
            value={training.duration}
            onChange={e => handleInputChange(e)}
            variant="standard"
          />
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            type="text"
            fullWidth
            value={training.activity}
            onChange={e => handleInputChange(e)}
            variant="standard"
          />
          <TextField
            margin="dense"
            name="customer"
            label="Customer"
            type="text"
            fullWidth
            value={training.customer.id}
            onChange={e => handleInputChange(e)}
            InputProps={{
              readOnly: true,
            }}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateTraining} disabled={!training.customer} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
