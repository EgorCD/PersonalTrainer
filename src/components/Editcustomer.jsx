import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditCustomer(props) {
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });

    const handleClickOpen = () => {
        setCustomer({
            firstname: props.customer.firstname, 
            lastname: props.customer.lastname, 
            streetaddress: props.customer.streetaddress, 
            postcode: props.customer.postcode, 
            city: props.customer.city, 
            email: props.customer.email, 
            phone: props.customer.phone
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    };

    const updateCustomer = () => {
        props.updateCustomer(customer);
        handleClose();
    };

    return(
        <React.Fragment>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        onChange={e => handleInputChange(e)}
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        onChange={e => handleInputChange(e)}
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        onChange={e => handleInputChange(e)}
                        label="Street Address"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="postcode"
                        value={customer.postcode}
                        onChange={e => handleInputChange(e)}
                        label="Postcode"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="city"
                        value={customer.city}
                        onChange={e => handleInputChange(e)}
                        label="City"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        value={customer.email}
                        onChange={e => handleInputChange(e)}
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        value={customer.phone}
                        onChange={e => handleInputChange(e)}
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
                    <Button onClick={updateCustomer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
