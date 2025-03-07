import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavBar from "./NavBar";
import debounce from "lodash.debounce"; 

const fetchSuggestions = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    return response.data.map((result) => result.display_name);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

const AddressAutocomplete = ({ label, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDebouncedSuggestions = useMemo(() => {
    return debounce(async (input) => {
      setLoading(true);
      const results = await fetchSuggestions(input);
      setSuggestions(results);
      setLoading(false);
    }, 300);
  }, [setLoading, setSuggestions]);
  
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue);
    if (newValue.length > 2) {
      fetchDebouncedSuggestions(newValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setSuggestions([]); 
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        value={value}
        onChange={handleInputChange}
        required
        sx={{
          mb: 2,
          backgroundColor: "#fff",
          input: { color: "#1e1e1e" }, 
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff", 
            "& fieldset": {
              borderColor: "#ddd", 
            },
          },
        }}
      />
      {loading && <CircularProgress size={20} sx={{ position: "absolute", right: 10, top: 15 }} />}
      {suggestions.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            bgcolor: "white",
            border: "1px solid #ddd",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: 2,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              sx={{
                padding: "10px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const TripForm = () => {
  const [trip, setTrip] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const navigate = useNavigate();

  const handleLocationChange = (field) => (value) => {
    setTrip({ ...trip, [field]: value });
  };

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (trip.current_cycle_used < 0 || isNaN(trip.current_cycle_used)) {
      setError("Current Cycle Used must be a valid positive number.");
      setLoading(false);
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/trips/", trip)
      .then((response) => {
        console.log("Trip added successfully. Redirecting!:", response);
        setSuccess(true);
        setTimeout(() => navigate("/"), 2000); 
      })
      .catch((error) => {
        console.error("Error adding trip:", error);
        setError(error.response?.data?.message || "Failed to add trip. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch user's current location
  const handleUseMyLocation = () => {
    setGeolocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            setTrip({ ...trip, current_location: response.data.display_name });
          } catch (error) {
            console.error("Error fetching location:", error);
            setError("Failed to get your location. Enter manually.");
          }
          setGeolocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setError("Location access denied. Enter manually.");
          setGeolocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported in this browser.");
      setGeolocationLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: "#1e1e1e" }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#fbc02d" }}>
            Add Trip
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1}>
                    <AddressAutocomplete
                      label="Current Location"
                      value={trip.current_location}
                      onChange={handleLocationChange("current_location")}
                    />
                  </Box>
                  <IconButton onClick={handleUseMyLocation} disabled={geolocationLoading} sx={{ ml: 2 }}>
                    {geolocationLoading ? <CircularProgress size={24} /> : <LocationOnIcon sx={{ color: "#fbc02d" }} />}
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <AddressAutocomplete label="Pickup Location" value={trip.pickup_location} onChange={handleLocationChange("pickup_location")} />
              </Grid>

              <Grid item xs={12}>
                <AddressAutocomplete label="Dropoff Location" value={trip.dropoff_location} onChange={handleLocationChange("dropoff_location")} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Current Cycle Used (Hours)"
                  name="current_cycle_used"
                  type="number"
                  fullWidth
                  required
                  variant="outlined"
                  value={trip.current_cycle_used}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff", 
                      "& fieldset": {
                        borderColor: "#ddd", 
                      },
                    },
                  }}
                />
              </Grid>

              {error && <Alert severity="error" sx={{ backgroundColor: "#1a1a1a", color: "#fbc02d" }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ backgroundColor: "#1a1a1a", color: "#fbc02d" }}>Trip added successfully!</Alert>}

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="warning" disabled={loading} sx={{ width: "100%" }}>
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default TripForm;
