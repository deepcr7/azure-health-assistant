import React, { useState } from "react";
import api from "../services/api";

function ClinicalNotes() {
  const [transcription, setTranscription] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState("");

  const handleTranscriptionChange = (e) => {
    setTranscription(e.target.value);
  };

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateNotes = async () => {
    if (!transcription.trim()) {
      setError("Please enter or paste a transcription");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Call the API service instead of using setTimeout
      const notes = await api.generateNotes(transcription, patientInfo);
      setNotes(notes);
    } catch (err) {
      setError(
        err.message || "Failed to generate clinical notes. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!notes) return;

    const fullNotes = `
SUBJECTIVE:
${notes.subjective}

OBJECTIVE:
${notes.objective}

ASSESSMENT:
${notes.assessment}

PLAN:
${notes.plan}
`;
    navigator.clipboard.writeText(fullNotes);
    alert("Notes copied to clipboard!");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clinical Notes Generator</h1>
        <p className="page-subtitle">
          Generate structured clinical notes from consultation transcriptions
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Patient Information</h2>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                name="name"
                value={patientInfo.name}
                onChange={handlePatientInfoChange}
                className="form-control"
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="text"
                name="age"
                value={patientInfo.age}
                onChange={handlePatientInfoChange}
                className="form-control"
                placeholder="45"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={patientInfo.gender}
                onChange={handlePatientInfoChange}
                className="form-control"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Transcription</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">
              Enter or paste the transcription text
            </label>
            <textarea
              value={transcription}
              onChange={handleTranscriptionChange}
              className="form-control"
              style={{ minHeight: "150px" }}
              placeholder="Paste transcription here..."
            ></textarea>
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

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handleGenerateNotes}
              disabled={!transcription.trim() || isGenerating}
              className="btn btn-primary"
              style={{
                backgroundColor: "#6366f1",
                opacity: !transcription.trim() || isGenerating ? 0.6 : 1,
              }}
            >
              {isGenerating ? "Generating..." : "Generate Clinical Notes"}
            </button>
          </div>
        </div>
      </div>

      {notes && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Generated Clinical Notes</h2>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="form-label">Subjective</h3>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <p>{notes.subjective}</p>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="form-label">Objective</h3>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginTop: "0.5rem",
                  whiteSpace: "pre-line",
                }}
              >
                <p>{notes.objective}</p>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="form-label">Assessment</h3>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginTop: "0.5rem",
                  whiteSpace: "pre-line",
                }}
              >
                <p>{notes.assessment}</p>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="form-label">Plan</h3>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  marginTop: "0.5rem",
                  whiteSpace: "pre-line",
                }}
              >
                <p>{notes.plan}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#6366f1" }}
              >
                Save to Patient Record
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </button>
              <button className="btn btn-secondary">Export as PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClinicalNotes;
