import {useState, useRef, useEffect} from 'react'
import styles from "./LanguageDropdown.module.css"

export default function LanguageDropdown({onUpdateLanguage, title}) {

    const availableLanguagesRef = useRef([]);
    const [selectedLanguage, setSelectedLanguage] = useState('es');
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
            <h4 className={styles.title}>{title}</h4>
            {error ? <p>{error}</p> :
            <select value={selectedLanguage} onChange={onSelection} className={styles.customSelect}>
                {availableLanguages.map(lang => {

                    return <option value={lang.code} >{lang.name}</option>
    })}
            </select>}
        </div>
    )
}