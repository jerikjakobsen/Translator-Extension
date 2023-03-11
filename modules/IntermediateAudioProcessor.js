import * as sdk from "microsoft-cognitiveservices-speech-sdk"
import { translateSpeechToText } from "./AudioTranslator.js";

class IntermediateAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()

    this.pushStream = sdk.AudioInputStream.createPushStream();
    translateSpeechToText(this.pushStream);
  }
  process(inputs, outputs, parameters) {
    //console.log("In the Audio Processor Code")
    this.pushStream.write(inputs[0][0].buffer)
    return true;
  }
}
  
registerProcessor("intermediate-audio-processor", IntermediateAudioProcessor);