import styles from './Text.module.css'

export default function Text(props) {
    return (
        <p className={styles.pTag} style={props.style}>{props.children}</p>
    )
}