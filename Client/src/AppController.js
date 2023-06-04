import { useState, useEffect, useRef } from 'react';
import AudioTranslator from './AudioProcessingModules/AudioTranslator'
import AppView from './AppView';

function AppController(props) {
  let {chrome, outerDocument, window} = props;

  const [videoElement, setVideoElement] = useState(null);
  const [disableVideoSelector, setDisableVideoSelector] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang, setFromLang] = useState("es");
  const [toLang, setToLang] = useState("en");

  const handleClickEvent = (event) => {
    event.preventDefault();
    try {
      if (event.target.tagName != "VIDEO") {
        let videoChild = event.target.getElementsByTagName('video')[0];
        if (videoChild.tagName != "VIDEO") {
            setVideoElement(null);
          setDisableVideoSelector(false);
        } else {
        setVideoElement(videoChild);
          setDisableVideoSelector(true);
        }
      } else {
        setVideoElement(event.target);
        setDisableVideoSelector(true);
      }
    } catch (err) {
        setVideoElement(null);
      setDisableVideoSelector(false);
    } finally {
      outerDocument.removeEventListener('click', handleClickEvent);
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

  useEffect(() => {
    
  }, [videoElement])

  const selectVideo = () => {
    setDisableVideoSelector(true);
    outerDocument.addEventListener('click', handleClickEvent);
  };

  const startTranslating = () => {
    translatorRef.current.sendLangs(fromLang, toLang);
    translatorRef.current.startTranslating(videoElement);
    setIsTranslating(true);
  };

  const stopTranslating = () => {
    translatorRef.current.stopTranslating();
    translatorRef.current.disconnect();
    setIsTranslating(false);
  }

  const onUpdateFromLanguage = (lang) => {
    setFromLang(lang);
  }
  const onUpdateToLanguage = (lang) => {
    setToLang(lang);
  }

  return (
    <AppView 
        selectVideoHandler={selectVideo}
        fromLanguageChangeHandler={onUpdateFromLanguage}
        toLanguageChangeHandler={onUpdateToLanguage}
        startTranslatingHandler={startTranslating}
        stopTranslatingHandler={stopTranslating}
        disableVideoSelector={disableVideoSelector}
        videoElementFound={videoElement != null && videoElement != undefined}
        isTranslating={isTranslating}
        fromLanguage={fromLang}
        toLanguage={toLang}
        recognizedText={recognizedText}
        translatedText={translatedText}
    >
    </AppView>
  );
}

export default AppController;
