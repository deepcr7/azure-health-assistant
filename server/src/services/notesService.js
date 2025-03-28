// Generate clinical notes from a transcription
function generateClinicalNotes(transcription, patientInfo) {
  // For now, we'll use a rule-based approach as a placeholder
  // In a real application, you might use a more sophisticated NLP approach

  // Extract information from the transcription
  const extractedInfo = extractInformation(transcription);

  // Generate SOAP format notes
  const notes = generateSOAPNotes(extractedInfo, patientInfo);

  return notes;
}

// Extract medical information from a transcription text
function extractInformation(transcription) {
  // This is a simplified example using regex patterns

  // Extract symptoms
  const symptomPatterns = [
    /(?:complains of|reports|experiencing|having|has) ([^,.;]+(?:pain|ache|discomfort|fever|cough|nausea|vomiting|dizziness|fatigue|weakness|difficulty|problem))/gi,
    /([^,.;]+(?:pain|ache|discomfort|fever|cough|nausea|vomiting|dizziness|fatigue|weakness)) (?:for|since|in the last)/gi,
  ];

  let symptoms = [];

  symptomPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(transcription)) !== null) {
      symptoms.push(match[1].trim());
    }
  });

  // Remove duplicates
  symptoms = [...new Set(symptoms)];

  // Extract duration
  const durationPattern =
    /(?:for|since|in the last|about) (\d+) (day|days|week|weeks|month|months|year|years)/i;
  const durationMatch = transcription.match(durationPattern);
  const duration = durationMatch
    ? `${durationMatch[1]} ${durationMatch[2]}`
    : "Not specified";

  // Extract vital signs mentioned
  const vitalPatterns = {
    temperature: /(?:temperature|temp|t)[:\s]+([0-9.]+)(?:\s*°?(?:C|F))/i,
    heartRate: /(?:heart rate|pulse|hr|p)[:\s]+([0-9.]+)(?:\s*bpm)/i,
    bloodPressure: /(?:blood pressure|bp)[:\s]+([0-9.]+\/[0-9.]+)(?:\s*mmHg)?/i,
    respiration:
      /(?:respiration|respiratory rate|rr)[:\s]+([0-9.]+)(?:\s*breaths\/min)?/i,
    o2Sat: /(?:oxygen saturation|o2 sat|spo2)[:\s]+([0-9.]+)(?:\s*%)?/i,
  };

  const vitals = {};

  for (const [key, pattern] of Object.entries(vitalPatterns)) {
    const match = transcription.match(pattern);
    if (match) {
      vitals[key] = match[1];
    }
  }

  return {
    symptoms,
    duration,
    vitals,
    fullText: transcription,
  };
}

// Generate SOAP format notes from extracted information
function generateSOAPNotes(extractedInfo, patientInfo) {
  // Format patient info
  const patientDescription = formatPatientInfo(patientInfo);

  // Generate Subjective section
  const subjective = generateSubjectiveSection(
    patientDescription,
    extractedInfo
  );

  // Generate Objective section
  const objective = generateObjectiveSection(extractedInfo);

  // Generate Assessment section
  const assessment = generateAssessmentSection(extractedInfo);

  // Generate Plan section
  const plan = generatePlanSection(extractedInfo);

  return {
    subjective,
    objective,
    assessment,
    plan,
  };
}

// Format patient information
function formatPatientInfo(patientInfo) {
  const { name, age, gender } = patientInfo || {};

  if (!name && !age && !gender) {
    return "Patient";
  }

  let description = name || "Patient";

  if (age) {
    description += ` is a ${age}-year-old`;
  }

  if (gender) {
    description += ` ${gender}`;
  }

  return description.trim();
}

// Generate the Subjective section of SOAP notes
function generateSubjectiveSection(patientDescription, extractedInfo) {
  const { symptoms, duration } = extractedInfo;

  let subjective = `${patientDescription} presenting to the clinic`;

  if (symptoms.length > 0) {
    subjective += ` with chief complaint of ${symptoms[0]}`;

    if (symptoms.length > 1) {
      subjective += `. Additional symptoms include ${symptoms
        .slice(1)
        .join(", ")}`;
    }
  }

  if (duration && duration !== "Not specified") {
    subjective += `. Symptoms have been present for ${duration}`;
  }

  subjective += ".";

  return subjective;
}

