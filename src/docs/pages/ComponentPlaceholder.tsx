import styles from './ComponentPlaceholder.module.css'

export interface ComponentPlaceholderProps {
  name: string
  className?: string
}

export function ComponentPlaceholder({ name, className }: ComponentPlaceholderProps) {
  return (
    <div className={`${styles.page} ${className ?? ''}`}>
      <h1 className={styles.title}>{name}</h1>
      <div className={styles.placeholder}>
        <p className={styles.text}>
          This component has not been built yet.
        </p>
      </div>
    </div>
  )
}
