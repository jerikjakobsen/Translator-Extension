console.log("Ran processor code")

class IntermediateAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
  }
  process(inputs, outputs, parameters) {
    //console.log("In the Audio Processor Code")
    return true;
  }
}
  
registerProcessor("intermediate-audio-processor", IntermediateAudioProcessor);