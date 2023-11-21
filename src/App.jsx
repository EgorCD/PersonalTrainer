import * as React from 'react';
import { Container } from "@mui/material";
import NavBar from './components/NavBar';
import { Outlet } from 'react-router-dom'; // Import Outlet
import './components/App.css';

function App() {
  return (
    <Container className="container" maxWidth="xl">
      <NavBar className="navbar" />
      <Outlet />
    </Container>
  );
}

export default App;
