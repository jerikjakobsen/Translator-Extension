import './App.css';
import LanguageDropdown from './LanguageDropdown';

function AppView(props) {
  let {selectVideoHandler,
    fromLanguageChangeHandler,
    toLanguageChangeHandler,
    startTranslatingHandler,
    stopTranslatingHandler,
    disableVideoSelector = false,
    videoElementFound = false,
    isTranslating = false,
    fromLanguage = 'en', 
    toLanguage = 'es',
    recognizedText = 'No text recognized',
    translatedText = 'No text translated',
  } = props;

  return (
    <div className="App">
      <button onClick={selectVideoHandler} disabled={disableVideoSelector}>Select Video</button>
      <h2>{videoElementFound ? "Video Element Found" : "No Video Element Found"}</h2>
      <LanguageDropdown onUpdateLanguage={fromLanguageChangeHandler} title="From Language" defaultValue={fromLanguage}/>
      <LanguageDropdown onUpdateLanguage={toLanguageChangeHandler} title="To Language" defaultValue={toLanguage}/>
      <button onClick={startTranslatingHandler} disabled={isTranslating}>Start Translating</button>
      <p>{recognizedText.length == 0 ? "No Recognized Text" : recognizedText}</p>
      <p>{translatedText.length == 0 ? "No Translated Text" : translatedText}</p>
      <button onClick={stopTranslatingHandler} disabled={!isTranslating}>Stop Translating</button>
    </div>
  );
}

export default AppView;
