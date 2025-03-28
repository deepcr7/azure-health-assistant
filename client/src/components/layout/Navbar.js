import React from "react";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Determine the current page title based on the URL path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/image-analysis") return "Image Analysis";
    if (path === "/speech") return "Speech Transcription";
    if (path === "/notes") return "Clinical Notes";
    return "Azure Health Assistant";
  };

  return (
    <header className="header">
      <h1 className="header-title">Azure Health Assistant</h1>
      <div className="user-avatar">DR</div>
    </header>
  );
}

export default Navbar;
