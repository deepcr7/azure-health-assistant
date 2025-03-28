import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/Home";
import ImageAnalysis from "./pages/ImageAnalysis";
import SpeechTranscription from "./pages/SpeechTranscription";
import ClinicalNotes from "./pages/ClinicalNotes";
import "./index.css";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/image-analysis" element={<ImageAnalysis />} />
              <Route path="/speech" element={<SpeechTranscription />} />
              <Route path="/notes" element={<ClinicalNotes />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
