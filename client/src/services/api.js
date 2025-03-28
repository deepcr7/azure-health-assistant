import axios from "axios";

const API_URL = "http://localhost:5500";

const api = {
  // Image Analysis
  analyzeImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${API_URL}/api/analyze-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error(error.response?.data?.error || "Failed to analyze image");
    }
  },

  // Speech Transcription
  transcribeSpeech: async (audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await axios.post(
        `${API_URL}/api/transcribe-speech`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error transcribing speech:", error);
      throw new Error(
        error.response?.data?.error || "Failed to transcribe speech"
      );
    }
  },

  // Clinical Notes Generation
  generateNotes: async (transcription, patientInfo) => {
    try {
      const response = await axios.post(`${API_URL}/api/generate-notes`, {
        transcription,
        patientInfo,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating notes:", error);
      throw new Error(
        error.response?.data?.error || "Failed to generate notes"
      );
    }
  },

  analyzeMedicalText: async (text) => {
    try {
      const response = await axios.post(`${API_URL}/analyze-medical-text`, {
        text,
      });
      return response.data;
    } catch (error) {
      console.error("Error analyzing medical text:", error);
      throw new Error(
        error.response?.data?.error || "Failed to analyze medical text"
      );
    }
  },
};

export default api;
