import { API_ENDPOINTS, REQUEST_SECRET, SWR_KEYS, URL_KEYS, WEB_PAGES } from "@nature-digital/constants";
import { FilterDataType, SWRTypes } from "@nature-digital/types";

import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/search.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { mapFetcher } from "../../utils/fetchers";
import filtersFetcher from "../../utils/fetchers/filtersFetcher";
import { setSearchRef } from "../../utils/fetchers/mapFetcher";
import debounce from "../../utils/functions/debounce";
import Url from "../../utils/urlHandler";
import Backdrop from "../backdrop/Backdrop";
import NoResultsParagraph from "../paragraphs/NoResultsParagraph";
import Portal from "../portal/Portal";

const HeaderSearch = () => {
  const searchRef = useRef<any>();
  const dropdownRef = useRef<any>();
  const { data } = useSession();
  const { data: state, mutate: filterMutate } = useSWR<SWRTypes["FILTER"]>(SWR_KEYS.FILTER);
  const { mutate: mutateSearchState } = useSWR<SWRTypes["SEARCH_STATE"]>(SWR_KEYS.SEARCH_STATE);
  const { data: reset_filters, mutate: mutateReset } = useSWR<SWRTypes["RESET_FILTERS"]>(SWR_KEYS.RESET_FILTERS);
  const { data: filters = Url.getParams() || {}, mutate: m } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const { mutate: mutatePredefinedFiltersState } = useSWR<SWRTypes["PREDEFINEDFILTERS_STATE"]>(
    SWR_KEYS.PREDEFINEDFILTERS_STATE,
  );
  const { mutate: setActiveList } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);
  const { mutate: mutateArticleSliderState } = useSWR<SWRTypes["ARTICLE_SLIDER_STATE"]>(SWR_KEYS.ARTICLE_SLIDER_STATE);
  const [searchData, setSearchData] = useState<any>([]);
  const [textSearch, setTextSearch] = useState<any>();
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enterIsClicked, setEnterIsClicked] = useState(false);
  const [isAnimatedBtn, setIsAnimatedBtn] = useState(false);
  const { push, pathname } = useRouter();

  const isSearchOrMapPage = pathname === WEB_PAGES.MAP || pathname === WEB_PAGES.LIST;
  const isMapPage = pathname === WEB_PAGES.MAP;
  const isListPage = pathname === WEB_PAGES.LIST;

  setSearchRef(searchRef);

  const searchHistory = typeof window !== "undefined" && localStorage.getItem("search-history");
  const getSearchHistory = () => searchHistory && JSON.parse(searchHistory);
  const setSearchHistory = value => localStorage.setItem("search-history", JSON.stringify(value));

  const updateHistoryAndSearchData = searchedData => {
    setSearchHistory(searchedData);
    setSearchData(searchedData);
  };

  useEffect(() => {
    setIsAnimatedBtn(!!filters?.hasOwnProperty("filterType"));
  }, [filters]);

  const setInputValueToLocalStorage = (textSearchValue: string) => {
    // IF NO HISTORY

    if (textSearchValue.trim() === "") return;

    if (!searchHistory && textSearchValue) {
      setSearchHistory([textSearchValue]);
    }

    if (searchHistory && searchRef.current) {
      const history = getSearchHistory();

      // CHECK IF VALUE IN HISTORY ALREADY EXISTS
      if (history.includes(textSearchValue)) {
        const updatedHistory = history.filter(value => value !== textSearchValue);
        updateHistoryAndSearchData([textSearchValue, ...updatedHistory]);
        return;
      }

      if (history.length >= 10) {
        const slicedSerachHistory = history.slice(0, 9);
        updateHistoryAndSearchData([textSearchValue, ...slicedSerachHistory]);
        return;
      }
      updateHistoryAndSearchData([textSearchValue, ...history]);
    }
  };

  const handleFilterButton = useCallback(() => {
    if (state) {
      filterMutate({ ...state, state: !state.state });
      mutate(SWR_KEYS.FILTER, (prevData: FilterDataType) => filtersFetcher(prevData, !state.state));
    }
  }, [state, filterMutate]);

  const getSuggestions = (enterKeyIsClicked = false) => {
    // fetch suggestion and set suggestions
    if (searchRef.current?.value.trim() === "") return;

    let searchValue;

    if (enterKeyIsClicked) {
      searchValue = textSearch;
    } else {
      searchValue = searchRef.current ? searchRef.current?.value : Url.getParam(URL_KEYS.SEARCH);
    }

    if (searchValue && searchValue?.length < 4 && searchValue?.length > 0) return;

    const headers = {
      secretkey: REQUEST_SECRET,
      Authorization: data?.user.token,
    };
    !enterKeyIsClicked &&
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.AUTOCOMPLETE(searchValue as string), {
          headers,
        })
        .then(({ data: responseData }) => {
          setSearchData(responseData);
          // CHECK THIS
          const noResults = (responseData.length === 0 && !enterKeyIsClicked) || responseData.length > 0;
          if (Array.isArray(responseData) && responseData.length === 0) {
            mutateSearchState({ isOpen: true, hasResults: false });
          }
          setEnterIsClicked(enterKeyIsClicked);
          setDropdownIsOpen(noResults && !enterKeyIsClicked);
          setBackdrop(noResults && !enterKeyIsClicked);
          setIsLoading(false);
        });
  };

  const getLocalStorageSearchHistory = () => {
    // will get value only when they click once on input
    mutateSearchState({ isOpen: false, hasResults: false });
    mutateArticleSliderState({ initial: false, isLoading: false });
    const history = getSearchHistory();
    setDropdownIsOpen(suggestions || history);
    !suggestions && setSearchData(history || []);
    setBackdrop(true);
  };

  const resetFilters = () => {
    Object.keys(filters).forEach(item => Url.removeParam(item));
    reset_filters && mutateReset({ ...reset_filters, close: URL_KEYS.FILTER_TYPE });
    Url.removeParam(URL_KEYS.LONGITUDE);
    Url.removeParam(URL_KEYS.LATITUDE);
    Url.removeParam(URL_KEYS.URL);
    m({});
  };

  const reset = () => {
    setDropdownIsOpen(false);
  };

  const onDeleteText = () => {
    const history = getSearchHistory();
    setSearchData(history);
    setTextSearch("");
    searchRef.current.value = "";
    mutateSearchState({ isOpen: false, hasResults: false });
    mutatePredefinedFiltersState(true);
    Url.removeParam(URL_KEYS.SEARCH);
    // Url.removeParam(URL_KEYS.LATITUDE);
    // Url.removeParam(URL_KEYS.LONGITUDE);

    isSearchOrMapPage && Url.changeURL();
    isSearchOrMapPage && mapFetcher();
  };

  useEffect(() => {
    document.body.style.overflowY = state?.state || dropdownIsOpen ? "hidden" : "auto";
  }, [state?.state, dropdownIsOpen]);

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!dropdownIsOpen) return;

    const handleClick = ({ target }) => {
      if (target.id === "search" || target.id === "delete-text" || target.id.includes("arrow-icon")) return;
      if (dropdownRef.current && !dropdownRef.current?.contains(target) && !searchRef.current?.contains(target)) {
        reset();
        setBackdrop(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, [dropdownIsOpen]);

  useEffect(() => {
    if (searchData && dropdownIsOpen && searchData.length === 0 && searchHistory) {
      mutateSearchState({ isOpen: true, hasResults: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownIsOpen, searchData?.length, searchHistory]);

  useEffect(() => {
    const hasFilters = !!Object.keys(filters).length;

    if (!state?.state && hasFilters) {
      setActiveList(!state?.state);
    }

    if (state?.state) {
      setActiveList(false);
    }
  }, [state?.state]);

  useEffect(() => {
    // ON PAGE CHANGE
    setDropdownIsOpen(false);
    setBackdrop(false);
    if (searchRef.current && Url.getParam(URL_KEYS.SEARCH)) {
      const text = isSearchOrMapPage ? decodeURI(Url.getParam(URL_KEYS.SEARCH) as string) : "";
      searchRef.current.value = text;
      setTextSearch(text);
    }
    setSuggestions(false);
    mutateSearchState({ isOpen: true, hasResults: false });
    // eslint-disable-next-line
  }, [pathname]);

  const getHighlightedText = (text, higlight) => {
    // Split text on higlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${higlight})`, "gi"));

    if (higlight) {
      return (
        higlight &&
        parts.map((part, idx) => (
          <span key={`SEARCH_TEXT_HIGHLIGHTED${text}__${text + idx}`}>
            {part.toLowerCase() === higlight.toLowerCase() ? (
              <span className={`${styles.search__text__higlighted}`}>{part}</span>
            ) : (
              part
            )}
          </span>
        ))
      );
    }

    return text;
  };

  const fetchSuggestionHandler = () => {
    getSuggestions();
    setSuggestions(true);
  };

  const onDeleteTextHandler = () => {
    onDeleteText();
    setTimeout(() => {
      mutateSearchState({ isOpen: false, hasResults: true });
    }, 1000);
    getLocalStorageSearchHistory();
    setSuggestions(false);
    mutateArticleSliderState({ initial: false, isLoading: false });
  };

  const updateMap = (val, isOpen, toFetch = false) => {
    // isMapPage && Url.removeParam(URL_KEYS.URL);
    // if (isMapPage) Object.keys(Url.getParams()).forEach(key => Url.removeParam(key));
    Url.changeParam([URL_KEYS.SEARCH, val]);
    isSearchOrMapPage && Url.changeURL();
    toFetch && isSearchOrMapPage && mapFetcher();
    !isOpen && setBackdrop(false);
    !isOpen && mutatePredefinedFiltersState(false);
  };

  const updateTextAndMapHandler = (val, isOpen, toFetch = false) => {
    setTextSearch(val);
    searchRef.current.value = val;
    updateMap(val, isOpen, toFetch);
    mutateSearchState({ isOpen, hasResults: true });
  };

  const onPageCheck = useCallback(
    (val: string) => {
      if (!isSearchOrMapPage) {
        push({
          pathname: WEB_PAGES.MAP,
          query: { textSearch: val },
        });
      }
    },
    [isSearchOrMapPage],
  );

  const onEnterConfirm = ev => {
    if (ev.key === "Enter" || ev.keyCode === 13) {
      setInputValueToLocalStorage(ev.target.value);
      reset();
      resetFilters();
      debounce(() => {
        getSuggestions(true);
        mutateSearchState({ isOpen: false, hasResults: true });
        updateMap(textSearch, false, true);
      }, 500);
      ev.target.blur();
      onPageCheck(ev.target.value);
    }
  };

  // CALLS SEARCH ENDPOINT ON CHANGE AND UPDATES DATA
  const onInputChangeHandler = ev => {
    setTextSearch(ev.target.value);
    !ev.target.value && setDropdownIsOpen(false);
    debounce(() => {
      if (ev.target.value !== "") {
        if (ev.target.value.length < 4 && ev.target.value.length > 0) return;
        setIsLoading(true);
        Url.changeParam([URL_KEYS.SEARCH, ev.target.value]);
        fetchSuggestionHandler();
      } else {
        Url.removeParam(URL_KEYS.SEARCH);
        onDeleteTextHandler();
        mutateSearchState({ isOpen: false, hasResults: true });
      }
    }, 500);
  };

  // SETS SUGGESTION ON CLICK AND UPDATES LOCAL STORAGE
  const onSetSuggestionHandler = val => {
    reset();
    resetFilters();
    setSuggestions(true);
    setInputValueToLocalStorage(val);
    updateTextAndMapHandler(val, false, true);
    onPageCheck(val);
    //  Url.changeURL();
  };

  // INSERTS TEXT INTO INPUT ON ARROW CLICK
  const onInsertTextHandler = val => {
    // DO NOTHING IF VALUE IS THE SAME

    if (val === textSearch) return;
    setIsLoading(true);
    updateTextAndMapHandler(val, true);
    mutateSearchState({ isOpen: false, hasResults: true });
    debounce(() => {
      if (val.length < 4 && val.length > 0) return;
      fetchSuggestionHandler();
    }, 500);
    searchRef.current.focus();
    mutateArticleSliderState({ initial: false, isLoading: false });
  };

  let modifiedRadiusStyle;

  if (isMapPage || !isSearchOrMapPage) {
    modifiedRadiusStyle = dropdownIsOpen && searchData;
  }

  if (isListPage) {
    modifiedRadiusStyle = (dropdownIsOpen && searchData && searchData.length > 0) || (dropdownIsOpen && searchData);
  }

  return (
    <>
      <div className={`${styles.search} ${styles.search__header}`}>
        <div className={`${styles.search__wrapper}`}>
          {textSearch && (
            <button
              type="button"
              className={`${styles.search__wrapper__closeButton} ${
                !isSearchOrMapPage && styles.search__wrapper__closeButton__rightPostion
              }`}
              onClickCapture={onDeleteTextHandler}
            >
              <Image id="delete-text" src={icons.close} alt="close-image" />
            </button>
          )}
          <input
            className={`${styles.search__input} ${styles.search__input__headerInputFocus} ${
              modifiedRadiusStyle ? styles.search__headerInputRadiusModified : ""
            }`}
            placeholder="Suchen"
            autoComplete="off"
            defaultValue={textSearch}
            value={textSearch}
            onChange={onInputChangeHandler}
            onKeyDownCapture={onEnterConfirm}
            onClickCapture={getLocalStorageSearchHistory}
            ref={searchRef}
            id="search"
            onFocus={() => {
              if (searchRef.current) {
                searchRef.current.inputMode = "text";
              }
            }}
            type="text"
          />
          {dropdownIsOpen && searchData?.length > 0 && (
            <div className={`${styles.search__list__wrapper} ${styles.search__list__headerWrapper}`}>
              {isLoading && (
                <ul
                  ref={dropdownRef}
                  className={`${styles.search__list}  ${searchData.length > 5 ? styles.search__list__scroll : ""}`}
                >
                  <span className={styles.search__loader} />
                </ul>
              )}
              {!isLoading && (
                <ul
                  ref={dropdownRef}
                  className={`${styles.search__list}  ${searchData.length > 5 ? styles.search__list__scroll : ""}`}
                >
                  {searchData.map((value, idx) => {
                    return (
                      <li key={`SEARCH_HEADER_ITEM_${value}__${value + idx}`}>
                        <div aria-hidden="true" onClickCapture={() => onSetSuggestionHandler(value)}>
                          <Image
                            src={suggestions ? icons.search : icons.iconReload}
                            alt={`${suggestions ? "search" : "reload"}-icon`}
                          />
                          {textSearch && textSearch.length > 0 && suggestions ? (
                            <span>{getHighlightedText(value, textSearch)}</span>
                          ) : (
                            <span>{value}</span>
                          )}
                        </div>
                        <div aria-hidden="true" onClickCapture={() => onInsertTextHandler(value)}>
                          <Image src={icons.arrowLeftUp} alt="arrow" id={`arrow-icon-${idx}`} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          {dropdownIsOpen && searchData?.length === 0 && (
            <div
              className={`${styles.search__list__wrapper} ${styles.search__list__headerWrapper} ${styles.search__list__headerWrapper__autoHeight}`}
            >
              <ul ref={dropdownRef} className={`${styles.search__list} ${styles.search__list__autoHeight}`}>
                <NoResultsParagraph inPageBody={enterIsClicked} />
              </ul>
            </div>
          )}

          {isSearchOrMapPage && (
            <button
              id="filter-button"
              className={
                state?.state
                  ? `${styles.search__filter} ${styles.openFilter}`
                  : `${styles.search__filter} ${isAnimatedBtn && styles.search__filter__animated}`
              }
              type="button"
              onClick={handleFilterButton}
            >
              Filter
            </button>
          )}
        </div>
      </div>
      <Portal>{backdrop && <Backdrop type="over-header" onClose={() => setBackdrop(false)} />}</Portal>
    </>
  );
};

export default HeaderSearch;
