import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setting up the localizer for the calendar using moment
const localizer = momentLocalizer(moment);

// API base URL from environment variables
const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS;

// Defining the TrainingCalendar component
function TrainingCalendar() {

  // State hook for storing training sessions
  const [trainings, setTrainings] = useState([]);

  // Function to fetch training sessions from the API
  const fetchTrainings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL_TRAININGS}/gettrainings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Could not fetch trainings: ", error);
    }
  };

  // useEffect hook to fetch training data on component mount
  useEffect(() => {
    fetchTrainings().then(data => {
      // Mapping the training data to the format expected by the calendar
      const events = data.map(training => ({
        title: training.activity + ' / ' + training.customer.firstname + ' ' + training.customer.lastname,
        start: new Date(training.date),
        end: new Date(moment(training.date).add(training.duration, 'minutes').toDate()),
        allDay: false
      }));
      setTrainings(events);
    });
  }, []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={trainings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
}

export default TrainingCalendar;
