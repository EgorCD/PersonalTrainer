import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar, Button, Box, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import Addtraining from './Addtraining';
import EditTraining from './EditTraining';
import moment from 'moment'; 
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTrainings, addTraining, updateTraining, deleteTraining } from './apiService'; // Import from apiService.js

function TrainingsList() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [searchText, setSearchText] = useState('');
  const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS;
  
  const [columnDefs] = useState([
    {
      headerName: 'Delete',
      field: 'delete',
      sortable: false,
      filter: false,
      cellRenderer: params => {
        const trainingId = params.data.id;
        return (
          <>
            <Button size='small' color="error" onClick={() => handleDeleteTraining(trainingId)}><DeleteIcon /></Button>
          </>
        );
      },      
    },
    {
      headerName: 'Edit',
      field: 'edit',
      sortable: false,
      filter: false,
      cellRenderer: params => {
        const trainingId = params.data.id;
        return (
          <>
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
    },    
  ]);

  const [visibleColumns, setVisibleColumns] = useState(columnDefs.map(col => col.field));

  useEffect(() => {
    fetchTrainings();
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
    const exportColumns = visibleColumns.filter(col => col !== 'delete' & col !== 'edit');
    gridApi.exportDataAsCsv({
      columnKeys: exportColumns
    });
  }; 

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  
  const onCellEditingStopped = (event) => {
    if (event.value !== event.oldValue) {
      console.log("sth");
      const updatedTraining = { ...event.data, [event.colDef.field]: event.value };
      updateTraining(updatedTraining, event.data.id);
    }
  };

  const fetchTrainings = () => {
    fetch(`${API_BASE_URL_TRAININGS}/gettrainings`)
      .then(response => response.json())
      .then(data => setTrainings(data))
      .catch(error => console.error('Error fetching trainings:', error));
  };

  const handleAddTraining = (newTraining) => {
    addTraining(newTraining)
      .then(() => fetchTrainings())
      .catch(error => console.error('Error adding training:', error));
  };

  const handleUpdateTraining = (updatedTraining, trainingId) => {
    updateTraining(updatedTraining, trainingId)
      .then(() => fetchTrainings())
      .catch(error => console.error('Error updating training:', error));
  };

  const handleDeleteTraining = (trainingId) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      deleteTraining(trainingId)
        .then(() => fetchTrainings())
        .catch(error => console.error('Error deleting training:', error));
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <Box>
          <Addtraining saveTraining={handleAddTraining} />
        </Box>
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: '1rem' }}
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
          rowData={trainings}
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
        message="Action was successfull"
      />
    </>
  );
}

export default TrainingsList;
