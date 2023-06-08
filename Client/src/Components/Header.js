import styles from './Header.module.css'

export default function Header(props) {
    return (
        <p className={styles.headerTag}>{props.children}</p>
    )
}