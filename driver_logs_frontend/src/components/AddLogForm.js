import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";

const AddLogForm = () => {
  const { tripId } = useParams();
  const [log, setLog] = useState({ stop_location: "", driving_hours: "", rest_hours: "" });

  const handleChange = (e) => {
    setLog({ ...log, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://127.0.0.1:8000/api/trips/${tripId}/logs/`, { ...log, trip: tripId })
      .then(() => window.location.reload())
      .catch(error => console.error("Error adding log:", error));
  };

  return (
    <Container>
      <Typography variant="h6">Add Log Entry</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Stop Location" name="stop_location" fullWidth onChange={handleChange} required />
        <TextField label="Driving Hours" name="driving_hours" type="number" fullWidth onChange={handleChange} required />
        <TextField label="Rest Hours" name="rest_hours" type="number" fullWidth onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">Add Log</Button>
      </form>
    </Container>
  );
};

export default AddLogForm;
