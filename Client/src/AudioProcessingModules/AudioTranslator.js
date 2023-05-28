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
            translatingCallback(data.recognizedText, data.translatedText);
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
        } catch (err) {
            throw err;
        }
    }

    async startTranslating(videoElement) {
        try {
            if (!this.workletNode) {
                await this.#createAudioProcessor();
            }
            const messageChannel = new MessageChannel();

            this.workletNode.port.postMessage({ port: messageChannel.port1 }, [messageChannel.port1]);

            messageChannel.port2.onmessage = ((event) => {
                if (event.data.type === 'audioData' && this.playing) {
                    // Send the audio data to the server using socket.io-client
                    this.socket.emit('audioData', new Float32Array(event.data.audioData));
                }
            }).bind(this);

            if (videoElement != null) {
                this.stream = videoElement.captureStream();
                let alreadyAdded = false;
                this.stream.addEventListener("addtrack", ((event) => {
                    if (!alreadyAdded && event.track.kind === 'audio') {
                        alreadyAdded = true;
                        let audioSourceNode = this.audioContext.createMediaStreamSource(this.stream);
                        audioSourceNode.connect(this.workletNode);
                    }
                }).bind(this));
                videoElement.addEventListener("play", () => {
                    this.playing = true;
                })
                videoElement.addEventListener("pause", () => {
                    this.playing = false;
                })
            }
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
    }

    async disconnect() {
        this.stream = null;
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}