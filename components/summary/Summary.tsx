import { SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/summary.module.scss";
import Image from "next/image";
import { ReactNode, useCallback } from "react";
import useSWR from "swr";
import { mapFetcher } from "../../utils/fetchers";
import { searchRef } from "../../utils/fetchers/mapFetcher";
import Url from "../../utils/urlHandler";

const { close } = icons;

type FilterPillProps = {
  key: string;
  handleRemove: (key: string, value: string) => void;
  value: string;
  id: string;
};

const FilterPill = (props: FilterPillProps) => {
  const { key, value, id, handleRemove } = props;

  // KADA SE DODA NA PARENTA ONDA SE SJEBE
  return (
    <li
      key={`SUMMARY_ITEM_${id}`}
      className={`${styles.summary__listItem} summaryListItem`}
      onClickCapture={() => handleRemove(key, id)}
    >
      <Image src={close} alt="arrow" />
      <span>{value}</span>
    </li>
  );
};

const urlContainsLatAndLng = filters => filters.hasOwnProperty("lat") && filters.hasOwnProperty("lng");
const getFilterValuesWithouLatAndRest = filters => {
  // eslint-disable-next-line
  const { lat, lng, ...rest } = filters;
  return rest;
};

const Summary = () => {
  const { data: filters, mutate } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const { data: filterOptions } = useSWR<SWRTypes["FILTER"]>(SWR_KEYS.FILTER);
  const { mutate: mutatePredefinedFiltersState } = useSWR<SWRTypes["PREDEFINEDFILTERS_STATE"]>(
    SWR_KEYS.PREDEFINEDFILTERS_STATE,
  );
  const { data: reset, mutate: mutateReset } = useSWR<SWRTypes["RESET_FILTERS"]>(SWR_KEYS.RESET_FILTERS);
  const { mutate: mutateArticleSliderState } = useSWR<SWRTypes["ARTICLE_SLIDER_STATE"]>(SWR_KEYS.ARTICLE_SLIDER_STATE);
  const { data: activeListState } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);

  const handleRemove = useCallback(
    (type, id) => {
      if (filters) {
        let modifiedFilters = JSON.parse(JSON.stringify(filters));

        urlContainsLatAndLng(modifiedFilters);
        if (urlContainsLatAndLng(modifiedFilters)) {
          modifiedFilters = getFilterValuesWithouLatAndRest(modifiedFilters);
        }

        if (Array.isArray(modifiedFilters[type])) {
          const isInFilters = modifiedFilters[type].includes(id);

          const newFilters = isInFilters
            ? (modifiedFilters[type] as string[]).filter?.(filterId => filterId !== id)
            : [...modifiedFilters[type], id];

          if (newFilters.length > 1) {
            modifiedFilters[type] = newFilters;
          } else {
            // eslint-disable-next-line
            modifiedFilters[type] = newFilters[0];
          }
        } else if (modifiedFilters[type]) {
          if (modifiedFilters[type] === id) {
            delete modifiedFilters[type];

            // if there is no more filters, remove ['filterType']
            if (JSON.stringify(modifiedFilters) === "{}" || Object.keys(modifiedFilters).length === 1) {
              Url.removeParam(URL_KEYS.FILTER_TYPE);
              delete modifiedFilters[URL_KEYS.FILTER_TYPE];
            }
            // Url.removeParam(URL_KEYS.FILTER_TYPE);
          } else {
            modifiedFilters[type] = [modifiedFilters[type] as string, id];
          }
        }

        if (modifiedFilters[type]) {
          Url.changeParam([type, modifiedFilters[type]]);
        } else {
          Url.removeParam(type);
        }

        mutate({ ...modifiedFilters });
        JSON.stringify(modifiedFilters) === "{}" && reset && mutateReset({ ...reset, close: type });
        mutatePredefinedFiltersState(!searchRef?.current?.value && JSON.stringify(modifiedFilters) === "{}");
        mutateArticleSliderState({ isLoading: false, initial: false });

        mapFetcher();
      }
    },
    // eslint-disable-next-line
    [filters],
  );

  if (!filters) return null;
  const filterType = filters[URL_KEYS.FILTER_TYPE];
  // eslint-disable-next-line
  const { lat, lng, allowGeo, allowNonGeo, ...rest } = filters;

  return (
    <div className={styles.summary__wrapper}>
      <div
        className={`${styles.summary} ${Object.keys(rest).length === 0 && styles.summary__noPaddingTop} ${
          activeListState && styles["summary--with-max-width"]
        } summary`}
      >
        <ul className={styles.summary__list}>
          {Object.entries(rest).reduce<ReactNode[] | null>((arr, [key, value]) => {
            if (key !== URL_KEYS.FILTER_TYPE) {
              if (Array.isArray(value)) {
                value.forEach(item => {
                  if (!filterOptions?.data?.[filterType as string]) return null;
                  const i = filterOptions?.data?.[filterType as string]?.[key]?.filter(({ value: v }) => v === item);
                  if (i && !i[0]?.label) return null;
                  const label = (i && i[0]?.label) || item;
                  return arr && arr.push(FilterPill({ key, value: label, handleRemove, id: item }));
                });
              } else {
                if (!filterOptions?.data?.[filterType as string]) return null;
                const i = filterOptions?.data?.[filterType as string]?.[key]?.filter(({ value: v }) => v === value);
                if (i && !i[0]?.label) return null;
                const label = i && i[0]?.label;
                arr && arr.push(FilterPill({ key, value: label, handleRemove, id: value }));
              }
            }
            return arr;
          }, [])}
        </ul>
      </div>
    </div>
  );
};

export default Summary;
