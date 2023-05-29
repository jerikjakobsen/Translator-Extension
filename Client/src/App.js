import { useState, useEffect, useRef } from 'react';
import './App.css';
import AudioTranslator from './AudioProcessingModules/AudioTranslator'
import LanguageDropdown from './LanguageDropdown';

function App(props) {
  let {chrome, outerDocument, window} = props;
  
  const translatorRef = useRef(null);

  useEffect(() => {
    window.console.log()
    translatorRef.current = new AudioTranslator(
      chrome.runtime.getURL("static/js/IntermediateAudioProcessor.js")
    );
    translatorRef.current.setReceiveFunctions(
      (recognizedText, translatedText) => {
        setRecognizedText(recognizedText);
        setTranslatedText(translatedText);
      },
      (recognizedText, translatedText) => {}
    );

    return () => {
      // Clean up the translator connection when the component unmounts
      if (translatorRef.current) {
        translatorRef.current.stopTranslating();
        translatorRef.current.disconnect();
        translatorRef.current = null;
      }
    };
  }, [chrome.runtime]);
  const [clickedElement, setClickedElement] = useState(null);
  const [elementClickEnabled, setElementClickEnabled] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [startedTranslating, setStartedTranslating] = useState(false);
  const [fromLang, setFromLang] = useState("es");
  const [toLang, setToLang] = useState("en");

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
      setClickedElement(null);
    } finally {
      setElementClickEnabled(false);
    }
  });

  const selectVideo = () => {
    setElementClickEnabled(true);
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
      <LanguageDropdown onUpdateLanguage={onUpdateFromLanguage} title="From Language"/>
      <LanguageDropdown onUpdateLanguage={onUpdateToLanguage} title="To Language"/>
      <button onClick={startTranslating} disabled={startedTranslating}>Start Translating</button>
      <p>{recognizedText.length == 0 ? "No Recognized Text" : recognizedText}</p>
      <p>{translatedText.length == 0 ? "No Translated Text" : translatedText}</p>
      <button onClick={stopTranslating} disabled={startedTranslating}>Stop Translating</button>
    </div>
  );
}

export default App;
