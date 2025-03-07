import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress, Paper, Card, CardContent, Divider } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useNavigate } from "react-router-dom";  
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowSize: [45, 45],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ pickup, dropoff }) => {
  const [route, setRoute] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const navigate = useNavigate();  

  useEffect(() => {
    const getCoordinates = async (location) => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
        if (response.data && response.data[0]) {
          return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
        }
        console.error(`No coordinates found for ${location}`);
        return null;
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
      }
    };

    const fetchRoute = async () => {
      setLoading(true);
      const pickupLoc = await getCoordinates(pickup);
      const dropoffLoc = await getCoordinates(dropoff);

      if (pickupLoc && dropoffLoc) {
        setPickupCoords(pickupLoc);
        setDropoffCoords(dropoffLoc);
        setRoute([pickupLoc, dropoffLoc]);
      } else {
        console.error("Failed to fetch one or both coordinates.");
      }
      setLoading(false);
    };

    fetchRoute();
  }, [pickup, dropoff]);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1a1a1a", padding: "10px 0" }}>
        <Toolbar>
          <DirectionsCarIcon sx={{ mr: 2, fontSize: 30, color: "#fbc02d" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fbc02d" }}>
            Driver Logs - Route Map
          </Typography>

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => navigate("/trips")}  
            sx={{
              color: "#fbc02d",
              borderColor: "#fbc02d",
              "&:hover": {
                backgroundColor: "#fbc02d",
                color: "#1a1a1a",
              },
              padding: "8px 16px",
              borderRadius: "25px",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Back to Trips
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box mt={4} display="flex" justifyContent="center" gap={3}>
          <Card sx={{ width: "35%", minWidth: "300px", padding: "15px", backgroundColor: "#1e1e1e", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="#fbc02d">
                Trip Details
              </Typography>
              <Divider sx={{ backgroundColor: "#444", my: 1 }} />
              <Typography variant="body1" sx={{ color: "#ddd", mt: 2 }}>
                <strong>Pickup:</strong> {pickup}
              </Typography>
              <Typography variant="body1" sx={{ color: "#ddd", mt: 1 }}>
                <strong>Dropoff:</strong> {dropoff}
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ flexGrow: 1 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress color="warning" size={60} />
              </Box>
            ) : (
              <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden" }}>
                <MapContainer
                  center={pickupCoords || [0, 0]}
                  zoom={13}
                  style={{ height: "500px", width: "100%" }}
                  whenCreated={(map) => (mapRef.current = map)}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {pickupCoords && dropoffCoords && (
                    <>
                      <MapCenter pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
                      <Marker position={pickupCoords}>
                        <Popup>Pickup: {pickup}</Popup>
                      </Marker>
                      <Marker position={dropoffCoords}>
                        <Popup>Dropoff: {dropoff}</Popup>
                      </Marker>
                      <Polyline positions={route} color="#fbc02d" weight={5} opacity={0.9} />
                    </>
                  )}
                </MapContainer>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

const MapCenter = ({ pickupCoords, dropoffCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const bounds = L.latLngBounds([pickupCoords, dropoffCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupCoords, dropoffCoords, map]);

  return null;
};

export default MapComponent;
