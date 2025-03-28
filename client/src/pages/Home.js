import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const recentActivities = [
    {
      id: 1,
      type: "image",
      title: "Chest X-ray Analysis",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "speech",
      title: "Patient Consultation",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "notes",
      title: "Clinical Notes Generated",
      time: "Yesterday",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to Azure Health Assistant</p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="feature-icon">🔍</span>
          <h3 className="feature-title">Image Analysis</h3>
          <p className="feature-description">
            Analyze medical images using Azure Computer Vision
          </p>
          <Link to="/image-analysis" className="btn btn-primary">
            Get Started
          </Link>
        </div>

        <div className="feature-card">
          <span className="feature-icon">🎙️</span>
          <h3 className="feature-title">Speech Transcription</h3>
          <p className="feature-description">
            Transcribe patient consultations with Azure Speech Services
          </p>
          <Link to="/speech" className="btn btn-success">
            Get Started
          </Link>
        </div>

        <div className="feature-card">
          <span className="feature-icon">📝</span>
          <h3 className="feature-title">Clinical Notes</h3>
          <p className="feature-description">
            Generate structured clinical documentation
          </p>
          <Link to="/notes" className="btn btn-indigo">
            Get Started
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="card-body">
          <ul className="activity-list">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === "image"
                    ? "🔍"
                    : activity.type === "speech"
                    ? "🎙️"
                    : "📝"}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
                <button className="btn btn-secondary">View</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
