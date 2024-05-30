import { SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { SWRConfig, mutate } from "swr";
import EntityFilters from "../components/filters/EntityFilters";
import Filters from "../components/filters/Filters";
import Loader from "../components/loader";
import Sort from "../components/sort/Sort";
import { mapFetcher } from "../utils/fetchers";
import filtersFetcher from "../utils/fetchers/filtersFetcher";
import Url from "../utils/urlHandler";

// imported dynamically because list requires window API
const CategoryComponent = dynamic(() => import("../components/category/Category"), {
  ssr: false,
});

// imported dynamically because of hydration error
const SummaryComponent = dynamic(() => import("../components/summary/Summary"), {
  ssr: false,
});

export default function List() {
  const isFetched = useRef(false);

  useEffect(() => {
    const fetch = async () => {
      [URL_KEYS.ALLOWGEO, URL_KEYS.ALLOWNONGEO, URL_KEYS.SEASON].forEach(key => {
        if (!Url.hasParam(key)) {
          // @ts-ignore
          Url.changeParam([key, [URL_KEYS.ALLOWGEO, URL_KEYS.ALLOWNONGEO].includes(key)]);
        } else {
          // @ts-ignore
          Url.changeParam([key, String(Url.getParam(key)) === "true"]);
        }
      });

      await mutate(SWR_KEYS.FILTER, filtersFetcher);
      await mapFetcher();
    };

    [URL_KEYS.LONGITUDE, URL_KEYS.LATITUDE, URL_KEYS.URL].forEach(key => Url.removeParam(key));

    if (!isFetched.current) {
      fetch();
      isFetched.current = true;
    }
    // eslint-disable-next-line
  }, []);

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.FILTER_STATE]: Url.getParams(),
        },
      }}
    >
      <NextSeo title="Lexikon" description="Page description" />
      <Filters />
      <Loader />
      <div className="container lexiconContainer">
        <div className="wrapflex">
          <SummaryComponent />
          <EntityFilters />
          <Sort />
        </div>
        <CategoryComponent />
      </div>
    </SWRConfig>
  );
}
