import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripList from "./components/TripList";
import TripForm from "./components/TripForm";
import LogSheet from "./components/LogSheet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripList />} />
        <Route path="/add-trip" element={<TripForm />} />
        <Route path="/logs/:tripId" element={<LogSheet />} />
        <Route path="/trips" element={<TripList />} /> 
      </Routes>
    </Router>
  );
}

export default App;
