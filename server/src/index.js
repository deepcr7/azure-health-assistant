const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import services
const visionService = require("./services/visionService");
const speechService = require("./services/speechService");
const notesService = require("./services/notesService");
const textAnalyticsService = require("./services/textAnalyticsService");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file storage
// Set up multer storage and file filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept audio files
  if (file.mimetype.startsWith("audio/")) {
    // Prefer WAV files but accept other common audio formats
    if (file.mimetype === "audio/wav" || file.mimetype === "audio/wave") {
      cb(null, true);
    } else {
      // Accept but warn about other formats
      console.warn("Non-WAV audio format uploaded:", file.mimetype);
      cb(null, true);
    }
  } else {
    cb(new Error("Only audio files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define routes
// 1. Image Analysis route
app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Get the uploaded file path
    const imagePath = req.file.path;

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Call the Azure Computer Vision service
    const analysisResults = await visionService.analyzeImage(imageBuffer);

    // Clean up - remove the uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.json(analysisResults);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

// 2. Speech Transcription route
// 2. Speech Transcription route
app.post("/api/transcribe-speech", upload.single("audio"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    console.log("Audio file received:", req.file.originalname);
    console.log("File size:", req.file.size, "bytes");
    console.log("File type:", req.file.mimetype);

    // Get the uploaded file path
    const audioPath = req.file.path;

    try {
      // Call the Azure Speech Service
      const transcription = await speechService.transcribeAudio(audioPath);

      // Clean up - remove the uploaded file
      fs.unlink(audioPath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      res.json({ transcription });
    } catch (error) {
      console.error("Transcription error:", error.message);

      // Clean up - remove the uploaded file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }

      // If there's a specific issue with Azure credentials, provide a clear message
      if (error.message.includes("Missing Azure Speech service credentials")) {
        return res.status(500).json({
          error: "Azure Speech service not configured correctly",
          details:
            "Please check your Azure credentials in the server .env file",
        });
      }

      // Handle audio format issues
      if (error.message.includes("format") || error.message.includes("wav")) {
        return res.status(400).json({
          error: "Audio format not supported",
          details:
            "The Azure Speech Service works best with WAV files. Please convert your audio to WAV format.",
        });
      }

      res.status(500).json({
        error: "Failed to transcribe audio",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error processing audio:", error);
    res
      .status(500)
      .json({ error: "Failed to process audio: " + error.message });
  }
});

// 3. Clinical Notes Generation route
app.post("/api/generate-notes", async (req, res) => {
  try {
    const { transcription, patientInfo } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: "No transcription provided" });
    }

    // Generate clinical notes
    const notes = notesService.generateClinicalNotes(
      transcription,
      patientInfo
    );

    res.json(notes);
  } catch (error) {
    console.error("Error generating notes:", error);
    res.status(500).json({ error: "Failed to generate notes" });
  }
});

// Medical text analysis endpoint
app.post("/api/analyze-medical-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided for analysis" });
    }

    // Analyze the medical text
    const analysis = await textAnalyticsService.analyzeMedicalText(text);

    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing medical text:", error);
    res.status(500).json({ error: "Failed to analyze medical text" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Azure Health Assistant API is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
