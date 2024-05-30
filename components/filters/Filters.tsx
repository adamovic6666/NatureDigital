import { SWR_KEYS, TEXTS, URL_KEYS, WEB_PAGES } from "@nature-digital/constants";
import {
  FilterDataDataType,
  FilterItemProps,
  FilterLevelProps,
  FilterListProps,
  SWRTypes,
} from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/filters.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { mapFetcher } from "../../utils/fetchers";
import Url from "../../utils/urlHandler";
import Backdrop from "../backdrop/Backdrop";
import Portal from "../portal/Portal";

const { arrow } = icons;

const urlContainsLatAndLng = filters => filters.hasOwnProperty("lat") && filters.hasOwnProperty("lng");
const getFilterValuesWithouLatAndRest = filters => {
  // eslint-disable-next-line
  const { lat, lng, ...rest } = filters;
  return rest;
};
/**
 *
 * Renders each filter
 *
 */
const FilterItem = (props: FilterItemProps) => {
  const {
    type,
    label,
    id,
    filterType,
    selectedFilterType,
    setChecked,
    optionCount,
    setInitiallyCheck,
    initiallyCheckedId,
  } = props;
  const [initial, setInitial] = useState(true);

  // eslint-disable-next-line
  let { data: filters = Url.getParams() || {}, mutate: m } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const disabled = filters.hasOwnProperty(URL_KEYS.FILTER_TYPE) && filters[URL_KEYS.FILTER_TYPE] !== filterType;
  const handleChange = useCallback(
    ev => {
      ev.nativeEvent.stopImmediatePropagation();

      if (urlContainsLatAndLng(filters)) {
        filters = getFilterValuesWithouLatAndRest(filters);
      }

      // check if there is already ['filters.filterType'] with the provided ['filterType']
      if (disabled) {
        Object.keys(filters).forEach(key => Url.removeParam(key));
        // eslint-disable-next-line
        filters = {};
      }
      setInitiallyCheck(id);
      setInitial(false);

      if (optionCount < 2) {
        ev.target.checked ? setChecked(ev.target.checked) : setChecked(!filters[type]?.includes(id));
      }

      if (typeof filters[type] === "string" && optionCount === 2) {
        ev.target.checked ? setChecked(ev.target.checked) : setChecked(!filters[type]?.includes(id));
      }

      // if ['id'] is in ['filters[type]'] then remove it
      if (Array.isArray(filters[type]) && optionCount !== 1) {
        const isInFilters = filters[type].includes(id);
        let newFilters = isInFilters
          ? (filters[type] as string[]).filter?.(filterId => filterId !== id)
          : [...filters[type], id];

        if (filters[type].length === 1) {
          newFilters = filters[type] as string[];
        }

        setChecked(optionCount === newFilters.length);

        filters[type] = newFilters.length > 1 ? newFilters : newFilters[0];
      } else if (filters[type]) {
        const modifiedFilters = Array.isArray(filters[type]) ? { ...filters, [type]: filters[type][0] } : filters;
        if (modifiedFilters[type] === id) {
          delete modifiedFilters[type];

          filters = modifiedFilters;

          // if there is no more filters, remove ['filterType']
          if (JSON.stringify(filters) === "{}" || Object.keys(modifiedFilters).length === 1) {
            Url.removeParam(URL_KEYS.FILTER_TYPE);
            delete filters[URL_KEYS.FILTER_TYPE];
          }
        } else {
          filters[type] = [filters[type] as string, id];
        }
      } else {
        filters[type] = id;
        Url.changeParam([URL_KEYS.FILTER_TYPE, filterType]);
        filters[URL_KEYS.FILTER_TYPE] = filterType;
      }

      if (filters[type]) {
        Url.changeParam([type, filters[type]]);
        // mutatePredefinedFiltersState(true);
      } else {
        if (JSON.stringify(filters) === "{}") {
          Url.removeParam(URL_KEYS.FILTER_TYPE);
          // mutatePredefinedFiltersState(false);
        }
        Url.removeParam(type);
      }

      m({ ...filters });
      mapFetcher();
    },
    // eslint-disable-next-line
    [filters, disabled, setChecked],
  );

  return (
    <li className={styles.filters__subItem} onClickCapture={handleChange}>
      <span className={`${styles.filters__subItem__subLabel} ${styles.filterLabel}`}>
        <div className="formItem formTypeCheckbox filter" aria-hidden="true">
          <div className={`${styles.filterLabel__wrap}`}>
            <input
              type="checkbox"
              checked={
                (filters[type]?.includes(id) && filterType === selectedFilterType) ||
                (initiallyCheckedId === id && initial) ||
                false
              }
              onChange={handleChange}
            />
            <div className="formTypeCheckbox__label">{label}</div>
          </div>
        </div>
      </span>
    </li>
  );
};

/**
 *
 * Renders each vertical level of filters
 *
 */
