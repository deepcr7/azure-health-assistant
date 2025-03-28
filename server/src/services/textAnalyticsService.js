const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");

// Initialize Text Analytics client
const textAnalyticsClient = new TextAnalyticsClient(
  process.env.TEXT_ANALYTICS_ENDPOINT,
  new AzureKeyCredential(process.env.TEXT_ANALYTICS_KEY)
);

/**
 * Analyzes clinical text to extract medical entities
 * @param {string} text - The medical text to analyze
 * @returns {Promise<Object>} Extracted medical entities and relationships
 */
async function analyzeMedicalText(text) {
  try {
    console.log("Analyzing medical text...");

    // Use Text Analytics for Health to analyze medical entities
    const healthDocuments = [{ id: "1", language: "en", text }];
    const healthResult =
      await textAnalyticsClient.beginAnalyzeHealthcareEntities(healthDocuments);

    // Get results
    const results = await healthResult.pollUntilDone();
    let document;
    for await (const result of results) {
      document = result;
    }

    // Process the results
    if (!document || !document.entities || document.entities.length === 0) {
      return {
        entities: [],
        relationships: [],
      };
    }

    // Map the entities to a simpler format
    const entities = document.entities.map((entity) => ({
      text: entity.text,
      category: entity.category,
      subcategory: entity.subcategory || null,
      confidence: entity.confidenceScore,
      offset: entity.offset,
      length: entity.length,
    }));

    // Map relationships to a simpler format
    const relationships = document.entityRelations.map((relation) => ({
      relationType: relation.relationType,
      source: {
        text:
          document.entities.find((e) => e.id === relation.sourceEntityId)
            ?.text || "",
        category:
          document.entities.find((e) => e.id === relation.sourceEntityId)
            ?.category || "",
      },
      target: {
        text:
          document.entities.find((e) => e.id === relation.targetEntityId)
            ?.text || "",
        category:
          document.entities.find((e) => e.id === relation.targetEntityId)
            ?.category || "",
      },
    }));

    // Organize entities by category
    const entityCategories = {};
    entities.forEach((entity) => {
      if (!entityCategories[entity.category]) {
        entityCategories[entity.category] = [];
      }
      entityCategories[entity.category].push(entity);
    });

    return {
      entities,
      relationships,
      entityCategories,
    };
  } catch (error) {
    console.error("Error in health text analysis:", error);
    throw error;
  }
}

module.exports = {
  analyzeMedicalText,
};
