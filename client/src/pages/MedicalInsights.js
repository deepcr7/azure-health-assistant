import React from "react";

function MedicalInsights({ insights }) {
  if (!insights || !insights.entities || insights.entities.length === 0) {
    return (
      <div className="text-gray-500 italic">No medical entities detected.</div>
    );
  }

  const { entityCategories } = insights;

  // Define colors for different entity categories
  const categoryColors = {
    SymptomOrSign: "bg-red-100 text-red-800",
    MedicationName: "bg-green-100 text-green-800",
    Diagnosis: "bg-purple-100 text-purple-800",
    Treatment: "bg-blue-100 text-blue-800",
    BodyStructure: "bg-yellow-100 text-yellow-800",
    Time: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Medical Entities Detected</h3>

      {Object.keys(entityCategories).map((category) => (
        <div key={category} className="mb-4">
          <h4 className="font-medium mb-2">{formatCategory(category)}</h4>
          <div className="flex flex-wrap gap-2">
            {entityCategories[category].map((entity, index) => (
              <span
                key={index}
                className={`inline-block px-2 py-1 rounded-full text-xs ${
                  categoryColors[category] || "bg-gray-100 text-gray-800"
                }`}
                title={`Confidence: ${Math.round(entity.confidence * 100)}%`}
              >
                {entity.text}
              </span>
            ))}
          </div>
        </div>
      ))}

      {insights.relationships && insights.relationships.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3">Medical Relationships</h3>
          <ul className="list-disc pl-5 space-y-1">
            {insights.relationships.map((relation, index) => (
              <li key={index}>
                <span className="font-medium">{relation.source.text}</span>{" "}
                <span className="italic text-gray-600">
                  {formatRelationType(relation.relationType)}
                </span>{" "}
                <span className="font-medium">{relation.target.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function to format category names
function formatCategory(category) {
  switch (category) {
    case "SymptomOrSign":
      return "Symptoms & Signs";
    case "MedicationName":
      return "Medications";
    case "BodyStructure":
      return "Body Structures";
    default:
      return category.replace(/([A-Z])/g, " $1").trim();
  }
}

// Helper function to format relation types
function formatRelationType(relationType) {
  switch (relationType) {
    case "DosageOfMedication":
      return "has dosage";
    case "FrequencyOfMedication":
      return "has frequency";
    case "RouteOfMedication":
      return "has route";
    case "TimeOfMedication":
      return "taken at";
    case "QualifierOfSymptomOrSign":
      return "qualified by";
    case "TimeOfSymptomOrSign":
      return "occurred at";
    default:
      return relationType
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .trim();
  }
}

export default MedicalInsights;
