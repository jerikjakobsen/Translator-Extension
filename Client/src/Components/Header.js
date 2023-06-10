import styles from './Header.module.css'

export default function Header(props) {
    return (
        <p className={styles.headerTag} style={{...props.style, fontSize: `${props.n ? props.n * 2 + 16 : 16}px`}}>{props.children}</p>
    )
}