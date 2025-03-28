import React, { useState } from "react";
import api from "../services/api";

function SpeechTranscription() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an audio file
    if (!file.type.startsWith("audio/")) {
      setError("Please select an audio file");
      return;
    }

    // Reset previous results and errors
    setTranscription("");
    setError("");
    setSelectedFile(file);

    // Create audio URL for preview
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError("Please select an audio file to transcribe");
      return;
    }

    setIsTranscribing(true);
    setError("");

    try {
      // Call the API service instead of using setTimeout
      const response = await api.transcribeSpeech(selectedFile);
      setTranscription(response.transcription);
    } catch (err) {
      setError(err.message || "Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    alert("Transcription copied to clipboard!");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Speech Transcription</h1>
        <p className="page-subtitle">
          Transcribe medical consultations using Azure Speech Services
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upload Audio</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">
              Select an audio recording of a patient consultation
            </label>
            <input
              type="file"
              accept="audio/*"
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

          {audioUrl && (
            <div style={{ marginTop: "1.5rem" }}>
              <label className="form-label">Audio Preview</label>
              <audio
                controls
                src={audioUrl}
                style={{ width: "100%", marginTop: "0.5rem" }}
              ></audio>
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={handleTranscribe}
              disabled={!selectedFile || isTranscribing}
              className="btn btn-primary"
              style={{
                backgroundColor: "#10b981",
                opacity: !selectedFile || isTranscribing ? 0.6 : 1,
              }}
            >
              {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
            </button>
          </div>
        </div>
      </div>

      {transcription && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Transcription Results</h2>
          </div>
          <div className="card-body">
            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.375rem",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <p style={{ whiteSpace: "pre-line" }}>{transcription}</p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#6366f1" }}
                onClick={() => {
                  // Here you would typically redirect to the Clinical Notes page
                  // with the transcription data
                  alert(
                    "This would navigate to the Clinical Notes page with the transcription"
                  );
                }}
              >
                Generate Clinical Notes
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </button>
              <button className="btn btn-secondary">Export Text</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeechTranscription;
