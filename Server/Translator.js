const sdk = require("microsoft-cognitiveservices-speech-sdk");
require("dotenv").config()


const toLanguages = require("./languages.json").translation;
const fromLanguages = require("./fromLanguages.json").map((element) => (element.code));
class Translator {
    constructor(fromLang, toLang) {
        this.translationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.KEY, "eastus");
        this.translationConfig.outputFormat = sdk.OutputFormat.Detailed;
        const searchFromResult = fromLanguages.filter((val) => {
            return val === fromLang
        })
        if (searchFromResult.length == 0) {
            throw Error("From language not found.")
        }
        if (!(toLang in toLanguages)) {
            throw Error("To language not found.")
        }
        this.fromLang = fromLang;
        this.toLang = toLang;
        this.translationConfig.speechRecognitionLanguage = fromLang;
        this.translationConfig.addTargetLanguage(toLang);
    }

    connect(recognizedCallback, recognizingCallback) {

        this.pushStream = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(44100, 32, 1))
        const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
        this.recognizer = new sdk.TranslationRecognizer(this.translationConfig, audioConfig);
        // Create an AudioConfig to handle the audio data
        this.recognizer.recognizing = ((s, e) => {
            if (e.result.errorDetails) {
                console.log(e.result.errorDetails)
                recognizingCallback(null, e.result.errorDetails);
            } else {
                recognizingCallback({recognizingText: e.result.text, translatedText: e.result.translations.get(this.toLang)}, null)
            }
        }).bind(this);

        this.recognizer.recognized = ((s, e) => {
            if (e.result.errorDetails) {
                console.log(e.result.errorDetails)
                recognizedCallback(null, e.result.errorDetails);
            } else {
                recognizedCallback({recognizedText: e.result.text, translatedText: e.result.translations.get(this.toLang)}, null)
            }
            
        }).bind(this);
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