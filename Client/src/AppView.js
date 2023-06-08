import './App.css';
import LanguageDropdown from './Components/LanguageDropdown';
import SelectVideoView from './Components/SelectVideoView';
import Button from './Components/Button'
import React from 'react';

function AppView(props) {
  const {selectVideoHandler,
    autoFindVideoHandler,
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
      <SelectVideoView 
        selectVideoHandler={selectVideoHandler}
        autoFindVideoHandler={autoFindVideoHandler}
        disableVideoSelector={disableVideoSelector}
        videoElementFound={videoElementFound}
      />
      <LanguageDropdown onUpdateLanguage={fromLanguageChangeHandler} title="From Language" defaultValue={fromLanguage}/>
      <LanguageDropdown onUpdateLanguage={toLanguageChangeHandler} title="To Language" defaultValue={toLanguage}/>
      <Button onClick={startTranslatingHandler} disabled={isTranslating || !videoElementFound} text="Start Translating"/>
      <p>{recognizedText.length == 0 ? "No Recognized Text" : recognizedText}</p>
      <p>{translatedText.length == 0 ? "No Translated Text" : translatedText}</p>
      <Button onClick={stopTranslatingHandler} disabled={!isTranslating || !videoElementFound} text="Stop Translating"/>
    </div>
  );
}

export default AppView;
