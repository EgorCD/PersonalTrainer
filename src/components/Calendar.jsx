import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS;

function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);

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

  useEffect(() => {
    fetchTrainings().then(data => {
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
