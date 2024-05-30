import { SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/sort.module.scss";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { mapFetcher } from "../../utils/fetchers";
import Url from "../../utils/urlHandler";
import { setTeaserSize } from "../category/Category";

const { moreTeasers, lessTeasers } = icons;

const Sort = () => {
  const { data: searchData } = useSWR<SWRTypes["SEARCH"]>(SWR_KEYS.SEARCH);
  const noResults = Array.isArray(searchData) && searchData.length === 0;
  const [display, setDisplay] = useState(false);
  // @ts-ignore
  const [sorted, setSorted] = useState<boolean>(String(Url.getParam(URL_KEYS.SEASON)) === "true");

  const handleDisplayTeasers = useCallback(() => {
    setDisplay(!display);
    setTeaserSize(display ? 220 : 300);
    localStorage.setItem("teaser-card-size", JSON.stringify(display ? 220 : 300));
  }, [display]);

  useEffect(() => {
    if (localStorage.getItem("teaser-card-size")) {
      const teaserCardSize = localStorage.getItem("teaser-card-size");
      const parsedValue = teaserCardSize && JSON.parse(teaserCardSize);
      setDisplay(parsedValue === 300);
    }
  }, []);

  return (
    <div className={styles.sort}>
      <div className={styles.sortItem}>
        <label htmlFor="switch" className={sorted ? "switch" : "switch switch__disabled"}>
          <input
            id="switch"
            type="checkbox"
            checked={sorted}
            onChange={e => {
              // @ts-ignore
              Url.changeParam([URL_KEYS.SEASON, e.target.checked]);

              mapFetcher();
              setSorted(e.target.checked);
            }}
          />
          <span className={`slider ${noResults && styles.sort__slider__disable}`} />
        </label>
        <span>Aktuell sichtbar</span>
      </div>
      <div className={styles.sort__display}>
        <button
          className={`${
            display
              ? `${styles.sort__displayButton} ${styles.moreTeasers}`
              : `${styles.sort__displayButton} ${styles.lessTeasers}`
          } ${noResults && styles.sort__displayButton__disable}`}
          type="button"
          onClick={handleDisplayTeasers}
        >
          <Image className={styles.sort__moreTeasers} src={moreTeasers} alt="more teasers" />
          <Image className={styles.sort__lessTeasers} src={lessTeasers} alt="less teasers" />
        </button>
      </div>
    </div>
  );
};

export default Sort;
