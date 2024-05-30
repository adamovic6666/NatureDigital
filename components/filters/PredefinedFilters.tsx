import { API_ENDPOINTS, REQUEST_SECRET, SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/predefinedFilters.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { mapFetcher } from "../../utils/fetchers";
import { searchRef } from "../../utils/fetchers/mapFetcher";
import Url from "../../utils/urlHandler";

const getSlicedRandomFilters = (arr, num) => {
  if (!arr) return null;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const PredefinedFilters = () => {
  const { data: filters = Url.getParams() || {}, mutate: m } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const { data: searchData } = useSWR<SWRTypes["SEARCH"]>(SWR_KEYS.SEARCH);
  const { data: isOpen, mutate: mutatePredefinedFiltersState } = useSWR<SWRTypes["PREDEFINEDFILTERS_STATE"]>(
    SWR_KEYS.PREDEFINEDFILTERS_STATE,
  );
  const { mutate: setActiveList, data: activeListState } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(
    SWR_KEYS.ACTIVE_LIST_STATE,
  );
  const { mutate: mutateSearchState } = useSWR<SWRTypes["SEARCH_STATE"]>(SWR_KEYS.SEARCH_STATE);
  const { data: reset_filters, mutate: mutateReset } = useSWR<SWRTypes["RESET_FILTERS"]>(SWR_KEYS.RESET_FILTERS);

  const { query } = useRouter();
  const [allFilters, setAllFilters] = useState<any[]>([]);

  const getModifiedPredefinedFilters = arr => {
    // // PUSH TO ALL FILTERS WITH NEW OBJ
    const f = [];
    arr &&
      arr?.forEach(item => {
        const newObject = {
          label: "",
          isPredefined: false,
          items: [],
          filterType: "",
          type: "",
        };

        const paramEntries = Object.entries(item.params).flat()[1];

        // CATEGORY - type
        newObject.type = paramEntries && Object.entries(paramEntries).flat()[0];

        // ITEMS
        newObject.items =
          paramEntries &&
          Object.entries(paramEntries)
            .flat()[1]
            .map(({ value }) => value);

        // Filter type
        newObject.filterType = item.params && Object.entries(item.params).flat()[0];

        // TITLE
        newObject.label = item.title!;
        // IS PREDEFINED
        newObject.isPredefined = true;
        f.push(newObject as never);
      });
    return f;
  };

  const getModifiedRandomFilters = arr => {
    // // PUSH TO ALL FILTERS WITH NEW OBJ
    const f = [];
    arr &&
      arr?.forEach(item => {
        if (item?.params !== undefined) {
          const newObject = {
            label: "",
            isPredefined: false,
            filterType: "",
            type: "",
            id: null,
          };

          const d = Object.entries(item?.params).flat();

          // CATEGORY - filterType
          newObject.filterType = d[0] === "fungi" ? "fungusAndLichen" : (d[0] as any);

          const datas = Object.entries(d?.[1] as any[] | number).flat();

          // SUBCATEGORY - TYPE
          newObject.type = datas?.[0];
          const valueObject = datas?.[1];

          // SUBCATEGORY ID
          newObject.id = valueObject?.[0]?.value;

          // LABEL
          newObject.label = valueObject?.[0]?.label;
          f.push(newObject as never);
        }
      });

    return f;
  };

  const resetFilters = () => {
    m({});
    Object.keys(filters).forEach(item => Url.removeParam(item));

    reset_filters && mutateReset({ ...reset_filters, close: URL_KEYS.FILTER_TYPE });
  };

  const onRefetchHandler = async filter => {
    const { filterType, isPredefined, type, id, items } = filter;

    // for predefined filters when items length === 1 ===> { filterType: "someType", [type] : STRING }
    // for predefined filters when items length > 1 : { filterType: "someType", [type] : ARRAY }

    if (Object.keys(filters).length > 0) {
      resetFilters();
    }
    if (query.url) {
      Url.removeParam(URL_KEYS.URL);
      Url.changeURL();
      // mapFetcher();
    }

    isPredefined
      ? await m({ [type]: items.length > 1 ? items : items[0], [URL_KEYS.FILTER_TYPE]: filterType })
      : m({ [type]: id, [URL_KEYS.FILTER_TYPE]: filterType });

    // PREDEFINED FILTERS CONTAINS ARRAY OF ID-S, AND RANTOM ONLY ONE ID
    isPredefined ? Url.changeParam([type, items]) : Url.changeParam([type, id]);

    // ADD FILTER TYPE
    Url.changeParam([URL_KEYS.FILTER_TYPE, filterType]);

    mapFetcher();
    mutatePredefinedFiltersState(!isOpen);
    mutateSearchState({ isOpen: true, hasResults: false });
    setActiveList(true);
  };

  useEffect(() => {
    const getFilters = async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SETTINGS}`, {
        headers: {
          secretkey: REQUEST_SECRET,
        },
      });

      // FILTERED PREDEFINED FILTERS
      const filteredPredefinedFilters = data && data?.predefined_filters?.filter(f => f && f.status === "active");
      const modifiedPredefinedFilters = getModifiedPredefinedFilters(filteredPredefinedFilters);

      // SLICED RANDOM FILTERS
      const slicedRandomFilters = getSlicedRandomFilters(data?.random_filters, 4);
      const modifiedRandomFilters = getModifiedRandomFilters(slicedRandomFilters);
      setAllFilters([...modifiedPredefinedFilters, ...modifiedRandomFilters]);
    };

    getFilters();
  }, []);

  if (
    searchRef?.current?.value ||
    (Array.isArray(searchData) && searchData.length > 0 && Object.keys(filters).length > 0) ||
    Object.keys(filters).length > 0
  )
    return null;

  return (
    <div className={styles.predefinedFilters__wrapper}>
      <div className={`${styles.predefinedFilters} ${activeListState && styles["predefinedFilters--with-max-width"]}`}>
        <ul>
          {allFilters?.map(filter => {
            return (
              <li
                onClickCapture={() => {
                  onRefetchHandler(filter);
                }}
                key={`PREDEFINED_FILTER_${filter?.label}`}
              >
                {filter?.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PredefinedFilters;
