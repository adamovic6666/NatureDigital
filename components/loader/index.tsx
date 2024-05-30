import { SWR_KEYS } from "@nature-digital/constants";
import styles from "@nature-digital/web-styles/components/map.module.scss";
import useSWR from "swr";

export default function Loader() {
  const { data } = useSWR(SWR_KEYS.LOADING);

  if (!data) return null;

  return (
    <div className={styles.loader}>
      <div className={styles.loader__inner}>
        <div className={styles.loader__content}>
          <span className={styles.loader__spinner} />
        </div>
      </div>
    </div>
  );
}
