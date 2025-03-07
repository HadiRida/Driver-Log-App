import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CircularProgress,
  Slide,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Car icon

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/trips/")
      .then(response => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching trips:", error);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    setSelectedTripId(id);
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/trips/${selectedTripId}/delete/`)
      .then(response => {
        setTrips(trips.filter(trip => trip.id !== selectedTripId));
        setOpen(false);
      })
      .catch(error => {
        console.error("Error deleting trip:", error.response);
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = (id) => {
    navigate(`/logs/${id}`);
  };

  return (
    <>
      <CssBaseline />
      {/* 🔹 Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#1a1a1a", padding: "10px 0" }}>
        <Toolbar>
          <DirectionsCarIcon sx={{ mr: 2, fontSize: 30, color: "#fbc02d" }} /> {/* Car icon */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fbc02d" }}>
            Driver Logs
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fbc02d" }}>
          Trips
        </Typography>
        <Button variant="contained" color="warning" component={Link} to="/add-trip" sx={{ mb: 2 }}>
          Add New Trip
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="warning" size={60} />
          </Box>
        ) : (
          <List>
            {trips.map(trip => (
              <Slide direction="up" in={true} mountOnEnter unmountOnExit key={trip.id}>
                <Card variant="outlined" sx={{ mb: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
                  <ListItem button onClick={() => handleNavigate(trip.id)} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ListItemText primary={`${trip.pickup_location} → ${trip.dropoff_location}`} sx={{ color: "#ddd" }} />
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={(event) => handleDeleteClick(trip.id, event)}
                        color="warning" 
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                </Card>
              </Slide>
            ))}
          </List>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fbc02d" }}>Delete Trip</DialogTitle>
          <DialogContent sx={{ backgroundColor: "#1e1e1e", color: "#ddd" }}>
            Are you sure you want to delete this trip?
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#1a1a1a" }}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="warning">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default TripList;
