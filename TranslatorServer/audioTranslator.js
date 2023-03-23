const sdk = require("microsoft-cognitiveservices-speech-sdk");

class Translator {
    constructor() {

        const translationConfig = sdk.SpeechTranslationConfig.fromSubscription("4841be7b45b14ab58ef98cf417587d28", "eastus");
        translationConfig.speechRecognitionLanguage = "en-US";
        translationConfig.outputFormat = sdk.OutputFormat.Detailed;
        translationConfig.addTargetLanguage('es');
        this.pushStream = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(44100, 32, 1))
        const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
        this.recognizer = new sdk.TranslationRecognizer(translationConfig, audioConfig);
        // Create an AudioConfig to handle the audio data
        this.recognizer.recognizing = (s, e) => {
            console.log(`RECOGNIZING: Text=${e.result.text}`);
        }

        this.recognizer.recognized = (s, e) => {
            if (e.result.errorDetails) {
                console.log(e.result.errorDetails)
            } else {
                console.log(`RECOGNIZED: Text=${e.result.text}`);
                console.log(`RECOGNIZED TRANSLATED: Text = ${e.result.translations.get('es')}` )
            }
            
        }
    }

    startWritingStream() {
        // Start the recognition
        this.recognizer.startContinuousRecognitionAsync(
            () => {
                console.log("Speech recognition started");
            },
            (error) => {
                console.error(error);
            }
        );
    }

    writeToStream(audioBuffer) {
        //console.log(audioBuffer)
        this.pushStream.write(audioBuffer)
    }

    endStream() {
        this.pushStream.close()
        this.recognizer.stopContinuousRecognitionAsync()
    }
}

module.exports = {
    Translator
}