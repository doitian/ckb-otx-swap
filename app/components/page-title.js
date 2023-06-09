import * as styles from "../styles";

export default function PageTitle({ children }) {
  return <h2 class={styles.pageTitle}>{children}</h2>;
}
