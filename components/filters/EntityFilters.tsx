import { TEXTS, URL_KEYS } from "@nature-digital/constants";
import styles from "@nature-digital/web-styles/components/entityFilters.module.scss";
import { useEffect, useState } from "react";
import { mapFetcher } from "../../utils/fetchers";
import Url from "../../utils/urlHandler";

const EntityFilters = () => {
  const [allowGeo, setAllowGeo] = useState<boolean>(String(Url.getParam(URL_KEYS.ALLOWGEO)) === "true");
  const [allowNonGeo, setAllowNonGeo] = useState<boolean>(String(Url.getParam(URL_KEYS.ALLOWNONGEO)) === "true");

  useEffect(() => {
    if (Url.getParam(URL_KEYS.ALLOWGEO) === undefined) {
      setAllowGeo(true);
    }
    if (Url.getParam(URL_KEYS.ALLOWNONGEO) === undefined) {
      setAllowNonGeo(true);
    }
  }, []);

  const updateGeoContentHandler = () => {
    // @ts-ignore
    Url.changeParam([URL_KEYS.ALLOWGEO, !allowGeo]);
    mapFetcher();
    setAllowGeo(!allowGeo);
  };

  const updateNonGeoContentHandler = () => {
    // @ts-ignore
    Url.changeParam([URL_KEYS.ALLOWNONGEO, !allowNonGeo]);
    mapFetcher();
    setAllowNonGeo(!allowNonGeo);
  };

  return (
    <div className={styles.entityFilters}>
      <div className="formItem formTypeCheckbox " aria-hidden="true">
        <div>
          <input type="checkbox" checked={allowGeo} onChange={updateGeoContentHandler} />
          <div onClickCapture={updateGeoContentHandler} className="formTypeCheckbox__label">
            {TEXTS.GEO_TYPE}
          </div>
        </div>
      </div>
      <div className="formItem formTypeCheckbox " aria-hidden="true">
        <div>
          <input type="checkbox" checked={allowNonGeo} onChange={updateNonGeoContentHandler} />
          <div onClickCapture={updateNonGeoContentHandler} className="formTypeCheckbox__label">
            {TEXTS.NON_GEO_TYPE}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityFilters;
