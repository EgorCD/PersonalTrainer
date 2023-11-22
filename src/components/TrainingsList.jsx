import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar, Button, Box, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { addTraining, updateTraining, deleteTraining } from './apiService';
import Addtraining from './Addtraining';
import EditTraining from './EditTraining';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Pagination from '@mui/material/Pagination';

function TrainingsList() {

  // State hooks for various functionalities
  const [trainings, setTrainings] = useState([]); // State for training sessions
  const [open, setOpen] = useState(false); // State for the Snackbar component
  const [gridApi, setGridApi] = useState(null); // State for AG Grid API instance
  const [searchText, setSearchText] = useState(''); // State for search functionality
  const [currentPage, setCurrentPage] = useState(1); // State for current pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for number of rows per page
  const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS; // API base URL

  const [columnDefs] = useState([
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: params => {
        const trainingId = params.data.id;
        return (
          <>
            <Button size='small' color="error" onClick={() => handleDeleteTraining(trainingId)}><DeleteIcon /></Button>
            <EditTraining updateTraining={(updatedTraining) => handleUpdateTraining(updatedTraining, trainingId)} training={params.data} />
          </>
        );
      },
    },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      editable: false,
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD HH:mm'),
    },
    {
      headerName: 'Duration (min)',
      field: 'duration',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Activity',
      field: 'activity',
      sortable: true,
      filter: true,
      editable: true,
      cellStyle: { 'font-weight': 'bold', 'font-family': 'Roboto, sans-serif' },
    },
    {
      headerName: 'Customer',
      field: 'customer',
      valueFormatter: params => {
        const customer = params.data.customer;
        return customer ? `${customer.firstname} ${customer.lastname}` : '';
      },
      sortable: true,
      filter: true,
      editable: false,
      cellStyle: { 'font-weight': 'bold', 'font-family': 'Roboto, sans-serif' },
    },
  ]);

  // Stores the fields of the columns that are currently visible
  const [visibleColumns, setVisibleColumns] = useState(columnDefs.map(col => col.field));

  // Fetches trainings initially and on changes to currentPage or rowsPerPage
  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [currentPage, rowsPerPage]);

  // Calculates the total number of pages for pagination
  const pageCount = Math.ceil(trainings.length / rowsPerPage);

  // Handle changes in pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate the trainings to be shown on the current page
  const currentTrainings = trainings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Update visible columns in the grid when the visibleColumns state changes
  useEffect(() => {
    if (gridApi) {
      gridApi.setColumnDefs(columnDefs.filter(col => visibleColumns.includes(col.field)));
    }
  }, [visibleColumns, gridApi]);

  // Apply the search filter to the grid data
  useEffect(() => {
    if (gridApi) {
      gridApi.setQuickFilter(searchText);
    }
  }, [searchText, gridApi]);

  // Handle changes in column visibility
  const handleColumnVisibilityChange = (event) => {
    setVisibleColumns(prev => event.target.checked
      ? [...prev, event.target.name]
      : prev.filter(colField => colField !== event.target.name));
  };

  // Export the current view of the grid to a CSV file
  const exportToCsv = () => {
    const exportColumns = visibleColumns.filter(col => col !== 'delete' & col !== 'edit');
    gridApi.exportDataAsCsv({
      columnKeys: exportColumns
    });
  };

  // Initialize the grid API on grid load
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // Handle cell editing stopped event to update training data
  const onCellEditingStopped = (event) => {
    if (event.value !== event.oldValue) {
      console.log("sth");
      const updatedTraining = { ...event.data, [event.colDef.field]: event.value };
      updateTraining(updatedTraining, event.data.id);
    }
  };

  // Fetches trainings from the API and updates state
  const fetchTrainings = () => {
    fetch(`${API_BASE_URL_TRAININGS}/gettrainings`)
      .then(response => response.json())
      .then(data => setTrainings(data))
      .catch(error => console.error('Error fetching trainings:', error));
  };

  // Handles adding a new training
  const handleAddTraining = (newTraining) => {
    addTraining(newTraining)
      .then(() => fetchTrainings())
      .catch(error => console.error('Error adding training:', error));
  };

  // Handles updating a training
  const handleUpdateTraining = (updatedTraining, trainingId) => {
    updateTraining(updatedTraining, trainingId)
      .then(() => fetchTrainings())
      .catch(error => console.error('Error updating training:', error));
  };

  // Handles deleting a training
  const handleDeleteTraining = (trainingId) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      deleteTraining(trainingId)
        .then(() => fetchTrainings())
        .catch(error => console.error('Error deleting training:', error));
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Addtraining saveTraining={handleAddTraining} />
          <Button
            variant="contained"
            color="primary"
            onClick={exportToCsv}
            sx={{ margin: '1rem' }}
            endIcon={<SendIcon />}
          >
            Export to CSV
          </Button>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ margin: '1rem', flex: 1, minWidth: '250px', maxWidth: '500px' }}
          />
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
        </Box>
      </Box>
      <div className='ag-theme-material' style={{ height: 420, width: '100%' }}>
        <AgGridReact
          rowData={currentTrainings}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true
          }}
          pagination={false}
          paginationPageSize={10}
          suppressCellSelection={true}
          onCellEditingStopped={onCellEditingStopped}
          onGridReady={onGridReady}
        />
      </div>
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Action was successful"
      />
    </>
  );
}

export default TrainingsList;