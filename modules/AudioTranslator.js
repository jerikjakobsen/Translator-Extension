const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.KEY, process.env.SPEECH_REGION);

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"

function translateSpeechToText(stream) {
    //format = sdk.AudioStreamFormat.getWaveFormatPCM(8000, 8, 1)
    speechTranslationConfig.speechRecognitionLanguage = "en-US";
    var language = "es";
    speechTranslationConfig.addTargetLanguage(language);
    let audioConfig = sdk.AudioConfig.fromStreamInput(stream);
    let translationRecognizer = new sdk.TranslationRecognizer(speechTranslationConfig, audioConfig);
    translationRecognizer.recognizeOnceAsync(async result => {
        switch (result.reason) {
            case sdk.ResultReason.TranslatedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                console.log("Translated into [" + language + "]: " + result.translations.get(language));
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                }
                break;
        }
        translationRecognizer.close();
    });
}
module.exports = {
    translateSpeechToText
}