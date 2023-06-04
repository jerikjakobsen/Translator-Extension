import { useState, useEffect, useRef } from 'react';
import './App.css';
import AudioTranslator from './AudioProcessingModules/AudioTranslator'
import LanguageDropdown from './LanguageDropdown';

function App(props) {
  let {chrome, outerDocument, window} = props;

  const [clickedElement, setClickedElement] = useState(null);
  const [elementClickEnabled, setElementClickEnabled] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [startedTranslating, setStartedTranslating] = useState(false);
  const [fromLang, setFromLang] = useState("es");
  const [toLang, setToLang] = useState("en");

  const handleClickEvent = (event) => {
    try {
      if (event.target.tagName != "VIDEO") {
        let videoChild = event.target.getElementsByTagName('video')[0];
        setClickedElement(videoChild);
      } else {
        setClickedElement(event.target);
      }
    } catch (err) {
      setClickedElement(null);
    } finally {
      outerDocument.removeEventListener('click', handleClickEvent);
      setElementClickEnabled(false);
    }
  }
  
  const translatorRef = useRef(null);

  const getTranslated = (recognizedText, translatedText) => {
    setRecognizedText(recognizedText);
    setTranslatedText(translatedText);
  }

  useEffect(() => {

    translatorRef.current = new AudioTranslator(
      chrome.runtime.getURL("static/js/IntermediateAudioProcessor.js")
    );
    translatorRef.current.setReceiveFunctions(getTranslated, getTranslated);

    return () => {
      // Clean up
      if (translatorRef.current) {
        translatorRef.current.stopTranslating();
        translatorRef.current.disconnect();
        translatorRef.current = null;
      }
    };
  }, []);

  const selectVideo = () => {
    window.console.log("setting element click to true")
    setElementClickEnabled(true);
    outerDocument.addEventListener('click', handleClickEvent);
  };

  const startTranslating = () => {
    translatorRef.current.sendLangs(fromLang, toLang);
    translatorRef.current.startTranslating(clickedElement);
    setStartedTranslating(true);
  };

  const stopTranslating = () => {
    translatorRef.current.stopTranslating();
    translatorRef.current.disconnect();
    setStartedTranslating(false);
  }

  const onUpdateFromLanguage = (lang) => {
    setFromLang(lang);
  }
  const onUpdateToLanguage = (lang) => {
    setToLang(lang);
  }

  return (
    <div className="App">
      <button onClick={selectVideo} disabled={elementClickEnabled}>Select Video</button>
      <h2>{clickedElement ? "Video Element Found" : "No Video Element Found"}</h2>
      <LanguageDropdown onUpdateLanguage={onUpdateFromLanguage} title="From Language" defaultValue={fromLang}/>
      <LanguageDropdown onUpdateLanguage={onUpdateToLanguage} title="To Language" defaultValue={toLang}/>
      <button onClick={startTranslating} disabled={startedTranslating}>Start Translating</button>
      <p>{recognizedText.length == 0 ? "No Recognized Text" : recognizedText}</p>
      <p>{translatedText.length == 0 ? "No Translated Text" : translatedText}</p>
      <button onClick={stopTranslating} disabled={!startedTranslating}>Stop Translating</button>
    </div>
  );
}

export default App;
