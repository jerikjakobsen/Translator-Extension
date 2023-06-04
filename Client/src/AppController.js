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
      chrome.runtime.getURL("static/js/IntermediateAudioProcessor.js",),
      getTranslated,
      getTranslated
    );

    return () => {
      // Clean up
      if (translatorRef.current) {
        translatorRef.current.stopTranslating();
        translatorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoElement == null || videoElement == undefined) {
        // add source to audioTranslator for audio
    }
  }, [videoElement])

  const selectVideo = () => {
    setDisableVideoSelector(true);
    outerDocument.addEventListener('click', handleClickEvent);
  };

  const autoSelectVideo = (e) => {
    setDisableVideoSelector(true);
    try {
        let vid = outerDocument.getElementsByTagName('video')[0];
        if (vid.tagName != "VIDEO") {
            setVideoElement(null);
            setDisableVideoSelector(false);
        } else {
            setVideoElement(vid);
            setDisableVideoSelector(true);
        }

    } catch (err) {
        setVideoElement(null);
        setDisableVideoSelector(false);
    }
  }

  const startTranslating = () => {
    translatorRef.current.startTranslating(videoElement, fromLang, toLang);
    setIsTranslating(true);
  };

  const stopTranslating = () => {
    translatorRef.current.stopTranslating();
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
        autoFindVideoHandler={autoSelectVideo}
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
