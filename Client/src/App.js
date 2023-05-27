import { useState } from 'react';
import './App.css';
import AudioTranslator from './AudioProcessingModules/AudioTranslator'

function App(props) {
  let {chrome, outerDocument} = props;
  const translator = new AudioTranslator(chrome.runtime.getURL("../build/static/js/IntermediateAudioProcessor.js"));
  const [clickedElement, setClickedElement] = useState(undefined);
  const [elementClickEnabled, setElementClickEnabled] = useState(false);
  outerDocument.addEventListener('click', (event) => {
    if (!elementClickEnabled) {
      return
    }
    try {
      if (event.target.tagName != "VIDEO") {
        let videoChild = event.target.getElementsByTagName('video')[0];
        setClickedElement(videoChild);
      } else {
        setClickedElement(event.target);
      }
    } catch (err) {
      setClickedElement(undefined);
    } finally {
      setElementClickEnabled(false);
    }
  });

  const selectVideo = () => {
    setElementClickEnabled(true);
  };

  const startTranslating = () => {
    translator.startTranslating(clickedElement);
  };

  return (
    <div className="App">
      <h1>ELEMENT: {clickedElement ? clickedElement.tagName : "No element selected"}</h1>
      <button onClick={selectVideo} disabled={elementClickEnabled}>Select Video</button>
      <h2>{clickedElement ? "Video Element Found" : "No Video Element Found"}</h2>
      <button onClick={} disabled={}>Start Translating</button>
    </div>
  );
}

export default App;
