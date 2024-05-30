import styles from "@nature-digital/web-styles/components/danger.module.scss";
import { createRef, useEffect, useRef, useState } from "react";

const Danger = ({ data }) => {
  const dangerRef = createRef<HTMLElement>();
  const dropdownRef = useRef<any>();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!open) return;
    const handleClick = ({ target }) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(target) && !dangerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [open]);

  const firstItem = data[0];

  return (
    <div ref={dropdownRef} className={open ? `${styles.danger} ${styles.danger__open}` : `${styles.danger}`}>
      <div className={styles.danger__button} onClick={handleOpen} aria-hidden="true" id="danger">
        <div className={`${styles.danger__button__wrap} ${styles.danger__item}`}>
          <span className={styles.danger__list__color} style={{ backgroundColor: firstItem?.color }} />
          <span className={`${styles.danger__list__name} ${styles.danger__name}`}>{firstItem?.name}</span>
        </div>
        {data.length && (
          <button
            type="button"
            className={
              open
                ? `${styles.danger__listDropdown__button} ${styles.danger__listDropdown__button__open}`
                : `${styles.danger__listDropdown__button}`
            }
          >
            +
          </button>
        )}
      </div>
      {data && data.length && (
        <ul className={open ? `${styles.danger__list}` : `${styles.danger__list} ${styles.danger__list__closed}`}>
          {data.map(({ name, color }) => {
            return (
              <li
                key={`DANGER_DROPDOWN_ITEM_${name}_${color}`}
                className={`${styles.danger__list__item} ${styles.danger__item}`}
              >
                <span className={styles.danger__list__color} style={{ backgroundColor: color }} />
                <span className={styles.danger__list__name}>{name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Danger;
