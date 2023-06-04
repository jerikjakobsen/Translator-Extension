import io from 'socket.io-client';

export default class AudioTranslator {
    constructor(processorURL) {
        this.audioContext = null;
        this.processorURL = processorURL;
        this.workletNode = null;
        this.playing = false;
        this.socket = io("http://localhost:3000")
        this.stream = null;
    }

    setReceiveFunctions(translatedCallback, translatingCallback) {
        this.socket.off("recognizedText");
        this.socket.off("recognizingText");
        this.socket.on("recognizedText", data => {
            translatedCallback(data.recognizedText, data.translatedText);
        });
        this.socket.on("recognizingText", data => {
            translatingCallback(data.recognizingText, data.translatedText);
        });
    }

    async #createAudioProcessor() {
        try {
            if (!this.audioContext) this.audioContext = new AudioContext({sampleRate: 44100});
            await this.audioContext.resume();
            await this.audioContext.audioWorklet.addModule(this.processorURL, {
                credentials: 'omit',
              });
            this.workletNode = new AudioWorkletNode(this.audioContext, "intermediate-audio-processor");
            const messageChannel = new MessageChannel();

            this.workletNode.port.postMessage({ port: messageChannel.port1 }, [messageChannel.port1]);

            messageChannel.port2.onmessage = ((event) => {
                if (event.data.type === 'audioData' && this.playing) {
                    // Send the audio data to the server using socket.io-client
                    this.socket.emit('audioData', new Float32Array(event.data.audioData));
                }
            }).bind(this);
        } catch (err) {
            throw err;
        }
    }

    async sendLangs(fromLang, toLang) {
        this.socket.emit('initData', {fromLang, toLang});
    }
    
    #connectAudioSource(event) {
        if (!this.alreadyAdded && event.track.kind === 'audio') {
            this.alreadyAdded = true;
            let audioSourceNode = this.audioContext.createMediaStreamSource(this.stream);
            audioSourceNode.connect(this.workletNode);
        }
    }

    setStreamSourceToNode() {
        this.stream.removeEventListener("addtrack", this.#connectAudioSource.bind(this));
        this.alreadyAdded = false;
        this.stream.addEventListener("addtrack", this.#connectAudioSource.bind(this));
    }

    async startTranslating(videoElement) {
        try {
            if (!this.workletNode) {
                await this.#createAudioProcessor();
            }

            if (!videoElement) {
                throw new Error("Video element is not available");
            }

            videoElement.addEventListener("play", (() => {
                this.playing = true;
            }).bind(this))
            videoElement.addEventListener("pause", (() => {
                this.playing = false;
            }).bind(this))
            this.playing = !videoElement.paused;
            
            this.stream = videoElement.captureStream();
            if (!this.stream) {
                throw new Error("Could not create stream from video element");
            }
            
            this.setStreamSourceToNode();
        } catch (err) {
            throw err;
        }
    }

    async stopTranslating() {
        if (this.stream) {
            let tracks = this.stream.getTracks();
            for (var track in tracks) {
                this.stream.removeTrack(track);
            }
        }

        this.playing = false;

        this.stream = null;
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}