import io from 'socket.io-client';

let audioContext;
let processorURL = chrome.runtime.getURL("dist/IntermediateAudioProcessor-bundle.js");
async function createMyAudioProcessor() {
    console.log("Updated!")
    try {
        if (!audioContext) audioContext = new AudioContext({sampleRate: 44100});
        await audioContext.resume();
        await audioContext.audioWorklet.addModule(processorURL, {
            credentials: 'omit',
          });
    } catch (e) {
        console.log(e);
        return null;
    }

  return new AudioWorkletNode(audioContext, "intermediate-audio-processor");
}

async function waitForAudio() {
    return new Promise(resolve => {
        if (document.getElementsByTagName('video')) {
            return resolve(document.getElementsByTagName('video'));
        }
        console.log("waiting")

        const observer = new MutationObserver(mutations => {
            if (document.getElementsByTagName('video')) {
                resolve(document.getElementsByTagName('video'));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
let playing = false;
createMyAudioProcessor().then(async (audioProcessor) => {
    const messageChannel = new MessageChannel();
    let socket = io("http://localhost:3000")
    // Send the port to the audio processor
    audioProcessor.port.postMessage({ port: messageChannel.port1 }, [messageChannel.port1]);

    // Receive messages from the audio processor
    messageChannel.port2.onmessage = (event) => {
    if (event.data.type === 'audioData') {
        // Send the audio data to the server using socket.io-client
        if (playing) {
            socket.emit('audioData', new Float32Array(event.data.audioData));
        }
    }
    };
    await waitForAudio()
    var vid = document.getElementsByTagName('video')[0]
    console.log("In the Content.js Code")
    if (vid != null) {
        var stream = vid.captureStream()
        let alreadyAdded = false
        stream.addEventListener("addtrack", (event) => {
            if (!alreadyAdded && event.track.kind === 'audio') {
                alreadyAdded = true
                let audioSourceNode = audioContext.createMediaStreamSource(stream)
                audioSourceNode.connect(audioProcessor)
            }
        });
        vid.addEventListener("play", () => {
            playing = true;
        })
        vid.addEventListener("pause", () => {
            playing = false;
        })
    }
    
})