const FilterList = ({ label, items, level, filterType, checked: c, sum }: FilterListProps) => {
  const { data: reset } = useSWR<SWRTypes["RESET_FILTERS"]>(SWR_KEYS.RESET_FILTERS);
  let levelTwoCheckedCount = 0;
  // eslint-disable-next-line
  const {
    data: { data: filters = Url.getParams() || {}, filterType: selectedFilterType } = Url.getParams() || {},
    mutate: m,
  } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(c);
  const [initiallyCheckedId, setInitiallyCheckedId] = useState("");

  if (typeof filters[label] === "string") {
    levelTwoCheckedCount = 1;
  } else if (Array.isArray(filters[label])) {
    levelTwoCheckedCount = filters?.[label]?.length;
  }

  useEffect(() => {
    if (checked !== c) {
      setChecked(c);
    }
    // eslint-disable-next-line
  }, [c]);

  useEffect(() => {
    if (reset?.close !== filterType && reset?.close) {
      setOpen(false);
    }

    if (filterType !== selectedFilterType) {
      setChecked(false);
    }

    if (reset?.reset !== filterType && reset?.reset) {
      setChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, setChecked, setOpen, filterType, selectedFilterType]);

  const options = useMemo(
    () =>
      Array.isArray(items) ? (
        items.map(({ label: childLabel, value }) => (
          <FilterItem
            key={`FILTER_ITEM_${value}`}
            setChecked={setChecked}
            filterType={filterType}
            selectedFilterType={selectedFilterType}
            label={childLabel}
            optionCount={items.length}
            id={value}
            type={label}
            setInitiallyCheck={id => {
              setInitiallyCheckedId(prev => (prev === id ? "" : id));
            }}
            initiallyCheckedId={initiallyCheckedId}
          />
        ))
      ) : (
        // eslint-disable-next-line
        <FilterLevel filterType={filterType} filter={items} level={level + 1} checked={checked} sum={sum} />
      ),
    // eslint-disable-next-line
    [items, checked, setChecked, initiallyCheckedId, selectedFilterType],
  );

  const handleSelectAll = useCallback(
    async (state: boolean, possibleOptions = items, possibleLabel = label) => {
      Url.removeParam(URL_KEYS.URL);
      if (Array.isArray(possibleOptions)) {
        const values =
          possibleOptions.length > 1 ? possibleOptions.map(({ value }) => value) : possibleOptions[0].value;

        if (state) {
          await mutate(SWR_KEYS.FILTER_STATE, prev => {
            if (urlContainsLatAndLng(prev)) {
              prev = getFilterValuesWithouLatAndRest(prev);
            }

            if (prev?.[URL_KEYS.FILTER_TYPE] && prev?.[URL_KEYS.FILTER_TYPE] !== filterType) {
              Object.keys(prev).forEach(key => Url.removeParam(key));

              prev = {};
            }

            return { ...prev, [possibleLabel]: values, [URL_KEYS.FILTER_TYPE]: filterType };
          });
          Url.changeParam([possibleLabel, values]);
          Url.changeParam([URL_KEYS.FILTER_TYPE, filterType]);
        } else {
          let isFilters = 0;

          await mutate(SWR_KEYS.FILTER_STATE, prev => {
            delete prev[possibleLabel];

            isFilters = Object.keys(prev).length;

            // mutatePredefinedFiltersState(!!isFilters);

            return { ...prev };
          });

          Url.removeParam(possibleLabel);

          if (isFilters === 1) {
            Url.removeParam(URL_KEYS.FILTER_TYPE);
          }
        }
      } else if (Object.keys(possibleOptions).length) {
        await Promise.all(
          Object.entries(items).map(([key, value]) => handleSelectAll(state, value as FilterDataDataType, key)),
        );
      }
    },
    // eslint-disable-next-line
    [items, checked],
  );

  useEffect(() => {
    m({ ...Url.getParams() });
    // SELECT ALL IF LEVEL IS 1 AND URL PARAMS CONTAINS ALL FILTER OPTIONS
    if (
      (level === 2 && selectedFilterType === filterType && filters?.[label]?.length === items?.length) ||
      (level === 2 &&
        selectedFilterType === filterType &&
        typeof filters?.[label] === "string" &&
        (items?.length as unknown as number) === 1)
    ) {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={open ? `${styles.filters__mainItem} ${styles.filters__mainItemOpen}` : `${styles.filters__mainItem}`}
    >
      {/* eslint-disable-next-line */}
      <div
        onClickCapture={() => {
          level === 1 && setOpen(!open);
          level === 1 && mutate(SWR_KEYS.RESET_FILTERS, { close: filterType });
        }}
        className={
          open
            ? `${styles.filters__mainLabel} ${styles.filterLabel} formItem formTypeCheckbox filter filterOpen`
            : `${styles.filters__mainLabel} ${styles.filterLabel} formItem formTypeCheckbox filter`
        }
      >
        <div
          className={`${styles.filterLabel__wrap}`}
          onClickCapture={async ev => {
            // eslint-disable-next-line
            if (level >= 2 && ev.target["tagName"] !== "INPUT") {
              setOpen(!open);
            }
          }}
        >
          {level > 1 && (
            <input
              type="checkbox"
              className={`${
                level === 2 && filterType === selectedFilterType && levelTwoCheckedCount > 0 && styles.checkbox__partial
              }`}
              // DOUBLE CHECK THIS
              onChange={async e => {
                const f = Url.getParams();
                if (level === 2) {
                  // delete f[URL_KEYS.FILTER_TYPE];
                  // Url.removeParam(URL_KEYS.FILTER_TYPE);
                }
                setChecked(e.target.checked);
                mutate(SWR_KEYS.RESET_FILTERS, { reset: filterType });
                // m({ ...f });
                await handleSelectAll(e.target.checked);
                mapFetcher();

                if (level === 2) {
                  // mutatePredefinedFiltersState(false);
                  if (!e.target.checked && Object.keys(f).length < 3) {
                    // mutatePredefinedFiltersState(true);
                    // delete f[URL_KEYS.FILTER_TYPE];
                    m({});
                  }
                }
              }}
              checked={checked && !!selectedFilterType}
            />
          )}
          <div className="formTypeCheckbox__label levelTwoLabel" style={{ paddingRight: "19px" }}>
            {label === "specieGroup" ? TEXTS.Filter[label](TEXTS.Filter[filterType]) : TEXTS.Filter[label]}
            {/* {level === 2 && filterType === selectedFilterType && levelTwoCheckedCount > 0 && <span>{}</span>} */}
            {level === 1 && filterType === selectedFilterType && sum > 0 && <span>{sum}</span>}
          </div>
        </div>
        <Image
          className="dropdown"
          src={arrow}
          alt="arrow"
          onClickCapture={() => {
            setOpen(!open);
            mutate(SWR_KEYS.RESET_FILTERS, { close: filterType });
          }}
        />
      </div>
      <ul
        className={open ? `${styles.filters__subMenu} ${styles.filters__subMenu__open}` : `${styles.filters__subMenu}`}
      >
        {options}
      </ul>
    </div>
  );
};

/**
 *
 * Renders each horizontal level of filters
 *
 */
const FilterLevel = ({ filter, level = 1, filterType = null, checked, sum }: FilterLevelProps) => {
  return (
    <>
      {Object.entries(filter).map(([label, items]) => {
        if (!label || !items) return;
        return (
          <FilterList
            key={`FILTER_LIST_${label}`}
            filterType={filterType || label}
            items={items as FilterDataDataType}
            label={label}
            level={level}
            checked={checked}
            sum={sum}
          />
        );
      })}
    </>
  );
};

const Filters = () => {
  const { data, mutate: filterMutate } = useSWR<SWRTypes["FILTER"]>(SWR_KEYS.FILTER);
  const { data: filters = Url.getParams() || {}, mutate: m } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const { data: reset, mutate: mutateReset } = useSWR<SWRTypes["RESET_FILTERS"]>(SWR_KEYS.RESET_FILTERS);
  const { mutate: setActiveList } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);

  const [doRotate, setDoRotate] = useState(false);

  const resetFilters = useCallback(() => {
    setDoRotate(true);
    m({});
    const forRemove = Object.keys(filters);
    forRemove.forEach(item => Url.removeParam(item));
    reset && mutateReset({ ...reset, close: URL_KEYS.FILTER_TYPE });
    mapFetcher();
    setTimeout(() => setDoRotate(false), 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, m]);

  const { pathname } = useRouter();
  const isMapPage = pathname === WEB_PAGES.MAP;
  let isOpenClass;

  if (!data?.data) {
    return null;
  }

  const objectValues: any[] | undefined =
    filters &&
    Object.entries(filters).map(val => {
      if (val.includes("filterType")) {
        return;
      }
      if (Array.isArray(val[1])) {
        return val[1].length;
      }
      if (typeof val[1] === "string" && !val.includes(URL_KEYS.FILTER_TYPE)) {
        return 1;
      }
      return null;
    });
  const filteredValues: any[] | undefined = objectValues && objectValues.filter(v => !!v);
  const sum = filteredValues && filteredValues.reduce((a, s) => +a + +s, []);
  if (data.state) {
    isOpenClass = isMapPage ? styles.filters__openOnMapPage : styles.filters__open;
  }

  return (
    <>
      <Portal>
        {data.state && (
          <Backdrop
            onClose={() => {
              setActiveList(true);
              filterMutate({ ...data, state: false });
            }}
          />
        )}
      </Portal>
      <div className={`${styles.filters} ${isOpenClass} filters`}>
        <div className={`container ${styles.filters__mainList}`}>
          <FilterLevel filter={data.data} sum={sum} />
          <div className={`${styles.filters__resetContainer}`}>
            <button
              className={`${styles.filters__resetButton} ${doRotate && styles.rotateIcon}`}
              type="button"
              onClick={resetFilters}
              aria-label="filter reset"
            >
              Reset all filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
