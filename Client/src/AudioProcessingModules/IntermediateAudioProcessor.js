class IntermediateAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    console.log("In the Audio Processor Code")
    
    this.messagingPort = null;
    this.port.onmessage = (event) => {
      if (event.data.port) {
        this.messagingPort = event.data.port;
        this.messagingPort.start();
      }
    };
  }
  process(inputs, outputs, parameters) {
    if (inputs[0] && inputs[0][0]) {
      let audioData = inputs[0][0].buffer
      
      this.messagingPort.postMessage({ type: 'audioData', audioData: audioData }, [audioData]);
    }
    return true;
  }
}
  
registerProcessor("intermediate-audio-processor", IntermediateAudioProcessor);