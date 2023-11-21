import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Error from './Error';
import CustomersList from './components/CustomersList';
import TrainingsList from './components/TrainingsList';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The App component wraps your routes
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <CustomersList /> // Assuming you have a Home component
      },
      {
        path: "customers",
        element: <CustomersList />
      },
      {
        path: "trainings",
        element: <TrainingsList />
      },
      {
        path: "calendar",
        element: <Calendar />
      },
      {
        path: "statistics",
        element: <Statistics />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
