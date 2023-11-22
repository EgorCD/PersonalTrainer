import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';

export default function AddTraining(props) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
        date: '', 
        duration: '',
        activity: '',
        customer: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    };

    const addTraining = () => {
        const formattedTraining = {
            ...training,
            date: moment(training.date).toISOString(),
            customer: `https://localhost:8080/api/customers/${training.customer}`
        };

        props.saveTraining(formattedTraining);
        handleClose();
    };

    return (
        <React.Fragment>
            <Button style={{ margin: 10 }} variant="contained" color="success" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="date"
                        value={training.date}
                        onChange={handleInputChange}
                        label="Date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={handleInputChange}
                        label="Duration (min)"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={handleInputChange}
                        label="Activity"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="customer"
                        value={training.customer}
                        onChange={handleInputChange}
                        label="Customer ID"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={addTraining} disabled={!training.customer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
