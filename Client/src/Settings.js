import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LanguageDropdown from "./Components/LanguageDropdown";
import Header from "./Components/Header";
import Text from "./Components/Text";

export default function Settings(props) {
    const {chrome} = props;

    const [fromLang, setFromLang] = useState("");
    const [toLang, setToLang] = useState("");

    useEffect(() => {
        chrome.storage.sync.get(["fromLang", "toLang"]).then(result => {
            setFromLang(result.fromLang);
            setToLang(result.toLang);
        })
    }, [])

    const fromLanguageChangeHandler = (lang) => {
        setFromLang(lang);
        chrome.storage.sync.set({fromLang: lang});
    }

    const toLanguageChangeHandler = (lang) => {
        setToLang(lang);
        chrome.storage.sync.set({toLang: lang});
    }

    return (
        <div style={{display: "flex", flexDirection: 'column', width: "100%", alignItems: "flex-start"}}>
            <Link to=".." style={{textDecoration: "none"}}state={{from: "settings", langPreferences: JSON.stringify({from: fromLang, to: toLang})}}><Text>Back</Text></Link>
            <Header n={3} style={{alignSelf: "center"}}>Settings</Header>
            <LanguageDropdown onUpdateLanguage={fromLanguageChangeHandler} title="From Language" defaultValue={fromLang}/>
            <LanguageDropdown onUpdateLanguage={toLanguageChangeHandler} title="To Language" defaultValue={toLang}/>
        </div>
    )
}