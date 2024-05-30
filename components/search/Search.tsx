import { REQUEST_SECRET, URL_KEYS } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/search.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef, useState } from "react";
import { mapFetcher } from "../../utils/fetchers";
import { setSearchRef } from "../../utils/fetchers/mapFetcher";
import debounce from "../../utils/functions/debounce";
import Url from "../../utils/urlHandler";

const LandingSearch = () => {
  // UZEO SAM DA VRATIM NIZ KAO I KOD HEADER SERACH-A
  const { data } = useSession();
  const searchRef = createRef<HTMLInputElement>();
  const dropdownRef = useRef<any>();
  const [filterButton, setFilterButton] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [activeLink, setActiveLink] = useState("/search");
  const [isInitialInputClick, setIsInitialInputClick] = useState(false);
  const [searchData, setSearchData] = useState<any>([]);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const { push } = useRouter();
  setSearchRef(searchRef);

  const searchHistory = typeof window !== "undefined" && localStorage.getItem("search-history");

  const getSerachHistory = () => searchHistory && JSON.parse(searchHistory);

  const setSearchHistory = value => {
    localStorage.setItem("search-history", JSON.stringify(value));
  };

  const setInputValueToLocalStorage = () => {
    // IF NO HISTORY
    if (!searchHistory && searchRef.current) {
      setSearchHistory([searchRef.current.value]);
    }

    if (searchHistory && searchRef.current) {
      const history = getSerachHistory();
      if (history.length >= 10) {
        const slicedSerachHistory = history.slice(0, 10);
        setSearchHistory([searchRef.current.value, ...slicedSerachHistory]);
        return;
      }
      setSearchHistory([searchRef.current.value, ...history]);
    }
  };

  const handleFilterButton = () => {
    setInputValueToLocalStorage();
    setFilterButton(!filterButton);
    push(activeLink);
    // eslint-disable-next-line
  };

  const getLocalStorageSearchHistory = () => {
    // will get value only when they click once on input
    setDropdownIsOpen(true);
    if (!isInitialInputClick && searchRef.current) {
      const history = getSerachHistory();
      setSearchData(history || []);
    }
    setIsInitialInputClick(true);
  };

  const getSuggestions = () => {
    // fetch suggestion and set suggestions
    if (searchRef.current?.value.trim() === "") return;
    const headers = {
      secretkey: REQUEST_SECRET,
      Authorization: data?.user.token,
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/search/autocomplete?textSearch=${searchRef.current?.value}`, {
        headers,
      })
      .then(({ data: responseData }) => {
        setSearchData(responseData);
      });
    setDropdownIsOpen(true);
    setSuggestions(true);
  };

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!dropdownIsOpen) return;
    const handleClick = ({ target }) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(target) && !searchRef.current?.contains(target)) {
        setDropdownIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [dropdownIsOpen]);

  return (
    <div className={`${styles.search} ${styles.search__landing} `}>
      <div className={`${styles.search__wrapper}`}>
        <input
          className={`${styles.search__input} ${styles["search__input--full-width"]} ${
            searchData && searchData.length > 0 && dropdownIsOpen ? styles.search__inputRadiusModified : ""
          }`}
          placeholder=""
          onChange={({ target }) => {
            if (!target.value) {
              setDropdownIsOpen(false);
            }
            debounce(() => {
              if (target.value !== "") {
                Url.changeParam([URL_KEYS.SEARCH, target.value]);
                getSuggestions();
              } else {
                Url.removeParam(URL_KEYS.SEARCH);
              }
              mapFetcher();
            }, 500);
          }}
          onClick={getLocalStorageSearchHistory}
          ref={searchRef}
          value={searchRef.current?.value}
          type="text"
        />
        <button className={`button buttonImage ${styles.search__button} `} type="button" onClick={handleFilterButton}>
          Search
        </button>
      </div>
      <div className={`${styles.search__show} `}>
        <span>Show on:</span>
        <ul className={styles.secondaryNavigation}>
          <li className={styles.secondaryNavigation__item}>
            <div
              onClick={() => setActiveLink("/search")}
              aria-hidden="true"
              className={activeLink === "/search" ? styles.active : ""}
            >
              <span>
                <Image src={icons.iconMap} alt="map" />
                Map
              </span>
            </div>
          </li>
          <li className={styles.secondaryNavigation__item}>
            <div
              onClick={() => setActiveLink("/lexikon")}
              aria-hidden="true"
              className={activeLink === "/lexikon" ? styles.active : ""}
            >
              <span>
                <Image src={icons.iconList} alt="list" />
                Lexikon
              </span>
            </div>
          </li>
        </ul>
      </div>
      {searchData && dropdownIsOpen && searchData.length > 0 && (
        <div className={styles.search__list__wrapper}>
          <ul
            ref={dropdownRef}
            className={`${styles.search__list}  ${searchData.length > 5 ? styles.search__list__scroll : ""}`}
          >
            {searchData.map(value => {
              return (
                <li
                  key={`SEARCH_DATA_RESULT_${value}`}
                  aria-hidden="true"
                  onClick={() => {
                    if (searchRef.current) {
                      setDropdownIsOpen(false);
                      searchRef.current.value = value;
                      Url.changeParam([URL_KEYS.SEARCH, value]);
                      mapFetcher();
                    }
                  }}
                >
                  <Image
                    src={suggestions ? icons.search : icons.iconReload}
                    alt={`${suggestions ? "serach" : "reload"}-icon`}
                  />
                  <span>{value}</span>
                  <Image src={icons.arrowLeftUp} alt="arrow" />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LandingSearch;
