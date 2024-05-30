import styles from "@nature-digital/web-styles/components/tags.module.scss";
import { createRef, useEffect, useRef, useState } from "react";
import icons from "@nature-digital/web-styles";
import Image from "next/image";

import { CategoryType } from "@nature-digital/types";

const Tags = ({ data }: { data: CategoryType[] }) => {
  const tagsRef = createRef<HTMLElement>();
  const dropdownRef = useRef<any>();
  const [open, setOpen] = useState(false);

  const openCategoryDropdown = (categories: CategoryType[]) => {
    if (categories?.length <= 1) {
      return;
    }

    setOpen(!open);
  };

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!open) return;
    const handleClick = ({ target }) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(target) && !tagsRef.current?.contains(target)) {
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
    <div
      ref={dropdownRef}
      className={open ? `${styles.tags} tags ${styles.tags__expand}` : `${styles.tags} tags`}
      id="tags"
    >
      <div
        className={open ? `${styles.tags__list} ${styles.tags__list__expanded}` : `${styles.tags__list} `}
        onClick={() => {
          openCategoryDropdown(data);
        }}
        aria-hidden="true"
      >
        <div className={`${styles.tags__wrap} ${data?.length <= 1 ? styles["tags__wrap--singleItem"] : ""}`}>
          <li key={`TAGS_CATEGORIES_FIRST_ITEM_${data?.[0]?._id}`} className={styles.tags__list__item}>
            <span className={styles.tags__list__name}>{firstItem?.name}</span>
          </li>

          {data?.length > 1 && (
            <button type="button" className={`${styles.tags__button}`}>
              <Image src={icons.arrowWhite} alt="arrow white" />
            </button>
          )}
        </div>

        {data?.length > 1 && (
          <ul className={styles.tags__list__dropdown}>
            {data.map(({ name, _id }) => {
              return (
                <li key={`TAGS_CATEGORIES_ITEM_${_id}`} className={styles.tags__list__item}>
                  <span className={styles.tags__list__name}>{name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Tags;
