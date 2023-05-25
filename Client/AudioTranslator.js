import io from 'socket.io-client';

export class AudioTranslator {
    audioContext;
    processorURL = chrome.runtime.getURL("dist/IntermediateAudioProcessor-bundle.js");
    workletNode;
    playing = false;
    socket;
    stream;

    async #createAudioProcessor() {
        try {
            if (!this.audioContext) this.audioContext = new AudioContext({sampleRate: 44100});
            await audioContext.resume();
            await audioContext.audioWorklet.addModule(processorURL, {
                credentials: 'omit',
              });
            this.workletNode = new AudioWorkletNode(audioContext, "intermediate-audio-processor");
        } catch (err) {
            throw err
        }
    }

    async startTranslating(videoElement) {
        try {
            if (!this.workletNode) {
                await this.#createAudioProcessor();
            }
            const messageChannel = new MessageChannel();
            this.socket = io("http://localhost:3000")

            this.workletNode.port.postMessage({ port: messageChannel.port1 }, [messageChannel.port1]);

            messageChannel.port2.onmessage = (event) => {
                if (event.data.type === 'audioData' && this.playing) {
                    // Send the audio data to the server using socket.io-client
                    socket.emit('audioData', new Float32Array(event.data.audioData));
                }
            };

            if (videoElement != null) {
                this.stream = videoElement.captureStream()
                let alreadyAdded = false
                stream.addEventListener("addtrack", (event) => {
                    if (!alreadyAdded && event.track.kind === 'audio') {
                        alreadyAdded = true
                        let audioSourceNode = audioContext.createMediaStreamSource(stream)
                        audioSourceNode.connect(workletNode)
                    }
                });
                videoElement.addEventListener("play", () => {
                    this.playing = true;
                })
                videoElement.addEventListener("pause", () => {
                    this.playing = false;
                })
            }
        } catch (err) {
            throw err
        }
    }

    async stopTranslating() {
        let tracks = this.stream.getTracks();
        for (track in tracks) {
            this.stream.removeTrack(track);
        }
        this.stream = undefined;

        this.socket.disconnect();
        this.socket = undefined;

        playing = false;
    }
}