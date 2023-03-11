const sdk = require("microsoft-cognitiveservices-speech-sdk");

let audioContext = new AudioContext();
let processorURL = chrome.runtime.getURL("modules/IntermediateAudioProcessor.js");
async function createMyAudioProcessor() {
    try {
        //audioContext = new AudioContext();
        //await audioContext.resume();
        console.log(audioContext)
        await audioContext.audioWorklet.addModule(processorURL, {
            credentials: 'omit',
          });
    } catch (e) {
        console.log(e)
        return null;
    }

  return new AudioWorkletNode(audioContext, "intermediate-audio-processor");
}

createMyAudioProcessor().then(x => {
    console.log(x)
    intercepterWorkletNode = x
    var vid = document.getElementsByTagName('video')[0]
    console.log("In the Content.js Code")
    if (vid != null) {
        var stream = vid.captureStream()
        console.log(stream.getAudioTracks())
        console.log(intercepterWorkletNode)
        let audioSourceNode = audioContext.createMediaStreamSource(stream)
        audioSourceNode.connect(intercepterWorkletNode)
        // vid.onplay = () => {
            
        // }
    }
    
})
