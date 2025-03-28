const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");

/**
 * Transcribes an audio file using Azure Speech Services
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<string>} The transcribed text
 */
async function transcribeAudio(audioFilePath) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Processing audio file:", audioFilePath);

      // Validate speech credentials
      if (!process.env.SPEECH_KEY || !process.env.SPEECH_REGION) {
        return reject(new Error("Missing Azure Speech service credentials"));
      }

      // Create speech configuration with Azure credentials
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.SPEECH_KEY,
        process.env.SPEECH_REGION
      );

      // Configure the speech service
      speechConfig.speechRecognitionLanguage = "en-US";

      // Create audio config from the file
      // Note: We're using fromWavFileInput which works specifically with WAV files
      // If your file isn't a WAV file, you'll need to convert it first
      const fileExt = path.extname(audioFilePath).toLowerCase();

      let audioConfig;

      if (fileExt === ".wav") {
        // For WAV files, use direct file input
        audioConfig = sdk.AudioConfig.fromWavFileInput(
          fs.readFileSync(audioFilePath)
        );
      } else {
        // For non-WAV files, use push stream approach
        const pushStream = sdk.AudioInputStream.createPushStream();
        const audioData = fs.readFileSync(audioFilePath);
        pushStream.write(audioData);
        pushStream.close();
        audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      }

      // Create recognizer
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      // Start recognition
      recognizer.recognizeOnceAsync(
        (result) => {
          recognizer.close();

          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            console.log("Transcription successful");
            resolve(result.text);
          } else {
            console.error(
              "Speech recognition failed with reason:",
              result.reason
            );
            reject(
              new Error(
                `Speech recognition failed with reason: ${result.reason}`
              )
            );
          }
        },
        (err) => {
          recognizer.close();
          console.error("Error during speech recognition:", err);
          reject(err);
        }
      );
    } catch (error) {
      console.error("Exception in transcribeAudio:", error);
      reject(error);
    }
  });
}

module.exports = {
  transcribeAudio,
};