// Generate the Objective section of SOAP notes
function generateObjectiveSection(extractedInfo) {
  const { vitals } = extractedInfo;

  let objective = "Vitals:";

  if (Object.keys(vitals).length > 0) {
    if (vitals.temperature) {
      objective += ` Temperature ${vitals.temperature}°F,`;
    }

    if (vitals.heartRate) {
      objective += ` Heart Rate ${vitals.heartRate} bpm,`;
    }

    if (vitals.bloodPressure) {
      objective += ` Blood Pressure ${vitals.bloodPressure} mmHg,`;
    }

    if (vitals.respiration) {
      objective += ` Respiratory Rate ${vitals.respiration} breaths/min,`;
    }

    if (vitals.o2Sat) {
      objective += ` Oxygen Saturation ${vitals.o2Sat}%,`;
    }

    // Remove trailing comma
    objective = objective.replace(/,$/, "");
  } else {
    objective += " Not recorded";
  }

  // Add general appearance
  objective += "\n\nGeneral Appearance: Patient appears in no acute distress.";

  return objective;
}

// Generate the Assessment section of SOAP notes
function generateAssessmentSection(extractedInfo) {
  const { symptoms } = extractedInfo;

  if (symptoms.length === 0) {
    return "Assessment deferred pending additional information.";
  }

  // Map common symptoms to potential diagnoses
  const diagnosisMap = {
    pain: "Musculoskeletal pain of undetermined etiology",
    headache: "Cephalgia, possibly tension or migraine type",
    fever: "Febrile illness, possibly viral infection",
    cough: "Upper respiratory tract infection, viral vs. bacterial etiology",
    "sore throat": "Pharyngitis, viral vs. bacterial etiology",
    nausea: "Gastrointestinal distress, possible gastroenteritis",
    vomiting: "Emesis, possible gastroenteritis or food poisoning",
    dizziness: "Vertigo vs. lightheadedness, multiple potential etiologies",
    fatigue: "Fatigue, potentially multifactorial",
  };

  let assessments = [];

  // Look for symptoms in the diagnosis map
  symptoms.forEach((symptom) => {
    for (const [key, diagnosis] of Object.entries(diagnosisMap)) {
      if (symptom.toLowerCase().includes(key)) {
        assessments.push(diagnosis);
        break;
      }
    }
  });

  // Add default assessment if none found
  if (assessments.length === 0) {
    assessments.push(
      "Symptoms of undetermined etiology requiring further evaluation"
    );
  }

  // Remove duplicates
  assessments = [...new Set(assessments)];

  // Format assessment
  let assessment = "";

  assessments.forEach((item, index) => {
    assessment += `${index + 1}. ${item}\n`;
  });

  // Add differential considerations
  assessment += "\nDifferential diagnoses to consider based on presentation.";

  return assessment;
}

// Generate the Plan section of SOAP notes
function generatePlanSection(extractedInfo) {
  const { symptoms } = extractedInfo;

  // Default plans
  let plans = [
    "Complete comprehensive history and physical examination",
    "Consider laboratory studies as indicated by findings",
    "Patient education regarding diagnosis and treatment options",
    "Follow-up appointment to assess response to treatment",
  ];

  // Add symptom-specific plans
  if (
    symptoms.includes("fever") ||
    symptoms.includes("cough") ||
    symptoms.includes("sore throat")
  ) {
    plans.push(
      "Consider antiviral/antibiotic therapy if indicated by clinical findings"
    );
    plans.push("Symptomatic treatment with antipyretics and rest");
  }

  if (symptoms.includes("pain") || symptoms.includes("headache")) {
    plans.push("Pain management with appropriate analgesics");
    plans.push("Referral to specialist if pain is severe or persistent");
  }

  if (symptoms.includes("nausea") || symptoms.includes("vomiting")) {
    plans.push("Hydration therapy and antiemetics as needed");
    plans.push(
      "Limited diet temporarily with gradual advancement as tolerated"
    );
  }

  // Format plan
  let plan = "";

  plans.forEach((item, index) => {
    plan += `${index + 1}. ${item}\n`;
  });

  return plan;
}

module.exports = {
  generateClinicalNotes,
};
