import io from 'socket.io-client';

export default class AudioTranslatorSession {
    #socket;
    #audioContext;
    #workletNode;
    #playing;
    #stream;
    #fromLang;
    #toLang;
    #processorURL
    #translatedCallback
    #translatingCallback
    #alreadyAdded;
    #messageChannel

    constructor(fromLang, toLang, videoElement, processorURL, translatedCallback, translatingCallback) {
        
        this.#fromLang = fromLang;
        this.#toLang = toLang;
        this.#processorURL = processorURL;
        this.#translatedCallback = translatedCallback;
        this.#translatingCallback = translatingCallback;
        this.#alreadyAdded = false;
        try {
            if (!videoElement) {
                throw new Error("Video element is not available");
            }

            videoElement.addEventListener("play", (() => {
                this.#playing = true;
            }).bind(this))
            videoElement.addEventListener("pause", (() => {
                this.#playing = false;
            }).bind(this))
            this.#playing = !videoElement.paused;

            this.#stream = videoElement.captureStream();
            if (!this.#stream) {
                throw new Error("Could not create stream from video element");
            }
        } catch (err) {
            throw err;
        }
    }

    #setupSocket() {
        this.#socket = io("http://localhost:3000");
        this.#socket.on("recognizedText", (data => {
            this.#translatedCallback(data.recognizedText, data.translatedText);
        }).bind(this));
        this.#socket.on("recognizingText", (data => {
            this.#translatingCallback(data.recognizingText, data.translatedText);
        }).bind(this));
        this.#socket.emit('initData', {fromLang: this.#fromLang, toLang: this.#toLang});
    }

    async #setupAudio() {
        try {
            // Setup Audio Context
            this.#audioContext = new AudioContext({sampleRate: 44100});
            await this.#audioContext.resume();

            // Setup Audio Worklet Node
            await this.#audioContext.audioWorklet.addModule(this.#processorURL, {
                credentials: 'omit',
            });
            this.#workletNode = new AudioWorkletNode(this.#audioContext, "intermediate-audio-processor");

            this.#messageChannel  = new MessageChannel();

            this.#workletNode.port.postMessage({ port: this.#messageChannel.port1 }, [this.#messageChannel.port1]);

            this.#messageChannel.port2.onmessage = ((event) => {
                if (event.data.type === 'audioData' && this.#playing) {
                    // Send the audio data to the server using socket.io-client
                    this.#socket.emit('audioData', new Float32Array(event.data.audioData));
                }
            }).bind(this);

            let audioSourceNode = this.#audioContext.createMediaStreamSource(this.#stream);
            audioSourceNode.connect(this.#workletNode);
            // this.#stream.addEventListener("addtrack", ((event) => {
            //     if (!this.#alreadyAdded && event.track.kind === 'audio') {
            //         this.#alreadyAdded = true;
            //         let audioSourceNode = this.#audioContext.createMediaStreamSource(this.#stream);
            //         audioSourceNode.connect(this.#workletNode);
            //     }
            // }).bind(this));

        } catch (err) {
            throw err;
        }
    }

    async start() {
            this.#setupSocket();
            await this.#setupAudio();
    }

    stop() {
        this.#stream = null;

        this.#playing = false;

        this.#stream = null;
        if (this.#socket) {
            this.#socket.disconnect();
            this.#socket = null;
        }

        this.#workletNode = null;
        this.#fromLang = null;
        this.#toLang = null;
        this.#processorURL = null;
        this.#translatedCallback = null;
        this.#translatingCallback = null;
    }

}