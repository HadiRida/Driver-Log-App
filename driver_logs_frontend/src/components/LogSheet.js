import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import MapComponent from "./MapComponent";

const LogSheet = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/`)
      .then(response => setTrip(response.data))
      .catch(error => console.error("Error fetching trip:", error));

    axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/logs/`)
      .then(response => setLogs(response.data))
      .catch(error => console.error("Error fetching logs:", error));
  }, [tripId]);

  if (!trip) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <MapComponent pickup={trip.pickup_location} dropoff={trip.dropoff_location} />
      {logs.map(log => (
        <Typography key={log.id}>
          Stop: {log.stop_location}, Driving Hours: {log.driving_hours}, Rest Hours: {log.rest_hours}
        </Typography>
      ))}
    </Box>
  );
};

export default LogSheet;
