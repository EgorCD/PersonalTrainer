import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

export default function AddCustomer(props) {
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    };

    const addCustomer = () => {
        props.saveCustomer(customer);
        handleClose();
    };

    return (
        <React.Fragment>
            <Button style={{ margin: 10 }} variant="contained" color="success" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add Customer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        onChange={handleInputChange}
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        onChange={handleInputChange}
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        onChange={handleInputChange}
                        label="Street Address"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="postcode"
                        value={customer.postcode}
                        onChange={handleInputChange}
                        label="Postcode"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="city"
                        value={customer.city}
                        onChange={handleInputChange}
                        label="City"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        value={customer.email}
                        onChange={handleInputChange}
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        value={customer.phone}
                        onChange={handleInputChange}
                        label="Phone"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={addCustomer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
