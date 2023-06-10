import styles from './Button.module.css';

export default function Button(props) {
    const {
        text, 
        onClick,
        disabled,
        style
    } = props

    return (
        <button style={style} onClick={onClick} disabled={disabled} className={styles.translatorButton}>{text}</button>
    )
}