import io from 'socket.io-client';

let audioContext = new AudioContext();
let processorURL = chrome.runtime.getURL("dist/IntermediateAudioProcessor-bundle.js");
async function createMyAudioProcessor() {
    try {
        audioContext = new AudioContext();
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

function waitForAudio(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

createMyAudioProcessor().then(audioProcessor => {
    const messageChannel = new MessageChannel();
    let socket = io("http://localhost:3000")
    // Send the port to the audio processor
    audioProcessor.port.postMessage({ port: messageChannel.port1 }, [messageChannel.port1]);

    // Receive messages from the audio processor
    messageChannel.port2.onmessage = (event) => {
    if (event.data.type === 'audioData') {
        // Send the audio data to the server using socket.io-client
        socket.emit('audioData', event.data.audioData);
    }
    };
    var vid = document.getElementsByTagName('video')[0]
    console.log("In the Content.js Code")
    if (vid != null) {
        var stream = vid.captureStream()
        let alreadyAdded = false
        stream.addEventListener("addtrack", (event) => {
            if (!alreadyAdded && event.track.kind === 'audio') {
                alreadyAdded = true
                console.log("Creating and connecting node")
                let audioSourceNode = audioContext.createMediaStreamSource(stream)
                audioSourceNode.connect(audioProcessor)
            }
        });
    }
    
})


/*

{
    "manifest_version": 3,
    "name": "Translator",
    "description": "Translating videos on the fly.",
    "version": "1.0",
    "content_scripts": [
        {
            "matches": [
                "<all_urls>"
            ],
            "js": ["dist/bundle.js"]
        }
    ],
    "web_accessible_resources": [
        {
            "resources": ["modules/IntermediateAudioProcessor.js"],
            "matches": ["<all_urls>"]
        }
    ]
}

*/