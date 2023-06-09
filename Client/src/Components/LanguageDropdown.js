import {useState, useRef, useEffect} from 'react'
import Header from "./Header"
import Text from './Text'
import styles from "./LanguageDropdown.module.css"

export default function LanguageDropdown({onUpdateLanguage, title, defaultValue}) {

    const availableLanguagesRef = useRef([]);
    const [selectedLanguage, setSelectedLanguage] = useState(defaultValue);
    const [availableLanguages, setAvailableLanguages] = useState(availableLanguagesRef.current);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/availableLanguages")
        .then(async res => {
            const json = await res.json();
            availableLanguagesRef.current = json;
            setAvailableLanguages(availableLanguagesRef.current);
        })
        .catch((err) => {

            setError(err.message);
        })
    }, []);

    const onSelection = (event) => {
        setSelectedLanguage(event.target.value);
        onUpdateLanguage(event.target.value);
    }
    return (
        <div className={styles.container}>
            <Header>{title}</Header>
            {error ? <Text>{error}</Text> :
            <select value={selectedLanguage} onChange={onSelection} className={styles.customSelect} >
                {availableLanguages.map(lang => {
                    return <option value={lang.code} >{lang.name}</option>
                })}
            </select>}
        </div>
    )
}