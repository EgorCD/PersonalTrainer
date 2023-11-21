import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Snackbar, Button, Box, TextField, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { fetchCustomers, deleteCustomer, updateCustomer, saveCustomer } from './apiService'; // Import from apiService.js

import AddCustomer from './AddCustomer';
import EditCustomer from './Editcustomer';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [searchText, setSearchText] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [columnDefs] = useState([
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: params => {
        const customerId = getCustomerIdFromLink(params.data.links[0].href);
        return (
          <>
            <Button size='small' color="error" onClick={() => handleDeleteCustomer(customerId)}>
              <DeleteIcon />
            </Button>
            <EditCustomer updateCustomer={(updatedCustomer) => handleUpdateCustomer(updatedCustomer, customerId)} customer={params.data} />
          </>
        );
      }
    },
    { headerName: 'First Name', field: 'firstname', sortable: true, filter: true, editable: true },
    { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true, editable: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, editable: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true, editable: true },
    { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true, editable: true },
    { headerName: 'City', field: 'city', sortable: true, filter: true, editable: true },
  ]);

  const [visibleColumns, setVisibleColumns] = useState(columnDefs.map(col => col.field));

  useEffect(() => {
    fetchCustomers()
  }, []);
  
  useEffect(() => {
    if (gridApi) {
      gridApi.setColumnDefs(columnDefs.filter(col => visibleColumns.includes(col.field)));
    }
  }, [visibleColumns, gridApi]);

  useEffect(() => {
    if (gridApi) {
      gridApi.setQuickFilter(searchText);
    }
  }, [searchText, gridApi]);

  const handleColumnVisibilityChange = (event) => {
    setVisibleColumns(prev => event.target.checked
      ? [...prev, event.target.name]
      : prev.filter(colField => colField !== event.target.name));
  };

  const exportToCsv = () => {
    gridApi.exportDataAsCsv({
      columnKeys: visibleColumns
    });
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const getCustomerIdFromLink = (link) => {
    const parts = link.split('/');
    return parts[parts.length - 1];
  };

  const onCellEditingStopped = (event) => {
    if (event.value !== event.oldValue) {
      const updatedCustomer = { ...event.data, [event.colDef.field]: event.value };
      updateCustomer(updatedCustomer, getCustomerIdFromLink(event.data.links[0].href));
    }
  };  

  const fetchCustomers = () => {
    fetch(`${API_BASE_URL}/customers`)
      .then(response => {
        if (!response.ok) throw new Error("Something went wrong: " + response.statusText);
        return response.json();
      })
      .then(data => setCustomers(data.content))
      .catch(err => console.error(err));
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(customerId)
        .then(response => {
          if (!response.ok) throw new Error('Failed to delete');
          setOpen(true);
          fetchCustomers();
        })
        .catch(err => {
          console.error('Error deleting customer:', err);
        });
    }
  };

  const handleUpdateCustomer = (updatedCustomer, customerId) => {
    updateCustomer(updatedCustomer, customerId)
      .then(response => {
        if (!response.ok) throw new Error('Failed to update');
        setOpen(true);
        fetchCustomers();
      })
      .catch(err => {
        console.error('Error updating customer:', err);
      });
  };

  const handleAddCustomer = (newCustomer) => {
    saveCustomer(newCustomer)
      .then(response => {
        if (!response.ok) throw new Error('Failed to add');
        setOpen(true);
        fetchCustomers();
      })
      .catch(err => {
        console.error('Error adding customer:', err);
      });
  };

  return (
    <>
      <Box sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <Box>
          <AddCustomer saveCustomer={handleAddCustomer} />
        </Box>
        <Box>
          <TextField 
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: '1rem' }}
            sx={{ flex: 1, minWidth: '250px', maxWidth: '500px', marginLeft: 'auto' }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToCsv}
          style={{ marginBottom: '10px' }}
        >
          Export to CSV
        </Button>
      </Box>
      <FormGroup row>
        {columnDefs.map((col, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={visibleColumns.includes(col.field)}
                onChange={handleColumnVisibilityChange}
                name={col.field}
              />
            }
            label={col.headerName}
          />
        ))}
      </FormGroup>
      <div className='ag-theme-material' style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={customers}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true
          }}
          pagination={true}
          paginationPageSize={10}
          suppressCellSelection={true}
          onCellEditingStopped={onCellEditingStopped}
          onGridReady={onGridReady}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Action was successful"
      />
    </>
  );
}

export default CustomerList;
