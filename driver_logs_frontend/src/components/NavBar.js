import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, CssBaseline } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Car icon

const NavBar = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "#1a1a1a", padding: "10px 0" }}>
        <Toolbar>
          <DirectionsCarIcon sx={{ mr: 2, fontSize: 30, color: "#fbc02d" }} /> {/* Car icon */}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fbc02d" }}>
            Driver Logs
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="warning"
            sx={{ ml: 2 }} 
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
