import React, { useState } from "react";
import api from "../services/api";

function ImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Reset previous results and errors
    setResults(null);
    setError("");
    setSelectedFile(file);

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select an image to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // Call the API service instead of using setTimeout
      const results = await api.analyzeImage(selectedFile);
      setResults(results);
    } catch (err) {
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Medical Image Analysis</h1>
        <p className="page-subtitle">
          Analyze medical images using Azure Computer Vision
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upload Image</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">
              Select a medical image (X-ray, MRI, CT scan, etc.)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
            {error && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                }}
              >
                {error}
              </p>
            )}
          </div>

          {previewUrl && (
            <div style={{ marginTop: "1.5rem" }}>
              <label className="form-label">Image Preview</label>
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={handleAnalyzeImage}
              disabled={!selectedFile || isAnalyzing}
              className="btn btn-primary"
              style={{
                opacity: !selectedFile || isAnalyzing ? 0.6 : 1,
              }}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Analysis Results</h2>
          </div>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
                "@media (min-width: 768px)": {
                  gridTemplateColumns: "1fr 1fr",
                },
              }}
            >
              <div>
                <h3 className="form-label">Detected Conditions</h3>
                <ul style={{ marginTop: "0.5rem" }}>
                  {results.conditions.map((condition, index) => (
                    <li key={index} style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>{condition.name}</span>
                        <span>{condition.confidence}% confidence</span>
                      </div>
                      <div
                        style={{
                          height: "0.5rem",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "9999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${condition.confidence}%`,
                            backgroundColor:
                              condition.confidence > 70
                                ? "#10b981"
                                : condition.confidence > 50
                                ? "#f59e0b"
                                : "#ef4444",
                            borderRadius: "9999px",
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 className="form-label">Image Information</h3>
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.375rem",
                      padding: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ color: "#6b7280" }}>Type:</div>
                      <div>{results.metadata.type}</div>
                      <div style={{ color: "#6b7280" }}>Dimensions:</div>
                      <div>
                        {results.metadata.width} x {results.metadata.height} px
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="form-label">Recommendation</h3>
                  <div
                    style={{
                      backgroundColor: "rgba(0, 120, 212, 0.1)",
                      borderRadius: "0.375rem",
                      padding: "1rem",
                      marginTop: "0.5rem",
                      color: "#333333",
                    }}
                  >
                    <p>{results.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}
            >
              <button className="btn btn-secondary">Export Results</button>
              <button className="btn btn-secondary">Print Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageAnalysis;
