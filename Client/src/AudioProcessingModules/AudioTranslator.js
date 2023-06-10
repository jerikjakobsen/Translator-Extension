import io from 'socket.io-client';
import AudioTranslatorSession from './AudioTranslatorSession';

export default class AudioTranslator {
    constructor(processorURL, translatedCallback, translatingCallback) {
        this.processorURL = processorURL;
        this.translatedCallback = translatedCallback;
        this.translatingCallback = translatingCallback;
        this.audioTranslatorSession = null;
    }

    async startTranslating(videoElement, fromLang, toLang) {
        this.audioTranslatorSession = new AudioTranslatorSession(fromLang, toLang, videoElement, this.processorURL, this.translatedCallback, this.translatedCallback);
        this.audioTranslatorSession.start();
    }

    async stopTranslating() {
        if (this.audioTranslatorSession) {
            this.audioTranslatorSession.stop();
        }
        this.audioTranslatorSession = null;
    }
}