import './App.css';
import Text from './Components/Text';
import SelectVideoView from './Components/SelectVideoView';
import Header from './Components/Header';
import Button from './Components/Button';
import React from 'react';
import {Link} from 'react-router-dom';

function AppView(props) {
  const {selectVideoHandler,
    autoFindVideoHandler,
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
      <Link to="/settings" style={{alignSelf: "flex-end", textDecoration: "none"}} state={{from: "main", langPreferences: JSON.stringify({from: fromLanguage, to: toLanguage})}}><Text>Settings</Text></Link>
      <Header n={3}>Translator</Header>
      <SelectVideoView 
        selectVideoHandler={selectVideoHandler}
        autoFindVideoHandler={autoFindVideoHandler}
        disableVideoSelector={disableVideoSelector}
        videoElementFound={videoElementFound}
      />
      <Text>{`${fromLanguage} -> ${toLanguage}`}</Text>
      <Button onClick={startTranslatingHandler} disabled={isTranslating || !videoElementFound} text="Start Translating"/>
      <p>{recognizedText.length == 0 ? "No Recognized Text" : recognizedText}</p>
      <p>{translatedText.length == 0 ? "No Translated Text" : translatedText}</p>
      <Button onClick={stopTranslatingHandler} disabled={!isTranslating || !videoElementFound} text="Stop Translating"/>
    </div>
  );
}

export default AppView;
