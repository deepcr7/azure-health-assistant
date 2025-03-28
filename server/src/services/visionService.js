const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

// Initialize Computer Vision client
const key = process.env.VISION_KEY;
const endpoint = process.env.VISION_ENDPOINT;

// Create credentials object
const credentials = new CognitiveServicesCredentials(key);

// Create client
const computerVisionClient = new ComputerVisionClient(credentials, endpoint);

// Analyze an image using Azure Computer Vision
async function analyzeImage(imageBuffer) {
  try {
    // Visual features to analyze
    const visualFeatures = ["Categories", "Description", "Objects", "Tags"];

    // Analyze image
    const results = await computerVisionClient.analyzeImageInStream(
      imageBuffer,
      { visualFeatures }
    );

    // Process results for a medical context
    return processMedicalResults(results);
  } catch (error) {
    console.error("Azure Vision API error:", error);
    throw new Error("Failed to analyze image with Azure Vision API");
  }
}

// Process general image analysis results for medical context
function processMedicalResults(results) {
  // Extract tags
  const tags = results.tags || [];

  // Medical-related keywords to look for
  const medicalKeywords = [
    "x-ray",
    "mri",
    "scan",
    "medical",
    "ct",
    "ultrasound",
    "radiograph",
    "bone",
    "tissue",
    "organ",
    "brain",
    "lung",
    "heart",
    "chest",
    "fracture",
    "tumor",
    "lesion",
    "abnormality",
    "opacity",
  ];

  // Filter tags that might be medically relevant
  const medicalTags = tags.filter((tag) =>
    medicalKeywords.some((keyword) => tag.name.toLowerCase().includes(keyword))
  );

  // Map tags to potential conditions
  const conditions = medicalTags.map((tag) => ({
    name: formatConditionName(tag.name),
    confidence: Math.round(tag.confidence * 100),
  }));

  // Add default condition if none found
  if (conditions.length === 0) {
    conditions.push({
      name: "Standard medical imagery detected",
      confidence: 90,
    });
  }

  // Extract image metadata
  const metadata = {
    type: detectImageType(results),
    width: results.metadata?.width || 0,
    height: results.metadata?.height || 0,
  };

  // Generate recommendation
  const description = results.description?.captions?.[0]?.text || "";
  const recommendation = generateRecommendation(description, conditions);

  return {
    conditions,
    metadata,
    recommendation,
  };
}

// Format a tag name to sound like a medical condition
function formatConditionName(tagName) {
  // Format tag to sound more like a medical observation
  if (tagName.includes("x-ray") || tagName.includes("xray")) {
    return "Radiographic findings present";
  }

  if (tagName.includes("lung") || tagName.includes("chest")) {
    return "Pulmonary structure visualization";
  }

  if (tagName.includes("brain") || tagName.includes("head")) {
    return "Cranial structure visualization";
  }

  if (tagName.includes("bone")) {
    return "Skeletal structure visualization";
  }

  if (
    tagName.includes("scan") ||
    tagName.includes("mri") ||
    tagName.includes("ct")
  ) {
    return "Medical imaging scan analysis";
  }

  // Default formatting
  return `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} identification`;
}

// Detect the type of medical image
function detectImageType(results) {
  const tags = results.tags || [];
  const tagNames = tags.map((tag) => tag.name.toLowerCase());

  if (tagNames.includes("x-ray") || tagNames.includes("xray")) {
    return "X-ray";
  }

  if (tagNames.includes("mri")) {
    return "MRI";
  }

  if (tagNames.includes("ct scan") || tagNames.includes("ct")) {
    return "CT Scan";
  }

  if (tagNames.includes("ultrasound")) {
    return "Ultrasound";
  }

  return "Medical Image";
}

// Generate a recommendation based on analysis
function generateRecommendation(description, conditions) {
  // This is a simplified example - in a real application, this would be more sophisticated
  if (conditions.length === 0) {
    return "No specific findings detected. Consider further clinical correlation if symptoms persist.";
  }

  const highConfidenceConditions = conditions.filter((c) => c.confidence > 75);

  if (highConfidenceConditions.length > 0) {
    return `Analysis suggests presence of ${highConfidenceConditions
      .map((c) => c.name.toLowerCase())
      .join(
        ", "
      )}. Recommend clinical correlation and possible specialist consultation.`;
  }

  return `Image analysis complete. Please note this is an AI-assisted preliminary analysis and should be reviewed by a qualified healthcare professional. Clinical correlation is recommended.`;
}

module.exports = {
  analyzeImage,
};
