const sdk = require("microsoft-cognitiveservices-speech-sdk");
require("dotenv").config()


const languages = require("./languages.json").translation

class Translator {
    constructor() {
        this.translationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.KEY, "eastus");
        this.translationConfig.outputFormat = sdk.OutputFormat.Detailed;
        this.translationConfig.speechRecognitionLanguage = "en-US";
        this.translationConfig.addTargetLanguage('es');
    }

    setLanguages(fromLang, toLang) {
        if (!(fromLang in languages) || !(toLang in languages)) {
            return false
        }
        this.fromLang = fromLang;
        this.toLang = toLang;
        this.translationConfig.speechRecognitionLanguage = fromLang; //"en-US";
        this.translationConfig.addTargetLanguage(toLang);
        return true;
    }

    connect(recognizedCallback, recognizingCallback) {

        this.pushStream = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(44100, 32, 1))
        const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
        this.recognizer = new sdk.TranslationRecognizer(this.translationConfig, audioConfig);
        // Create an AudioConfig to handle the audio data
        this.recognizer.recognizing = (s, e) => {
            if (e.result.errorDetails) {
                console.log(e.result.errorDetails)
                recognizingCallback(null, e.result.errorDetails);
            } else {
                recognizingCallback({recognizingText: e.result.text, translatedText: e.result.translations.get(this.toLang)}, null)
            }
        }

        this.recognizer.recognized = (s, e) => {
            if (e.result.errorDetails) {
                console.log(e.result.errorDetails)
                recognizedCallback(null, e.result.errorDetails);
            } else {
                recognizedCallback({recognizedText: e.result.text, translatedText: e.result.translations.get(this.toLang)}, null)
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
        this.pushStream.write(audioBuffer)
    }

    endStream() {
        this.pushStream.close()
        this.recognizer.stopContinuousRecognitionAsync()
    }
}

module.exports = Translator;