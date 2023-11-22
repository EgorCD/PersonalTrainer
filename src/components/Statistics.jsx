import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

// API base URL for fetching training data
const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS;

const Statistics = () => {

  // State for storing processed activity data for the chart
  const [activityData, setActivityData] = useState([]);

  // Effect hook to fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Function to fetch training data from the API and process it
  const fetchStatistics = () => {
    fetch(`${API_BASE_URL_TRAININGS}/gettrainings`)
      .then(response => response.json())
      .then(data => {
        const processedData = processData(data);
        setActivityData(processedData); // Updating state with processed data
      })
      .catch(error => console.error('Error fetching statistics:', error));
  };

  // Function to process raw training data into a format suitable for the chart
  const processData = (trainings) => {
    // Mapping training data to extract activity names and durations
    const activities = trainings.map(training => ({
      activity: training.activity,
      minutes: training.duration
    }));

    // Grouping activities by name and summing their durations
    const groupedActivities = _.groupBy(activities, 'activity');
    return _.map(groupedActivities, (values, key) => ({
      activity: key,
      minutes: _.sumBy(values, 'minutes')
    }));
  };

  return (
    <BarChart
      width={600}
      height={600}
      data={activityData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="activity" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="minutes" fill="#8884d8" name="Duration (min)" />
    </BarChart>
  );
};

export default Statistics;
